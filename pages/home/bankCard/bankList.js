import bankCardModel from '../../../models/home/bankCard';

Page({
    data: {
        bankList: []
    },
    onLoad() {
        this.loadBankList();

    },
    loadBankList() {
        bankCardModel.getBankList().then(res => {
            if (res.code === 200) {
                this.setData({
                    bankList: res.data
                });
            }
        })
    },
    chooseBank(e) {
        let currentPages = getCurrentPages();

        if (currentPages.length > 1 &&
            currentPages[currentPages.length - 2].chooseBankCallback) {
            currentPages[currentPages.length - 2].chooseBankCallback(e.currentTarget.dataset);
        }

        wx.navigateBack({delta: 1});
    }
})
