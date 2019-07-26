/**
 * webview内加载h5
 * 回跳小程序内页面公共页
 *
 * 支持以下规则：
 * go.productDetail
 *
 */
import {stringify, parse} from '../../vendors/query-stringify';

Page({
    onLoad: function (options) {
        options.url = options.url || '';

        if (!options.url) {
            return this.defaultNav();
        }

        let h5Url = decodeURIComponent(options.url);
        let [domain, queryStr] = h5Url.split('?');
        let query = parse(queryStr);

        if (!query['openby:yohobuy']) {
            return this.defaultNav();
        }

        let path;
        let qs = {};
        let openBy = JSON.parse(query['openby:yohobuy']);
        let action = openBy.action;
        let params = openBy.params || {};

        switch (action) {
            case 'go.productDetail':
                path = '/pages/product/detail/detail';
                qs = {productSkn: params.product_skn || params.productSkn, page_name: 'webback'};
                break;
        }

        if (path) {
            let url;
            url = path;
            if (Object.keys(qs || {}).length > 0) {
                url = `${url}?${stringify(qs, {encode: false})}`;
            }
            return wx.redirectTo({
                url
            });
        }

        return this.defaultNav();
    },
    defaultNav() {
        // 不支持的解析规则统一跳转首页
        wx.switchTab({
            url: '/pages/index/index'
        });
    }
});