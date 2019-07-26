// pages/home/friends/friends.js

import friendsModel from '../../../models/home/friends';
const app = getApp();
const windowHeight = app.globalData.systemInfo.windowHeight;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendsList: [],
    listHeight: windowHeight - 128,
    tollageShareBoard: 0,
    tollageSnapshoot: 0,
    snapshoot: '',
    shareBoard: {
      actions: [{
        name: '分享给朋友',
        image: 'http://img10.static.yhbimg.com/unionimg/2019/06/13/16/01f4421ca1e3f907a57b12fd3288a175e7.png',
        actionName: '',
        share: true
      }, {
        name: '生成卡片并分享',
        image: 'http://img12.static.yhbimg.com/unionimg/2019/06/13/16/02631c81f799be1ff2ef5791eee8b7b2f0.png',
        actionName: 'goSnapshoot',
        duration: 0
      }]
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadList();
    this.userUnionInfo = app.getUserUnionInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  loadList() {
    let page = this.page || 1;
    let list = this.data.friendsList || [];

    if (page < 2) {
      this.isEnd = false;
      list = [];
    }

    if (this.isEnd || this.loading) {
      return;
    }

    this.loading = true;

    friendsModel.getFriendsList(page).then(res => {
      this.loading = false;

      if (res.code !== 200) {
        return;
      }

      let data = res.data || {};

      if (+page >= +data.totalPage) {
        this.isEnd = true;
      }

      this.page = ++page;

      this.setData({
        friendsList: [...list, ...data.list]
      });
    });

  },
  scrolltolower() {
    this.loadList();
  },
  goShare(e) {
    this.setData({
      tollageShareBoard: e.timeStamp
    });
  },
  goSnapshoot(e) {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})