import wx from './utils/wx';
import udid from './common/udid';
import event from './common/event';
import {verify} from './common/api';
import config from './common/config';
import Promise from './vendors/es6-promise';
import { MD5 } from './vendors/crypto';
import { wechatAuthLogin, checkUidAndSessionKey} from './common/login';
import accountModel from './models/account/index';
import { stringify } from './vendors/query-stringify';
import Yas from './common/yas';
import './router/index'
let yas;
const router = global.router;

// app.js
App({
    globalData: {
        userInfo: {},
        unionID: '',
        sessionKey: '',
        thirdSession: '',
        systemInfo: {}
    },
    reportData: {
        awakeReported: false
    },
    onLaunch(options) {
        this.globalData.udid = udid.get(); // 生成 UDID

        verify.gen(); // 此处返回是是 Promise，需要调用接口的业务，最好在 then 里边执行

        let sysInfo = wx.getSystemInfoSync();

        if (!sysInfo.screenHeight) {
            sysInfo.screenHeight = sysInfo.windowHeight;
        }
        if (!sysInfo.screenWidth) {
            sysInfo.screenWidth = sysInfo.windowWidth;
        }
        this.globalData.systemInfo = sysInfo;
        this.check_session_key()
        wx.checkSession()
            .then(() => { // 微信登录未过期
                this.getWechatThirdSession();
                this.getUserInfo();
                this.getUnionID();
                this.getUser_union_type();
                this.doLogin();
            })
            .catch(() => { // 微信登录过期
                wx.setStorage({
                    key: 'thirdSession',
                    data: ''
                });
                wx.setStorage({
                    key: 'userInfo',
                    data: {}
                });

                wx.setStorage({
                    key: 'unionID',
                    data: ''
                });
                this._setSync('userUnionInfo', {});
                this.setUserInfo({});
                this.setSessionKey('');

                this.doLogin();
            });

        this.globalData.sid = MD5(`${new Date().getTime()}`).toString();

        wx.getSystemInfo().then(res => {
            this.globalData.systemInfo = res;
        });

        // 设置渠道来源
        if (options && options.query && options.query.union_type) {
            this.globalData.union_type = options.query.union_type;
        }

        // 设置微信场景
        this.globalData.ch = options.scene;

        yas = new Yas(this);
        yas.report('YB_LAUNCH_APP');
        this.addLEN();
    },
    addLEN(){
      let that = this;
        event.on('user-is-login', (loginedCallBack, loginSuccess) => {
            
            let loginCheck = () => {
              let userInfo = wx.getStorageSync('userInfo');
              if (userInfo && userInfo.uid && userInfo.sessionKey) {
                loginedCallBack && loginedCallBack();
              } else {
                event.on('my-user-login-success', () => {
                  event.off('my-user-login-success');
                  if (loginSuccess) {
                    that.getUser_union_type()
                    loginSuccess();
                  }
                });
                router.go('login');
              }
            }
          that.check_session_key().then(res => {
            loginCheck()
          }).catch(err => {
            loginCheck()
          })
            
        });
    },
  
    onShow(options) {
        // 设置微信场景
        this.globalData.ch = options.scene;

        yas.report('YB_ENTER_FOREGROUND');

        if (this.reportData.awakeReported === false) {
            let path = options.path;

            if (Object.keys(options.query).length) {
                path = `${path}?${stringify(options.query)}`;
            }

            yas.report('YB_AWAKE_MP', {PAGE_PATH: path});
            this.reportData.awakeReported = true;
        }
    },
    onHide() {
        yas.report('YB_ENTER_BACKGROUND');
    },
    doLogin() {
        this.getSessionKey();
        event.on('login-type-report', params => {
            yas.report('YB_MY_LOGIN', params);
        });
        return this.wechatAuthLogin();
    },
    _getSync(key) {
        try {
            return wx.getStorageSync(key);
        } catch (e) {
            console.log(`wx.getStorageSync get ${key} failed.`);
            return {};
        }
    },
    _setSync(key, value) {
        try {
            wx.setStorageSync(key, value);
        } catch (e) {
            console.log(`wx.setStorageSync set ${key} failed.`);
        }
    },
    getWechatThirdSession() {
        this.globalData.thirdSession = this._getSync('thirdSession');
        return this.globalData.thirdSession;
    },
    setWechatThirdSession(session) {
        this.globalData.thirdSession = session;
        wx.setStorage({
            key: 'thirdSession',
            data: this.globalData.thirdSession
        });
    },
    isLogin() {
        return !!this.globalData.userInfo.uid;
    },
    getUdid() {
        return this.globalData.udid || '';
    },
    getUid() {
        return this.globalData.userInfo.uid || '';
    },
    getReportUid() {
        return this.globalData.userInfo.uid || this._getSync('userInfo').uid || '';
    },
    getUserInfo() {
        this.globalData.userInfo = this._getSync('userInfo');
    },
    getUnionID() {
        this.globalData.unionID = this._getSync('unionID');
        return this.globalData.unionID;
    },
    getUser_union_type: function () {
      this.getUnionTypeWithUid(this.getUid() || 0);
    },
    getSessionKey() {
        // this.globalData.sessionKey = this._getSync('sessionKey');
        // return this.globalData.sessionKey;
      return this.globalData.userInfo && this.globalData.userInfo.session_key || '';
    },
    getOpenID() {
        let openid;

        if (this.globalData.openID) {
            return this.globalData.openID;
        }

        openid = wx.getStorageSync('openID');
        this.globalData.openID = openid;
        return openid;
    },
    setOpenID(openID) {
        if (openID) {
            this.globalData.openID = openID;
            wx.setStorage({
                key: 'openID',
                data: openID
            });
        }
    },
    setUnionID(unionID) {
        this.globalData.unionID = unionID;
        wx.setStorage({
            key: 'unionID',
            data: unionID
        });
        event.emit('wx-union-id-update');
    },
    setUserInfo(user) {
        this.globalData.userInfo = Object.assign(this.globalData.userInfo || {}, user);
        wx.setStorage({
            key: 'userInfo',
            data: this.globalData.userInfo
        });
      if (this.globalData.userInfo.uid) {
        this.getUnionTypeWithUid(this.globalData.userInfo.uid);
      }
    },
    setSessionKey(sessionKey) {
        this.globalData.sessionKey = sessionKey;
        this._setSync('sessionKey', sessionKey);
    },
    resumeUserInfo() {
        this.globalData.userInfo = this._getSync('userInfo');
    },
    resumeSessionKey() {
        this.globalData.sessionKey = this._getSync('sessionKey');
    },
  check_session_key() {
    let that = this
    let userInfo = wx.getStorageSync('userInfo');

    if (userInfo && userInfo.uid && userInfo.sessionKey) {
      return checkUidAndSessionKey(userInfo.uid, userInfo.sessionKey).then(result => {
        if (result.code === 200) {
          console.log('session_key 未过期');
          event.emit('user-login-success');
          return Promise.resolve({});
        } else {
          console.log('检验sessionKey失败');
          that.clearUserSession();
          return wechatAuthLogin();

        }
      })
    }
  },
    wechatAuthLogin() {
        if (!this.globalData.userInfo.uid || !this.globalData.sessionKey) {
            return wechatAuthLogin()
                .then(res => {
                    if (res.code === 10003) { // 微信号已绑定手机号
                        this.setUserInfo(res.data);
                        this.setSessionKey(res.data.sessionKey);
                        event.emit('user-login-success');
                    }

                    if (res.code === 10004) { // 微信号未绑定手机号
                        // 自动登录未绑定静默处理、不强制绑定
                        conosle.log(JSON.stringify(res))
                    }
                })
                .catch(() => {});
        }
      
      this.check_session_key().then(res => {
            if (res.code === 10003) { // 微信号已绑定手机号
              this.setUserInfo(res.data);
              this.setSessionKey(res.data.sessionKey);

              event.emit('user-login-success');
            }

            if (res.code === 10004) { // 微信号未绑定手机号
              // 自动登录未绑定静默处理、不强制绑定
              conosle.log(JSON.stringify(res))
            }
          }).catch(error => {
            console.log(error);
            this.clearUserSession();
          });

    },
    clearUserSession() {
      const clearKeys = [
        'userInfo',
        'unionID',
        'sessionKey',
        'thirdSession',
        'userUnionInfo'
      ];

      clearKeys.forEach(key => {
        this.globalData[key] && (this.globalData[key] = '');
        wx.setStorage({
          key: key,
          data: ''
        });
      });
    },
    getMiniappType() {
        return config.mini_app_type;
    },
    getUnionType() {
        return config.unionType;
    },
    getAppId() {
        return config.appid;
    },
    getSystemInfo() {
        return this.globalData.systemInfo;
    },
    getPvid() {
        return MD5(`${new Date().getTime()}${udid.get()}`).toString();
    },
    getUserUnionInfo() {
        let userUnionInfo = this.globalData.userUnionInfo || this._getSync('userUnionInfo');

        return userUnionInfo;
    },
  getUnionTypeWithUid(uid) {
    accountModel.getUserUnionInfoAsync(uid).then(res => {
      if (res.code === 200) {
        this.globalData.userUnionInfo = res.data;
        this._setSync('userUnionInfo', res.data);
        this.getShareInfo();
      }
    });
  },
    getShareInfo() {
        let shareId = this.globalData.userUnionInfo.shareId;

        if (!this.globalData.shareInfo && shareId) {
            accountModel.getShareInfoAsync(shareId).then(res => {
                if (res.code === 200) {
                    this.globalData.shareInfo = res.data;
                }
            });
        }
        return this.globalData.shareInfo;
    }
});
