import config from '../../common/config';
import Yas from '../../common/yas';
import listModel from '../../models/product/list';
import resourcesModel from '../../models/resources/index';

// 获取应用实例
let app = getApp();
let yas;
let router = global.router;
let {windowHeight} = app.getSystemInfo();

const PRODUCT_PAGE_NUM = 20;

Page({
    data: {
        resource: [],
        resourceCode: config.resourceContentCode.index,
        inviteData: '',
        sortWrapClass: '',
        msortList: [],
        activeSort: 0,
        productList: [],
    },
  
    onLoad() {
        this.loadPage();

        yas = new Yas(app);
        yas.pageOpenReport();
    },
    onShow() {
        // yas.report('YB_MAIN_TAB_C', {TAB_ID: 1});
        this.coat = this.selectComponent("#indexCoat");
        this.coat.init()
    },
    onPullDownRefresh() {
        this.loadPage()
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1000)
    },
    loadPage() {
        wx.showShareMenu({
            withShareTicket: true
        })
        resourcesModel.getContent(this.data.resourceCode).then(resource => {
            this.setData({resource});
            resource.forEach(floor => {
                if (floor.template_name = 'recommendGoodsGroup' && floor.data) {
                    this.productSkns = floor.data.skns
                    this.loadRecomdGoods();
                }
            });
            setTimeout(() => {
                wx.createSelectorQuery().select('#resource-wrap').boundingClientRect(rect => {
                    this.sortWrapTop =  rect && rect.height;
                }).exec();
            }, 1000);
            return resourcesModel.getInvitecodeTotal()
        }).then((res) => {
            if (res && res.code === 200) {
                this.setData({
                    inviteData: res.data
                });
            }
        });
    },
    loadRecomdGoods() {
        if (this.loading) {
            return;
        }

        let params = {
            product_pool: '',
            firstProductSkn: this.productSkns,
            limit: PRODUCT_PAGE_NUM,
            page: this.productPage || 1,
        };

        if (this.productMsort) {
            params.msort = this.productMsort;
        }

        this.loading = true;

        listModel.productList(params).then(res => {
            this.loading = false;

            if (res.code !== 200) {
                return;
            }

            let data = res.data;

            if (!this.data.msortList || !this.data.msortList.length) {
                this.setData({
                    msortList: [
                        {sort_name: '热门推荐', sort_id: 0},
                        ...data.msort_list
                    ]
                });
            }

            let productList = data.product_list;

            if (this.productPage > 1) {
                productList = [...this.data.productList, ...productList];
            }

            this.productPage = ++params.page;
            this.setData({productList});
        });
    },
    changeSortType(e) {
        this.productMsort = e.currentTarget.dataset.msort;
        this.productPage = 1;
        this.loadRecomdGoods();
        this.setData({
            scrollTop: this.sortWrapTop,
            activeSort: this.productMsort
        });
    },
    pageScroll(e) {
        let sortWrapClass = '';

        if (e.detail.scrollTop >= this.sortWrapTop) {
            sortWrapClass = 'fixed';
        }

        sortWrapClass !== this.data.sortWrapClass && this.setData({sortWrapClass});
    }
});
