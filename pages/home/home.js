import wx from '../../utils/wx';
import event from '../../common/event';
import Yas from '../../common/yas';
import {
  tapToLogin
} from '../../common/login';

import resourcesModel from '../../models/resources/index';
import rewardModel from '../../models/reward/index';
import accountModel from '../../models/account/index';
import idCardModel from '../../models/home/idCard.js';

// 获取应用实例
let app = getApp();
let router = global.router;
let yas;

Page({
  data: {
    resourceCode: '1f0f09a7def1753e693fd5005dcf6904',
    userAvatar: '',
    userName: '',
    isLogin: false,
    isBindBankCard: false,
    optionList: [],
    inviteNum: 0,
    showFans: false,
    coatType: false,
    isUploadedIdCard: false,
  },
  onLoad: function() {
    if (!app.getUid()) {
      event.off('user-login-success');
      event.on('user-login-success', this.loadPage());
    }
    yas = new Yas(app);
    yas.pageOpenReport();
  },
  onShow: function() {
    this.loadPage();
  },
  loadPage() {
    if (app.getUid()) {
      accountModel.getProfile().then(res => {
        let userInfo = res.data || {};

        this.setData({
          userAvatar: userInfo.head_ico || '',
          userName: userInfo.nickname || ''
        });
      });

      rewardModel.getSettlementInfo().then(res => {
        if (res.code === 200) {
          this.setData({
            isBindBankCard: res.data.hasBankCard
          });
        }
      });

      rewardModel.getQueryShareTotal().then(res => {
        if (res.code === 200) {
          this.setData({
            inviteNum: res.data.inviteNum,
            showFans: res.data.showFans,
          });
        }
      });

      accountModel.getCheckApply().then(res => {
        if (res.code === 200 && res.data.status === 2) {
          this.setData({
            coatType: true
          });
        }
      });

      idCardModel.getIdCard().then(res => {
        if (res.code === 200 && res.data === true) {
          this.setData({
            isUploadedIdCard: true
          });
        }
      });
      this.setData({
        isLogin: true
      });
    } else {
      this.setData({
        userName: '立即登录'
      });
    }

    this.data.resourceCode && this.loadOptionList(this.data.resourceCode);
  },
  loadOptionList(code) {
    if (!code) {
      return;
    }

    resourcesModel.getContent(this.data.resourceCode).then(resource => {
      resource = resource || [];

      let optionList = [];

      resource.forEach(value => {
        optionList = [...optionList, value];
      });
      this.setData({
        resourceCode: '',
        optionList
      });
    });
  },
  tapToLogin() {
    event.off('user-login-success');
    event.on('user-login-success', function() {
      router.go('userCenter')
    });
    event.emit('user-is-login');
  },
  goBankCard() {
    if (app.getUid()) {
      router.go('bankCard');
    } else {
      tapToLogin('');
    }
  },
  goIdCard() {
    if (app.getUid()) {
      if (this.data.isUploadedIdCard) {
        wx.showToast({
          icon: 'none',
          title: '身份证已上传，如需修改请联系有货客服',
        });
        return;
      }
      router.go('idCard');
    } else {
      tapToLogin('');
    }
  },
  jumpToUrl(e) {
    router.goUrl(e.currentTarget.dataset.url);
  },
  goFriends(e) {
    this.data.isLogin && router.go('friends');
  },
});