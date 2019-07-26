import wx from '../utils/wx';
import event from '../common/event';
import Promise from '../vendors/es6-promise';
import accountModel from '../models/account/index';

/**
 * 用户未授权-发送验证码
 * @param mobile 手机号
 * @param area 国家码
 * @param degrees 验证码
 */
function sendVerifyCode(area, mobile, degrees) {
    return accountModel.sendSms(area, mobile, degrees);
}

/**
 * 用户已授权-发送验证码
 * @param mobile 手机号
 * @param area 国家码
 * @param degrees 验证码
 */
function sendVerifyCodeWithUnionId(area, mobile, degrees) {
    return accountModel.sendCodeByMiniApp(area, mobile, getApp().getOpenID(), degrees);
}

/**
 * 是否需要验证码
 */
function isNeedImgCheck() {
    return accountModel.isNeedImgCheck();
}

/**
 * 获取验证码按钮
 * @param area
 * @param mobile
 * @param degrees 验证码
 * @returns {*}
 */
function getVerifyCode(area, mobile, degrees) {
    let app = getApp();

    if (!app.globalData.unionID) {
        return sendVerifyCode(area, mobile, degrees);
    }

    return sendVerifyCodeWithUnionId(area, mobile, degrees);
}

/**
 * 用户未授权-直接登录
 * @param area 国家码
 * @param mobile 手机号
 * @param verifyCode 验证码
 */
function autoSignin(area, mobile, verifyCode) {
    return accountModel.autoSignIn(mobile, verifyCode, area);
}

/**
 * 用户已授权-校验验证码
 * @param area 国家码
 * @param mobile 手机号
 * @param verifyCode 验证码
 */
function checkVerifyCode(area, mobile, verifyCode) {
    return accountModel.bindMiniapp(getApp().globalData.unionID, mobile, verifyCode, area);
}

/**
 * 验证手机号
 * @param area
 * @param mobile
 * @param verifyCode
 */
function bindMobileAction(area, mobile, verifyCode) {
    if (!getApp().globalData.unionID) {
        return autoSignin(area, mobile, verifyCode);
    }
    return checkVerifyCode(area, mobile, verifyCode);
}

/**
 * 判断微信用户是否绑定
 * @param unionID
 * @param nickName
 * @returns {Promise.<TResult>|*}
 */
function wechatUserIsBind(unionID, nickName) {
    let app = getApp();

    return accountModel.wechatUserIsBind(unionID, nickName)
        .then(data => {
            wx.hideLoading();
            let res = {}
            if (data.data &&
                data.data.is_bind &&
                data.data.is_bind === 'Y') { // 已经绑定
                let userInfo = {};

                userInfo.is_bind = data.data.is_bind;
                userInfo.mobile = data.data.mobile;
                userInfo.ssouid = data.data.ssouid;
                userInfo.uid = data.data.uid;
                userInfo.sessionKey = data.data.session_key;

                app.setUserInfo(userInfo);
                app.setSessionKey(userInfo.sessionKey);
                res = {
                    code: 10003,
                    data: userInfo,
                    message: '微信用户已绑定手机号'
                };
            } else {
                res = {
                    code: 10004,
                    message: '微信用户未绑定手机号'
                };
            }
            return Promise.resolve(res)
        });
}

/**
 * 获取unionID、如果用户拒绝授权则无法获得unionID
 * @param srd_session
 * @param showMsg
 * @returns {Promise.<T>}
 */
function getUnionID(srd_session, showMsg) {
    let nickName;
    let app = getApp();

    return wx.getUserInfo()
        .then(res => {
            let userInfo = res.userInfo;

            nickName = userInfo.nickName;
            return accountModel.decodeUserInfo(srd_session, res.encryptedData, res.iv);
        })
        .then(data => {
            if (data.data.union_id) {
                app.setUnionID(data.data.union_id);
                return wechatUserIsBind(data.data.union_id, nickName);
            }
        })
        .catch(() => {
            let msg = {
                succeed: false,
                message: '使用微信小程序登录需要微信授权，您已经拒绝了该请求，请删除小程序重新进入。'
            };

            if (showMsg) {
                msg.code = 10001;
            }
            return Promise.reject(msg);
        });
}

/**
 * 微信授权登录
 * @param showMsg
 * @returns {Promise.<T>}
 */
function wechatAuthLogin() {
    let app = getApp();

    return wx.login()
        .then(res => {
            if (res.code) {
                return accountModel.wechatMiniAppLogin(res.code, app.getMiniappType());
            }
        })
        .then(data => {
            console.log(data);
            if (data.code !== 200) {
                return Promise.reject({
                    succeed: false,
                    message: data.message
                });
            } else {
                event.emit('login-type-report', {LOGIN_TYPE: 4});
                data = data.data;
                app.setOpenID(data.openid);
                app.setWechatThirdSession(data.srd_session);

                // 如果unionID不存在（未使用过任何有货微信产品的全新用户)
                if (data.unionid) {
                    app.setUnionID(data.unionid);

                    return wechatUserIsBind(data.unionid, '');
                }
            }
        })
        .catch(err => {
            return Promise.reject(err);
        });
}

/**
 * 用户手动点击登录
 * @returns {Promise.<T>}
 */
function tapToLogin(info) {
    let app = getApp();
    if (info.errMsg != 'getUserInfo:ok') {
        app.doLogin().then(r => {
            console.log(r)
        });
    } else {
        let userInfo = info.userInfo;
        let nickName = userInfo.nickName;

        return accountModel.decodeUserInfo(app.getWechatThirdSession(), info.encryptedData, info.iv).then(res => {
            if (res.data.union_id) {
                app.setUnionID(res.data.union_id);
                return wechatUserIsBind(res.data.union_id, nickName);
            } else {
                return global.router.go('bindMobile');
            }
        }).then(res => {
            if (res.code === 10003) { // 已经绑定手机号
                app.setUserInfo(res.data);
                app.setSessionKey(res.data.sessionKey);
                event.emit('user-login-success');
            }
            if (res.code === 10004) { // 手动授权登录未绑定强制绑定
                event.emit('user-login-callback');
            }
        }).catch(e=>{
            global.router.go('bindMobile');
        });
    }
}

/**
 * 验证sessionKey是否过期
 * @returns {*}
 */
// function verifySessionKey() {
//     return accountModel.verify();
// }
const checkUidAndSessionKey = async(uid, session_key) => {
  let params = {}
  if (uid) {
    params.uid = uid
  }
  if (session_key) {
    params.session_key = session_key;
  }
  return await accountModel.verify({
    ...params
  })
}
/**
 * 自动绑定微信小程序
 * @param mobile
 * @param areaCode
 * @constructor
 */
function _bindMiniAppByAuto(mobile, areaCode) {
    return accountModel.bindMiniAppByAuto(getApp().globalData.unionID, mobile, areaCode);
}

/**
 * 解密获取微信用户绑定的手机号
 * @param iv
 * @param encryptedData
 */
function decodePhoneNumber(iv, encryptedData) {
    return accountModel.decodeUserInfo(getApp().globalData.thirdSession, encryptedData, iv);
}

/**
 * 获取微信手机号码
 * @param e
 */
function getPhoneNumber(e) {
    const app = getApp();
    let router = global.router;

    if (e.detail.errMsg === 'getPhoneNumber:ok') {
        let phoneNumber;
        let countryCode;

        wx.showLoading();
        decodePhoneNumber(e.detail.iv, e.detail.encryptedData)
            .then(res => {
                phoneNumber = res.data.phoneNumber;
                countryCode = res.data.countryCode;

                if (res.data.phoneNumber && res.data.countryCode) {
                    return _bindMiniAppByAuto(res.data.phoneNumber, res.data.countryCode);
                }

                return Promise.reject({});
            })
            .then(res => {
                wx.hideLoading();
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
                        event.emit('bind-auto-register-type-report', {YB_REGISTER_SUCCESS: 5});
                    }
                } else {
                    return wx.showModal({
                        title: '提示',
                        content: res.message || '该手机已是yoho账户，请使用手机号动态登录'
                    });
                }

            })
            .then(res => {
                if (res && res.confirm) {
                    router.go('bindMobile', {phone: phoneNumber, area: countryCode});
                }
            })
            .catch(() => {
                router.go('bindMobile', {phone: phoneNumber, area: countryCode});
            });
    } else {
        router.go('bindMobile');
    }
}


export {
    wechatAuthLogin,
    isNeedImgCheck,
    getVerifyCode,
    bindMobileAction,
    tapToLogin,
    checkUidAndSessionKey,
    // verifySessionKey,
    getPhoneNumber
};
