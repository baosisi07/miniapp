import rewardModel from '../../../models/reward/index';
import Yas from '../../../common/yas';

const app = getApp();
let yas;

Page({
    data: {
        tabList: [
            {
                name: '本月排行',
                type: 1,
                rewardTitle: '本月预估佣金'
            },
            {
                name: '总排行',
                type: 2,
                rewardTitle: '总预估佣金'
            }
        ]
    },
    onLoad() {
        this.changeRewardType();

        let {windowHeight} = wx.getSystemInfoSync();

        wx.createSelectorQuery().select('#top-list-wrap').boundingClientRect(rect => {
            this.setData({
                listHeight: windowHeight - rect.top,
                listTop: rect.top
            });
        }).exec();

        yas = new Yas(app);
        yas.pageOpenReport();
    },
    onShow() {
        // yas.report('YB_MAIN_TAB_C', {TAB_ID: 1});
    },
    changeRewardType(e) {
        let tabList = this.data.tabList || [];
        let activeTabObj;

        if (e) {
            let type = e.currentTarget.dataset.type;

            tabList.forEach(value => {
                if (type === value.type) {
                    activeTabObj = value;
                }
            });
        } else {
            activeTabObj = tabList[0] || {};
        }

        this.type = activeTabObj.type;
        this.page = 1;

        this.setData({
            activeTab: activeTabObj.type,
            rewardTitle: activeTabObj.rewardTitle
        });
        this.loadTopList();
    },
    loadTopList() {
        if (this.loading || this.page > this.totalPage) {
            return;
        }

        this.loading = true;

        rewardModel.getTopList(this.type, this.page).then(res => {
            this.loading = false;

            if (!res || res.code !== 200) {
                return;
            }

            let data = res.data || {};
            let setInfo = {
                topNum: data.rankNum || '未上榜',
                rewardPrice: data.amount
            };

            if (!this.data.nickname) {
                setInfo.userThumb = data.image;
                setInfo.userName = data.nickname;
            }

            let rankList = data.rankList || {};
            let baseList = this.data.topList || [];

            this.totalPage = rankList.totalPage || 1;

            if (this.page < 2) {
                baseList = [];
                setInfo.listScrollTop = 0;
            }

            rankList.list = rankList.list || [];
            setInfo.topList = [...baseList, ...rankList.list];

            this.setData(setInfo);

            this.page++;
        });
    }
});
