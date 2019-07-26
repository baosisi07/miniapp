import wx from '../../../utils/wx';
import detailModel from '../../../models/product/detail';
import Yas from '../../../common/yas';

import {tapToLogin} from '../../../common/login';

let app = getApp();
let router = global.router;

let yas;

Page({
    data: {
        productImages: [],
        productName: '',
        salesPrice: '',
        marketPrice: '',
        rebatePhrase: '',
        rebatesAmount: '',
        similerList: [],
        tollageShareBoard: 0,
        shareBoard: {
            actions: [
                //   {
                //     name: '分享给朋友',
                //     image: 'http://img10.static.yhbimg.com/unionimg/2019/06/13/16/01f4421ca1e3f907a57b12fd3288a175e7.png',
                //     actionName: '',
                //     share: true
                // },
                {
                    name: '生成卡片并分享',
                    image: 'http://img12.static.yhbimg.com/unionimg/2019/06/13/16/02631c81f799be1ff2ef5791eee8b7b2f0.png',
                    actionName: 'goSnapshoot',
                    duration: 0
                }]
        },
        tollageSnapshoot: 0,
        snapshoot: '',
        collagePrice: '',
        collageRebatesPrice:''
    },
    onLoad(options) {
        wx.hideShareMenu();
        this.productSkn = options.productSkn || options.product_skn || '';
        this.setData({
            collagePrice: options.collagePrice || '',
            collageRebatesPrice:options.collageRebatesPrice || '',
        });
        this.userUnionInfo = app.getUserUnionInfo();
        this.loadProduct();
        this.updateLoginStatus();

        yas = new Yas(app);
        yas.pageOpenReport();
    },
    loadProduct() {
        detailModel.getProductInfo(this.productSkn).then(res => {
            if (res.code !== 200) {
                return;
            }

            let data = res.data;
            let images = [];

            data.goodsList = data.goodsList || [];
            data.goodsList.map((item, index) => {
                let list = item.goodsImagesList || [];

                if (list && list.length) {
                    images = [...images, ...list];
                }
            });

            let priceBo = data.productPriceBo;

            this.setData({
                id: priceBo.productId,
                productSkn: priceBo.productSkn,
                productImages: images,
                productName: data.productName,
                salesPrice: priceBo.salesPrice,
                marketPrice: priceBo.marketPrice - priceBo.salesPrice > 0 ? priceBo.marketPrice : '',
                rebatesAmount: data.rebatesAmount,
                rebatePhrase: data.phrase
            });

            detailModel.getProductFavStatus(priceBo.productId).then(res => {
                if (res.code === 200 && res.data) {
                    this.setData({isFav: true});
                }
            })
        });
    },
    updateLoginStatus() {
        this.setData({isLogin: !!app.getUid()});
    },
    onPageScroll() {
        if (this.similarLoaded) {
            return;
        }

        this.similarLoaded = true;

        detailModel.getSimilarProductList(this.productSkn).then(res => {
            if (res.code !== 200) {
                return;
            }

            this.setData({similerList: res.data.product_list});
        });
    },
    setProductFav() {
        let isCancel = this.data.isFav;

        this.setData({isFav: !this.data.isFav});

        detailModel.setProductFav(this.data.id, isCancel).then(res => {
            if (res.code !== 200) {
                this.setData({isFav: !this.data.isFav});
            }
        });
    },
    goProductDetail() {
        router.goMiniapp({
            page: 'productDetail',
            data: {
                productSkn: this.data.productSkn
            }
        });
    },
    goProductShare(e) {
        this.setData({
            tollageShareBoard: e.timeStamp
        });
    },
    goSnapshoot(e) {
        let info = {
            tollageSnapshoot: e.timeStamp || ++this.data.tollageSnapshoot
        };

        if (!this.data.snapshoot) {
            let params = {
                union_type: this.userUnionInfo.unionType,
                productSkn: this.data.productSkn,
            };

            info.snapshoot = {
                thumb: this.data.productImages[0].imageUrl,
                productName: this.data.productName,
                marketPrice: this.data.marketPrice,
                salesPrice: this.data.salesPrice,
                wechatQrCode: `https://api.yoho.cn/wechat/miniapp/img-check.jpg?param=${encodeURIComponent(JSON.stringify(params))}&miniQrType=7`
            };
        }

        this.setData(info);
    },
    onShareAppMessage(res) {
        let userUnionInfo = this.userUnionInfo || app.getUserUnionInfo();
        let shareInfo = app.getShareInfo();
        let imageUrl = this.data.productImages[0].imageUrl.replace(/{width}/g, 750).replace(/{height}/g, 1000).replace('{mode}', 2);

        return {
            title: this.data.productName, // 分享标题
            imageUrl: imageUrl,
            desc: shareInfo ? shareInfo.content : '我在有货发现一个不错的商品赶快来看看吧！', // 分享描述
            path: `pages/product/detail/detail?productSkn=${this.data.productSkn}&union_type=${userUnionInfo.unionType}`, // 分享路径
        }
    },
    tapToLogin(e) {
        tapToLogin(e.detail);
    }
});
