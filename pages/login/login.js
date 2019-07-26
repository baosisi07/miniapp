// pages/account/login/login.js
import event from '../../common/event.js';

const router = global.router;
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginText: '微信登录',
        loginButtonType: '',
        loginTips: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        event.on('change-login-status', params => {
            that.setData({
                loginText: params.text || '微信登录',
                loginTips: params.tips || ''
            });
        });
        event.on('user-login-callback', this.loginCallback);
    },
    loginCallback(res) {
        const buttonType = this.getLoginButtonType();

        this.setData({
            loginButtonType: buttonType
        });
        if (!buttonType) {
            wx.navigateBack({
                delta: 1
            });// 如果不需要绑定手机则返回前一页
        }
    },

    onShow: function () {
        const buttonType = this.getLoginButtonType();

        this.setData({
            loginButtonType: buttonType
        });
    },

    getLoginButtonType: function () {
        const userInfo = app.getUserInfo();
        const unionid = app.getUnionID();

        if (userInfo && userInfo.uid) {
            return ''; // 已经是登录状态，合法用户
        }

        if (!unionid) {
            event.emit('change-login-status', {
                text: '微信登录',
                tips: ''
            });
            return 'getUserInfo';
        } else if (unionid && !(userInfo && userInfo.uid)) {
            event.emit('change-login-status', {
                text: '绑定手机号',
                tips: '还差一步，绑定手机号码，加入Yoho!Family'
            });
            return 'getPhoneNumber';
        }

        return ''; // 已经是登录状态，合法用户
    }
});
