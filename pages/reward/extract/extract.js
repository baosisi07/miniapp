import rewardModel from '../../../models/reward/index';
import idCardModel from '../../../models/home/idCard.js';

const {
  windowHeight
} = getApp().getSystemInfo();

const router = global.router;

Page({
  data: {
    extractList: [],
    windowHeight,
    isUploaded: true
  },
  onLoad(options) {
    this.loadExtractList();

    // yas = new Yas(app);
    // yas.pageOpenReport();
  },
  onShow() {
    // yas.report('YB_MAIN_TAB_C', {TAB_ID: 1});
  },
  loadExtractList() {
    this.page = this.page || 1;

    if (this.loading) {
      return;
    }

    this.loading = true;

    setTimeout(() => {
      idCardModel.getIdCard().then(res => {
        if (res.code === 200) {
          this.setData({
            isUploaded: res.data
          });
        }
      });

      rewardModel.getSettlementRecord(this.page).then(res => {
        this.loading = false;
        if (res.code !== 200) {
          return;
        }

        let list = res.data.list;

        if (list && list.length) {
          this.setData({
            extractList: [...this.data.extractList, ...list]
          });
          this.page = this.page + 1;
        }
      }).catch(() => {
        this.loading = false;
      });
    }, 200)
  },
  goUpload() {
    router.go('idCard');
  },
  goDesc() {
    router.goUrl('http://m.yohobuy.com?openby:yohobuy={"action":"go.h5","params":{"title":"提现说明", "url":"https://activity.yoho.cn/feature/3233.html"}}');
  }
});