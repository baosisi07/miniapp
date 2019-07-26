import idCardModel from '../../../models/home/idCard';

let router = global.router;

// pages/home/idCard/idCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idcard_pros: '',
    idcard_cons: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onUploadSuccess({
    detail: {
      data,
      index
    }
  }) {
    if (index === 1) {
      this.setData({
        idcard_pros: data
      });
    } else if (index === 2) {
      this.setData({
        idcard_cons: data
      });
    }

    console.log(data, index);
  },

  onUploadRemove({
    detail: {
      index
    }
  }) {
    if (index === 1) {
      this.setData({
        idcard_pros: ''
      });
    } else if (index === 2) {
      this.setData({
        idcard_cons: ''
      });
    }
  },

  onUploadError({
    detail: {
      index
    }
  }) {
    console.log('error', index);
  },

  async submit() {
    if (!this.data.idcard_pros || !this.data.idcard_cons) {
      wx.showToast({
        icon: 'none',
        title: '未上传身份证'
      });
      return;
    }

    wx.showLoading({
      mask: true,
      title: '提交中'
    });

    const result = await idCardModel.submit({
      cardFrontUrl: this.data.idcard_pros,
      cardBackUrl: this.data.idcard_cons
    });

    wx.hideLoading();

    if (result.code !== 200) {
      wx.showToast({
        icon: 'none',
        title: '提交失败，请重新提交'
      });
      return;
    } 

    router.goBack();
  }
})