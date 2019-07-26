import rewardModel from '../../../models/reward/index';
import Yas from '../../../common/yas';

const app = getApp();
let yas;

Page({
    data: {
        tabList: [
            {
                name: '订单佣金',
                type: 1,
                keyTitle: '订单金额：',
                keyName: 'lastOrderAmountStr',

            },
            {
                name: '活动佣金',
                type: 2,
                keyTitle: '',
                keyName: 'activityName',
            }
        ],
        typeList: [
            {
                name: '全部',
                type: 0
            },
            {
                name: '待提现',
                type: 1
            },
            {
                name: '未提现',
                type: 2
            },
            {
                name: '已提现',
                type: 3
            },
            {
                name: '已关闭',
                type: 4
            },
        ],
        orderList: []
    },

    onLoad() {
        this.changeRewardType();

        let {windowHeight} = wx.getSystemInfoSync();

        wx.createSelectorQuery().select('#orders-wrap').boundingClientRect(rect => {
            this.setData({
                listHeight: windowHeight - rect.top
            });
        }).exec();

        yas = new Yas(app);
        yas.pageOpenReport();
    },
    onShow() {
        // yas.report('YB_MAIN_TAB_C', {TAB_ID: 1});
    },
    loadRewardList(page) {
        page = page || this.page || 1;

        if (this.loading) {
            return;
        }

        this.loading = true;

        rewardModel.getOrderList(this.activeTab.type, this.activeType, page).then(res => {
            this.loading = false;
            if (res.code !== 200) {
                return;
            }
            let data = res.data || {};
            let orderList = this.data.orderList;

            if (page < 2) {
                orderList = [];
            }

            let list = data.list || [];

            if (list.length) {
                this.page = ++page;

                list.forEach(value => {
                    value.showName = `${this.activeTab.keyTitle}${value[this.activeTab.keyName] || ''}`;
                });

            }

          this.setData({
            orderList: [...orderList, ...list]
          });

        }).catch(() => {
            this.loading = false;
        });

    },
    changeRewardType(e) {
        let tabList = this.data.tabList || [];
        let activeTab;

        if (e) {
            activeTab = e.currentTarget.dataset.type;

            tabList.forEach(value => {
                if (activeTab === value.type) {
                    this.activeTab = value;
                }
            });
        } else {
            this.activeTab = tabList[0] || {};
            activeTab = this.activeTab.type;
        }

        this.setData({activeTab});
        this.changeRewardStatusType();
    },
    changeRewardStatusType(e) {
        let activeType;

        if (e) {
            activeType = e.currentTarget.dataset.type;
            this.activeType = activeType;
        } else {
            this.activeType = this.data.typeList[0].type;
            activeType = this.activeType;
        }

        this.setData({activeType});
        this.loadRewardList(1);
    },
    scrolltolower() {
        this.loadRewardList();
    }
});
