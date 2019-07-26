// import Yas from '../../../common/yas';
import listModel from '../../../models/product/list';

const app = getApp();

// let yas;

const PRODUCT_PAGE_NUM = 20;

Page({
    data: {
        msortList: [],
        activeSort: 0,
        productList: [],
        productPool: 0
    },
    onLoad(options) {
        if (!!options.title) {
            wx.setNavigationBarTitle({
                title: decodeURIComponent(options.title)
            })
        }
        if(!!options.productPool) {
            this.setData({
                productPool:options.productPool
            })
        }
        this.productList();


        // yas = new Yas();
        // yas.pageOpenReport();
    },
    onReady() {

        const {windowHeight} = app.getSystemInfo();

        this.setData({windowHeight});
    },
    productList() {
        if (this.loading) {
            return;
        }

        this.loading = true;

        let params = {
            product_pool: this.data.productPool,
            limit: PRODUCT_PAGE_NUM,
            page: this.productPage || 1,
        };

        if (this.productMsort) {
            params.msort = this.productMsort;
        }

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

            this.setData({productList});
            this.productPage = ++params.page;
        });
    },
    changeSortType(e) {
        this.productMsort = e.currentTarget.dataset.msort;
        this.productPage = 1;
        this.productList();
        this.setData({
            scrollTop: 0,
            activeSort: this.productMsort
        });
    },
    productClick() {
    }
});
