import wx from '../../utils/wx';
import Yas from '../../common/yas';
import event from '../../common/event';
import accountModel from '../../models/account/index';

const AREA_CACHE_KEY = 'area_cache_key';
let yas;

Page({
    data: {
        list: []
    },
    getArea: function() {
        accountModel.getArea()
            .then(res => {
                if (res && res.code === 200) {
                    let dataList = res.data;

                    if (dataList && dataList.length > 0) {
                        this.setData({
                            list: dataList
                        });

                        wx.setStorage({
                            key: AREA_CACHE_KEY,
                            data: dataList,
                        });
                    }
                } else {
                    this.useCache();
                }
            });
    },
    useCache: function() {
        let dataList = wx.getStorageSync(AREA_CACHE_KEY);

        this.setData({
            list: dataList
        });
    },
    chooseArea: function(e) {
        const code = e.currentTarget.dataset.code;
        const name = e.currentTarget.dataset.name;

        event.emit('choose-area', {
            code,
            name
        });
        wx.navigateBack({
            delta: 1
        });
    },
    onLoad: function() {
        this.getArea();

        yas = new Yas();
        yas.pageOpenReport();
    }
});
