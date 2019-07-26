import api from '../../common/api';

export default {
    /**
     * 解析用户信息
     * @param thirdSession
     * @param encryptedData
     * @param iv
     * @returns {*}
     */
    decodeUserInfo(thirdSession, encryptedData, iv) {
        return api.post({
            url: '/wechat/',
            data: {
                iv,
                encryptedData,
                srdSession: thirdSession,
                method: 'wechat.smallProgram.decodeUserInfo'
            }
        });
    },

    /**
     * 判断有货微信账户是否绑定手机号
     * @param unionID
     * @param nickName
     * @returns {*}
     */
    wechatUserIsBind(unionID, nickName) {
        return api.get({
            url: '',
            data: {
                method: 'app.passport.signinByOpenID',
                openId: unionID,
                source_type: 'wechat',
                nickname: nickName,
            }
        });
    },

    /**
     * 微信登录小程序
     * @param code
     * @returns {*}
     */
    wechatMiniAppLogin(code, miniapp_type) {
        return api.get({
            url: '/wechat/',
            data: {
                method: 'wechat.smallProgram.onLogin',
                jsCode: code,
                miniapp_type,
            }
        });
    },

    /**
     * 绑定小程序
     * @param unionId
     * @param mobile
     * @param code
     * @param area
     * @returns {*}
     */
    bindMiniapp(unionId, mobile, code, area = 86) {
        return api.get({
            url: '',
            data: {
                code,
                mobile,
                area,
                open_id: unionId,
                source_type: 'wechat',
                method: 'app.passport.bindMiniapp'
            }
        });
    },

    /**
     * 自动绑定小程序
     * @param unionId
     * @param mobile
     * @param area
     * @returns {*}
     */
    bindMiniAppByAuto(unionId, mobile, area = 86) {
        return api.get({
            url: '',
            data: {
                mobile,
                area,
                open_id: unionId,
                source_type: 'wechat',
                method: 'app.passport.miniAppBindByAuto'
            }
        });
    },

    /**
     * 自动登录
     * @param mobile
     * @param code
     * @param area
     * @returns {*}
     */
    autoSignIn(mobile, code, area = 86) {
        return api.get({
            url: '',
            data: {
                code,
                area,
                profile: mobile,
                source_type: 'wechat',
                method: 'app.passport.autoSignin'
            }
        });
    },

    /**
     * sessionKey是否失效验证
     * @returns {*}
     */
  async verify(params) {
        return api.get({
            url: '',
            data: {
                method: 'app.passport.verify',
                ...params
            }
        });
    },
  
    /**
     * 获取用户信息
     * @param uid 用户UID
     * @returns {*}
     */
    getProfile() {
        return api.get({
            url: '',
            data: {
                method: 'app.passport.profile'
            }
        });
    },

    /**
     * 获取优惠券总数
     * @returns {*}
     */
    getCouponTotal() {
        return api.get({
            url: '/coupon/total.do',
            data: {},
            api: 'store'
        });
    },

    /**
     * 获取有货币总数
     * @returns {*}
     */
    getCoinTotal() {
        return api.get({
            url: '',
            data: {
                method: 'app.yohocoin.total'
            }
        });
    },

    /**
     * 获取国家和地区
     * @returns {*}
     */
    getArea() {
        return api.get({
            url: '',
            data: {
                source_type: 'wechat',
                method: 'app.passport.getArea'
            }
        });
    },

    /**
     * 用户未授权-发送验证码
     * @param area 国家码
     * @param mobile 手机号
     * @param degrees 验证码
     * @returns {*}
     */
    sendSms(area, mobile, degrees) {
        return api.get({
            url: '',
            data: {
                area,
                mobile,
                degrees,
                source_type: 'wechat',
                fromPage: 'miniapp',
                method: 'app.message.sendSms'
            }
        });
    },

    /**
     * 用户已授权-发送验证码
     * @param mobile 手机号
     * @param area 国家码
     * @param openId
     * @param degrees 验证码
     * @returns {*}
     */
    sendCodeByMiniApp(area, mobile, openId, degrees) {
        return api.get({
            url: '',
            data: {
                area,
                mobile,
                degrees,
                open_id: openId,
                source_type: 'wechat',
                fromPage: 'miniapp',
                method: 'app.bind.sendThirdBindMobileCodeOnlyImg'
            }
        });
    },

    /**
     * 是否需要验证码
     */
    isNeedImgCheck() {
        return api.get({
            url: '/smart/way',
        });
    },

    /**
     * 获取用户union信息
     */
    getUserUnionInfoAsync(uid) {
        return api.get({
            data: {
                method: 'app.union.shareOrder.queryUnionTypeByUid',
              uid
            }
        });
    },

    /**
     * 获取share信息
     */
    getShareInfoAsync(shareId) {
        return api.get({
            url: '/operations/api/v5/webshare/getShare',
            data: {
                share_id: shareId
            }
        });
    },
    getCheckApply(){
        return api.get({
            data:{
                method:'app.union.shareOrder.checkApply',
            }
        })
    }
};
