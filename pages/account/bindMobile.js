import wx from '../../utils/wx';
import event from '../../common/event';
import Yas from '../../common/yas';
import { getVerifyCode, bindMobileAction, isNeedImgCheck} from '../../common/login';

let app = getApp();
let router = global.router;
let yas;

Page({
    data: {
        areaCode: '86',
        phoneNum: '',
        smsCode: '',
        degrees: '0,0,0,0',
        btnText: '获取验证码',
        timerSec: 60,
        counting: false,
        regState: 0,
        activeClass: '',
        completeClass: '',
        areaName: '中国',
        hasUnionID: false,
        isSubmitting: false,
        autoBtnText: '自动验证',
        isNeedImgCheck: false
    },
    onLoad: function(query) {
        const {phone, area} = query || {};

        yas = new Yas(app);

        if (+area === 86 && phone) {
            this.setData({
                phoneNum: phone,
                activeClass: 'active'
            });
        }

        event.on('choose-area', params => {
            this.setData({
                areaCode: params.code,
                areaName: params.name
            });
        });

        event.on('register-type-report', params => {
            yas.report('YB_REGISTER_SUCCESS', params);
        });

        this.setData({
            hasUnionID: !!app.globalData.unionID
        });

        isNeedImgCheck().then(result => {
            if (result.code === 200) {
                this.setData({
                    isNeedImgCheck: result.data
                });
            } else {
                this.setData({
                    isNeedImgCheck: true
                });
            }
        });
        yas.pageOpenReport();
    },
    phoneInput: function(e) {
        this.setData({
            phoneNum: e.detail.value.trim(),
            activeClass: e.detail.value.trim() ? 'active' : '',
            completeClass: (this.data.smsCode && e.detail.value.trim()) ? 'active' : ''
        });
    },
    codeInput: function(e) {
        this.setData({
            smsCode: e.detail.value.trim(),
            completeClass: (this.data.phoneNum && e.detail.value.trim()) ? 'active' : ''
        });
    },
    sendCode: function() {
        if (!this.data.phoneNum || this.data.counting) {
            return;
        }

        if (this.checkPhoneFormat()) {
            return getVerifyCode(this.data.areaCode, this.data.phoneNum, this.data.degrees).then(res => {
                if (res.code === 200) {
                    this.countDown();
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.message || '验证码发送失败',
                        showCancel: false
                    });
                }
            })
                .catch(() => {
                    wx.showModal({
                        title: '提示',
                        content: '验证码发送失败',
                        showCancel: false
                    });
                });
        }

        wx.showModal({
            title: '提示',
            content: '手机号码格式不正确',
            showCancel: false
        });
    },

    // 倒计时
    countDown: function() {
        let seconds = 60;
        let timer = setInterval(() => {
            seconds--;
            if (seconds < 0) {
                this.setData({
                    btnText: '重新获取验证码',
                    timerSec: 60,
                    counting: false,
                });
                clearInterval(timer);
            } else {
                this.setData({
                    btnText: `${seconds}s`,
                    timerSec: seconds,
                    counting: true,
                });
            }
        }, 1000);

        this.setData({
            btnText: '60s',
            timerSec: 60,
            counting: true,
        });
    },
    submitTap: function() {
        if (!this.data.completeClass) {
            return;
        }

        if (!this.data.smsCode || !this.data.phoneNum) {
            return wx.showModal({
                title: '提示',
                content: '手机号码和验证码都不能为空',
                showCancel: false
            });
        }

        if (!this.checkPhoneFormat()) {
            return wx.showModal({
                title: '提示',
                content: '手机号码格式不正确',
                showCancel: false
            });
        }

        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });

        if (this.data.isSubmitting) {
            return;
        }

        this.data.isSubmitting = true;
        bindMobileAction(this.data.areaCode, this.data.phoneNum, this.data.smsCode)
            .then((res => {
                wx.hideToast();
                this.data.isSubmitting = false;
                if (res.code === 200) {
                    let userInfo = {};

                    userInfo.uid = res.data.uid;
                    userInfo.is_bind = res.data.is_bind || '';
                    userInfo.mobile = res.data.profile;
                    userInfo.ssouid = res.data.ssouid;
                    userInfo.sessionKey = res.data.session_key;

                    app.setUserInfo(userInfo);
                    app.setSessionKey(userInfo.sessionKey);

                    event.emit('user-login-success');
                    if (res.data && res.data.is_register === 0) {
                        event.emit('register-type-report', {YB_REGISTER_SUCCESS: 5});
                    }
                    wx.navigateBack();
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.message || '服务器错误',
                        showCancel: false
                    });
                }
            }))
            .catch(() => {
                this.data.isSubmitting = false;
                wx.showModal({
                    title: '提示',
                    content: '服务器错误',
                    showCancel: false
                });
                wx.hideToast();
            });
    },
    checkPhoneFormat: function() {

        // 手机号码验证规则
        let phoneRegx = {
            '+86': /^1[35847]{1}[0-9]{9}$/,
            '+852': /^[965]{1}[0-9]{7}$/,
            '+853': /^[0-9]{8}$/,
            '+886': /^[0-9]{10}$/,
            '+65': /^[98]{1}[0-9]{7}$/,
            '+60': /^1[1234679]{1}[0-9]{8}$/,
            '+1': /^[0-9]{10}$/,
            '+82': /^01[0-9]{9}$/,
            '+44': /^7[789][0-9]{8}$/,
            '+81': /^0[9|8|7][0-9]{9}$/,
            '+61': /^[0-9]{11}$/
        };

        return phoneRegx[`+${this.data.areaCode}`].test(this.data.phoneNum);
    },
    chooseArea: function() {
        router.go('chooseArea');
    },

    /**
     * 监听验证码组件
     */
    onRefreshCode: function(e) {
        this.setData({
            degrees: e.detail.degrees.join(',')
        });
    }
});
