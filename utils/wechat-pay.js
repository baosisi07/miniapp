import payModel from '../models/pay/pay';
import commonModel from '../models/common';
import Yas from '../common/yas';

const PAYMENT_CODE = '56'; // 红人分销支付类型

let app = getApp();
let router = global.router;

const yas = new Yas(app);

function showErrorTip(text) {
    wx.showModal({
        content: text,
        showCancel: false,
        confirmText: '确定'
    });
}

function redirectOrdersPage(confirm, jump) {
    if (confirm) {
        wx.showModal({
            content: confirm,
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#000',
            complete: function() {
                jump && router.go('orderList', {type: 2}, 'redirectTo');
            }
        });
    } else {
        jump && router.go('orderList', {type: 2}, 'redirectTo');
    }
}

function reportPayStatus(orderCode, orderAmount, success) {
    yas.report('YB_SC_PAY_RES', {
        ORD_NUM: orderCode || '',
        ORDER_AMOUNT: orderAmount || '',
        PAY_TYPE: 1,
        PAY_RES: success ? 1 : 0
    });
}

function wechatPay(order) {
    order = order || {};

    let orderCode = order.order_code,
        orderAmount = order.order_amount;

    if (parseInt(orderAmount) <= 0) {
        router.go('paySuccess', {
            orderCode: orderCode,
            price: orderAmount
        });
    }

    if (!orderCode || !orderAmount) {
        reportPayStatus(orderCode, orderAmount);

        return showErrorTip('支付失败，请求参数不完整.');
    }

    let wechatSession = app.getWechatThirdSession();

    if (!wechatSession) {
        reportPayStatus(orderCode, orderAmount);

        return showErrorTip('支付失败，用户session未获取到.');
    }

    const needJump = order.needJump;

    wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
    });

    payModel.wechatPay({
        app_id: app.getAppId(),
        order_code: orderCode,
        payment_code: PAYMENT_CODE,
        '3rd_session': wechatSession
    }).then(res => {
        wx.hideToast();

        if (res.code !== 200) {
            return redirectOrdersPage(`${res.code}:${res.message}`, needJump);
        }

        let data = res.data;

        wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: function() {
                let prepareID = data.package;

                if (prepareID && prepareID.length > 10) {
                    prepareID = prepareID.slice(10);

                    // 上报formID
                    commonModel.addWechatFormId({
                        order_code: orderCode,
                        openId: app.getOpenID(),
                        miniapp_type: app.getMiniappType(),
                        formId: prepareID,
                        formType: 'pay',
                    });
                }

                reportPayStatus(orderCode, orderAmount, true);

                // 支付成功二次确认
                payModel.paySuccessConfirm({
                    order_code: orderCode,
                    payment_id: PAYMENT_CODE
                });

                router.go('paySuccess', {
                    orderCode: orderCode,
                    price: orderAmount
                });
            },
            fail: function(err) {
                let message = '';

                reportPayStatus(orderCode, orderAmount);

                if (err.errMsg !== 'requestPayment:fail cancel') {
                    message = err.errMsg;
                }
                redirectOrdersPage(message, needJump);
            },
            complete: function(err) {
                // 6.5.2 及之前版本中，用户取消支付不会触发 fail 回调，只会触发 complete 回调，回调 errMsg 为 'requestPayment:cancel'
                if (err.errMsg === 'requestPayment:cancel') {
                    redirectOrdersPage('', needJump);
                }
            }
        });
    }).catch(() => {
        return redirectOrdersPage('获取订单信息失败', needJump);
    });
}

module.exports = {
    wechatPay: wechatPay
};
