// pages/inviteNew/inviteNew.js
import inviteModel from '../../models/invite/index';
import { tapToLogin } from '../../common/login';
import resourcesModel from '../../models/resources/index';
import config from '../../common/config';
import accountModel from '../../models/account/index';
import event from '../../common/event';
import Yas from '../../common/yas';
// 获取应用实例
let app = getApp();
let router = global.router;
let yas;

Page({
  data: {
    inviteRecord: [],
    recordPage: 1,
    limit: 20,
    resource: [],
    tollageShareBoard: 0,
    shareInfo: {},
    shareBoard: {
      actions: [
        //   {
        //     name: '分享给朋友',
        //     image: 'http://img10.static.yhbimg.com/unionimg/2019/06/13/16/01f4421ca1e3f907a57b12fd3288a175e7.png',
        //     actionName: '',
        //     share: true
        // },
        {
          name: '生成卡片并分享',
          image: 'http://img12.static.yhbimg.com/unionimg/2019/06/13/16/02631c81f799be1ff2ef5791eee8b7b2f0.png',
          actionName: 'goSnapshoot',
          duration: 0
        }]
    },
    tollageSnapshoot: 0,
    snapshoot: '',
    isLogin: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadPage()
  },
  loadPage() {
    wx.hideShareMenu();
    let userUnionInfo = app.getUserUnionInfo()
    if (!userUnionInfo.unionType) {
      this.coat = this.selectComponent("#inviteCoat");
      this.coat.init()
      
    }
    let applyStatus = wx.getStorageSync('applyStatus') 
    if (+applyStatus === 2) {
      this.inviteRecordList();
    }
    this.getShareInfo();
    this.getResource();

    yas = new Yas(app);
    yas.pageOpenReport();
  },

  getShareInfo() {
    let that = this
    // let shareId = 8419 //正式
    let shareId = 6768 //测试
    accountModel.getShareInfoAsync(shareId).then(res => {
      if (res.code === 200) {
        that.setData({
          shareInfo: res.data
        })
      }
    });
  },
  getResource() {
    resourcesModel.getContent(config.resourceContentCode.inviteNew).then(data => {
      if (data.length) {
        this.setData({ resource: data });
      }
    });
  },
  inviteRecordList() {
    if (this.loading) {
      return;
    }

    this.loading = true;
    let params = {
      uid: app.getUid(),
      size: this.data.limit,
      page: this.data.recordPage || 1
    };

    inviteModel.getInviteList(params).then(res => {
      this.loading = false;

      if (res.code !== 200) {
        return;
      }

      let data = res.data;

      let inviteRecord = data.list;
      let recordPage = this.data.recordPage;
      if (recordPage > 1) {
        inviteRecord = [...this.data.inviteRecord, ...inviteRecord];
      }
      recordPage = ++params.page;
      this.setData({ inviteRecord, recordPage });
      
    });
  },
  getMoreRecord() {
    this.inviteRecordList()
  },

  shareAndInvite(e) {
    let userUnionInfo = app.getUserUnionInfo()
    if (!userUnionInfo.unionType) {
      this.coat = this.selectComponent("#inviteCoat");
      this.coat.init()
    }
    let applyStatus = wx.getStorageSync('applyStatus')
    if (+applyStatus === 2) {
      this.setData({
        tollageShareBoard: e.timeStamp
      });
    }
    
  },

  goRule(e) {
    router.goUrl(e.currentTarget.dataset.url);
  },
  goSnapshoot(e) {
    let info = {
      tollageSnapshoot: e.timeStamp || ++this.data.tollageSnapshoot
    };

    if (!this.data.snapshoot) {
      let userUnionInfo = app.getUserUnionInfo()
      let params = {
        union_type: userUnionInfo.unionType,
        source: 'inviteNew'
      };

      info.snapshoot = {
        type: 'inviteNew',
        activityImg: this.data.shareInfo.bigImage,
        wechatQrCode: `https://api.yoho.cn/wechat/miniapp/img-check.jpg?param=${encodeURIComponent(JSON.stringify(params))}&miniQrType=0&miniapp_type=0`
        
      };
    }

    this.setData(info);
  },

  onShow: function () {
    // this.coat = this.selectComponent("#inviteCoat");
    // this.coat.init()
  },

})