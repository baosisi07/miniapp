import wx from '../utils/wx';
import {stringify} from '../vendors/query-stringify';

const appData = {
    yohobuy: {
        appId: 'wx084ab813d88c594b',
        page: {
            groupPurchase: '/pages/groupPurchase/groupPurchase',
            groupPurchaseHome: '/pages/groupPurchase/groupPurchaseHome',
            groupPurchaseDetail: '/pages/groupPurchase/groupPurchaseDetail',
            productDetail: '/pages/goodsDetail/goodsDetail',
            productList: '/pages/goodsList/goodsList',
            productShop: '/pages/goodsList/brandStore',
            brandDetail: '/pages/goodsList/brand'
        }
    },
    anotherApp: {
        appId: 'wx084ab813d88c594b',
        page: {
            home: '/pages/product/detail/detail'
        }
    },
};

export default function(params) {
    let navigateToMiniParams = {
        appId: appData[params.app].appId,
        path: params.path || `${appData[params.app].page[params.page]}?${stringify(params.data)}`
    };

    return wx.navigateToMiniProgram(navigateToMiniParams);
}
