import wx from '../../utils/wx';
import rewardModel from '../../models/reward/index';
import idCardModel from '../../models/home/idCard';
import {
  tapToLogin
} from '../../common/login';
import event from '../../common/event';

let router = global.router;
let app = getApp();

Page({
  data: {
    historySettlementAmount: 0,
    settlementAmount: 0,
    tabList: [{
        name: '昨日',
        type: 1
      },
      {
        name: '本月',
        type: 2
      },
      {
        name: '上月',
        type: 3
      }
    ],
    cardList: [{
        desc: '预估订单佣金',
        info: '0',
        isPrice: true,
        keyName: 'orderAmountSum'
      },
      {
        desc: '预估其他佣金',
        info: '0',
        isPrice: true,
        keyName: 'extraAmountSum'
      },
      {
        desc: '订单数',
        info: '0',
        keyName: 'orderNum'
      },
      {
        desc: '点击数',
        info: '0',
        keyName: 'clickNum'
      },
    ],
    showTip: false,
    showDetail: false,
    detailInfo: {}
  },

  onLoad() {
    if (!app.getUid()) {
      event.off('user-login-success');
      event.on('user-login-success', this.loadPage);
    }
    // yas = new Yas(app);
    // yas.pageOpenReport();

  },
  onShow() {
    setTimeout(() => {
      this.loadPage(true);

    }, 500)

    // yas.report('YB_MAIN_TAB_C', {TAB_ID: 1});
    this.coat = this.selectComponent("#rewardCoat");
    this.coat.init()
  },
  loadPage(onload) {
    if (this.data.tabList) {
      this.setData({
        activeTab: this.data.tabList[0].type
      });
    }

    let now = new Date();

    if (!onload && (!this.loadTime || now - this.loadTime < 10000)) {
      return;
    }

    this.loadTime = now;

    rewardModel.getSettlementInfo().then(res => {
      if (res.code !== 200) {
        return;
      }

      let {
        canSettlement,
        hasBankCard,
        historySettlementAmount,
        settlementAmount
      } = res.data || {};

      this.canSettlement = canSettlement;
      this.hasBankCard = hasBankCard;

      this.setData({
        historySettlementAmount,
        settlementAmount
      });
    });

    this.loadBoardInfo();
  },
  loadBoardInfo(type) {
    type = type || this.data.activeTab;

    rewardModel.getStatisticsInfo(type).then(res => {
      if (res.code !== 200) {
        return;
      }

      let data = res.data || {};
      let cardList = this.data.cardList || [];

      cardList.forEach(value => {
        value.info = data[value.keyName] || 0;
      });


      this.setData({
        cardList
      });
    });
  },
  showToast(title) {
    return wx.showToast({
      title: title,
      icon: 'none',
      duration: 2500,
      mask: true
    });
  },
  async checkBackCrash() {
    if (!this.hasBankCard) {
      return wx.showModal({
        content: '请先完成银行卡绑定',
        showCancel: true,
        cancelText: '去绑定',
        cancelColor: '#d0021b',
        confirmText: '取消',
        confirmColor: '#444444'
      }).then(res => {
        console.log(res);
        if (res && res.cancel) {
          router.go('bankCard');
        }
      })
    }

    if (+this.data.settlementAmount <= 0) {
      return;
    }

    if (+this.data.settlementAmount > 500) {
      const idInfo = await idCardModel.getIdCard();

      if (!idInfo.data) {
        this.setData({
          showTip: true
        })
        return;
      }

      const checkInfo = await rewardModel.checkSettlement();

      this.setData({
        showDetail: true,
        detailInfo: checkInfo.data
      });

      return;
    }

    if (!this.canSettlement) {
      return wx.showModal({
        content: '您有正在处理中的提现,请耐心等待完成后再做新的提现操作',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#d0021b'
      });
    }

    this.takeBackCrash();
  },
  takeBackCrash() {
    wx.showModal({
      content: '每月15号统一打款,节假日顺延。申请后不能取消,确定要提现吗?',
      cancelText: '取消',
      cancelColor: '#444444',
      confirmText: '确定',
      confirmColor: '#d0021b'
    }).then(res => {
      if (!res.confirm) {
        return;
      }

      rewardModel.applySettlement().then(subRes => {
        if (subRes.code === 200) {
          wx.showModal({
            title: '申请提现成功',
            content: '每月15号统一打款,节假日顺延',
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#d0021b'
          });
          this.loadPage(true);
        } else {
          this.showToast(subRes.message || '申请提现失败');
        }
      });
    });

  },
  changeBoardType(e) {
    let activeTab = e.currentTarget.dataset.type;

    if (activeTab) {
      this.loadBoardInfo(activeTab);
      this.setData({
        activeTab
      });
    }
  },
  hide() {
    this.setData({
      showTip: false,
      showDetail: false
    });
  },
  confirmWithdraw() {
    this.hide();
    this.takeBackCrash();
  },
  confirmIdCard() {
    this.hide();
    router.go('idCard');
  }
});