import rules from './rules';
import jump from './jump';
import jumpToMiniapp from './jump-to-miniapp';
import {parse, stringify} from '../vendors/query-stringify';

const MINI_APP_DOMAIN = 'miniapp.yohobuy.com';

const OPEN_BY_TYPE = {
    GO_MINEALLIANCE: 'go.minealliance',
    GO_H5: 'go.h5',
    GO_ACTIVITYTEMPLATE: 'go.activitytemplate',
    GO_COLLAGEHOME: 'go.collagehome',

    GO_BRAND: 'go.brand',
    GO_SHOP: 'go.shop',
    GO_POOL_LIST: 'go.poollist',
    GO_DETAIL: 'go.productDetail'
};

const pageNameMap = {};

for (let i in rules) {
    if (rules.hasOwnProperty(i) && rules[i].path) {
        pageNameMap[rules[i].path] = i;
    }
}

global.router = {
    go(name, qs, type) {
        let rule = rules[name];

        if (!rule) {
            return Promise.reject(`router rules mismatch : ${name}`);
        }

        qs = qs || {};

        // 添加yas上报【fromPage】参数
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        let path = `/${currentPage.route}`;
        let options = currentPage.options;

        if (pageNameMap[path]) {
            qs.fromPage = pageNameMap[path];
            qs.fromParam = stringify(options);
        }

        // 页面登录校验
        this.app = this.app || getApp();

        if (rule.auth && !this.app.getUid()) {
            return wx.showToast({
                title: '请先完成登录/注册，再查看!',
                icon: 'none',
                duration: 2000
            });
        }

        // 跳转类型
        let jumpFn = jump[type] || rule.type || jump.navigateTo;

        // webview 添加登陆信息
        if (name === 'webview') {
            qs.param = qs.param || {};

            Object.assign(qs.param, {
                uid: this.app.getUid(),
                session_key: this.app.getSessionKey(),
                client_type: 'miniapp'
            });

            qs = {params: encodeURIComponent(JSON.stringify(qs))};
        }
        console.log(rule.path)
        return jumpFn(rule.path, qs);
    },
    goUrl(url) {
        if (!url) {
            return Promise.reject('error url');
        }

        let splitUrl = url.split('?');
        const uri = splitUrl[0];

        splitUrl[0] = '';

        const search = splitUrl.join('');
        const path = uri.split(MINI_APP_DOMAIN)[1];
        const qs = parse(search);

        if (qs.app && path) {
            return this.goMiniapp({
                app: qs.app,
                path: `${path}?${stringify(qs)}`
            });
        }

        let openBy = JSON.parse(qs['openby:yohobuy'] || '{}');

        if (openBy.action) {
            switch (openBy.action) {
                case OPEN_BY_TYPE.GO_H5:
                    this.go('webview', openBy.params);
                    break;
                case OPEN_BY_TYPE.GO_MINEALLIANCE:
                    if (openBy.params.type === 'recommendProduct') {
                        this.go('productList', openBy.params);
                    } else if (openBy.params.type === 'talentRank') {
                        this.go('rewardTop', openBy.params);
                    } else if (openBy.params.type === 'inviteYoho') {
                      this.go('inviteNew', openBy.params)
                    }
                    break;
                case OPEN_BY_TYPE.GO_ACTIVITYTEMPLATE:
                    if (+openBy.params.type === 2) {
                        this.goMiniapp({
                            page: 'groupPurchase',
                            data: openBy.params
                        });
                    }
                    break;
                case OPEN_BY_TYPE.GO_COLLAGEHOME:
                    this.goMiniapp({
                        page: 'groupPurchaseHome',
                        data: openBy.params
                    });
                    break;
                case OPEN_BY_TYPE.GO_BRAND:
                    this.goMiniapp({
                        page: 'brandDetail',
                        data: openBy.params
                    });
                    break;
                case OPEN_BY_TYPE.GO_SHOP:
                    this.goMiniapp({
                        page: 'productShop',
                        data: openBy.params
                    });
                    break;
                case OPEN_BY_TYPE.GO_POOL_LIST:
                    this.goMiniapp({
                        page: 'productList',
                        data: openBy.params
                    });
                    break;
                case OPEN_BY_TYPE.GO_DETAIL:
                    if (openBy.params.activity_type === 'groupPurchase') {
                        this.goMiniapp({
                            page: 'groupPurchaseDetail',
                            data: openBy.params
                        });
                    } else {
                        this.goMiniapp({
                            page: 'productDetail',
                            data: openBy.params
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    },
    goMiniapp(params = {}) {
        params.app = params.app || 'yohobuy';

        return jumpToMiniapp(params);
    },
    goBack() {
      wx.navigateBack({
        delta: 1
      });
    }
};
