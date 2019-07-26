import rewardModel from '../../../models/reward/index';

Page({
    data: {
        statusStr: '',
        order: '',
        activity: '',
        productList: ''
    },
    onLoad(options) {
        options.orderCode = 111;
        if (options.orderCode) {
            this.loadOrderDetail(options.orderCode);
        } else if (options.id) {
            this.loadActivityDetail(options.id);
        }

        // yas = new Yas(app);
        // yas.pageOpenReport();
    },
    onShow() {
        // yas.report('YB_MAIN_TAB_C', {TAB_ID: 1});
    },
    loadOrderDetail(code) {
        rewardModel.getOrderDetail(code).then(res => {
            if (res.code !== 200) {
                return;
            }

            let data = res.data;

            this.setData({
                statusStr: data.orderStatus,
                order: data,
                productList: data.productList
            });
        });
    },
    loadActivityDetail(id) {
        rewardModel.getActivityOrderDetail(id).then(res => {
            if (res.code !== 200) {
                return;
            }

            let data = res.data;

            this.setData({
                statusStr: data.statusStr,
                activity: data
            });
        });
    }
});
