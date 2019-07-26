import {parse, stringify} from '../../vendors/query-stringify';

let app = getApp();

Page({
    onLoad(options) {
        if (options.params) {
            let params = decodeURIComponent(options.params);

            this.loadElement(JSON.parse(decodeURIComponent(params)));
        } else {
            this.loadElement(options);
        }
    },
    onShow(options) {
    },
    getQueryObj(link) {
        let loc = decodeURIComponent(link);
        let variables = '';
        let variableArr = [];
        let finalArr = [];

        if (loc.indexOf('?') > 0) {
            variables = loc.split('?')[1];
        }

        if (variables.length > 0) {
            variableArr = variables.split('#')[0].split('&');
        }

        for (let i = 0; i < variableArr.length; i++) {
            let obj = {};
            obj.name = variableArr[i].split('=')[0];
            obj.value = variableArr[i].split('=')[1];
            if (variableArr[i].split('=').length > 2) {
                for (var j = 2; j < variableArr[i].split('=').length; j++) {
                    obj.value += '=' + variableArr[i].split('=')[j];
                }
            }
            finalArr.push(obj);
        }

        let query_obj = {};

        for (let i = 0; i < finalArr.length; i++) {
            query_obj[finalArr[i].name] = finalArr[i].value;
        }

        return query_obj;
    },
    loadElement(options) {
        options.param = options.param || {};
        let res = wx.getSystemInfoSync();
        let screen_size = res.windowWidth + 'x' + res.windowHeight;
        let os_version = res.version;
        Object.assign(options.param, {
            uid: app.getUid(),
            session_key: app.getSessionKey(),
            client_type: 'miniapp',
            screen_size: screen_size,
            os_version: os_version,
        });

        if (options && options.url) {
            let queryObj = this.getQueryObj(options.url);

            options.param && Object.assign(queryObj, options.param);

            if (queryObj.title) {
                this.setData({
                    title: queryObj.title
                });
            }
            let url = options.url.split('?')[0].replace(/^\s+|\s+$/g, '');
            if (!/https/.test(url)) {
                url = url.replace(/http/, 'https')
            }
            // if (/https/.test(url)) {
            //     url = url.replace(/https/, 'http')
            // }
            this.setData({
                url: decodeURIComponent(url + '?' + encodeURIComponent(stringify(queryObj)))
            });
        }
        if (options.share) {
            let queryObj = this.getQueryObj(options.share);

            options.shareparam && Object.assign(queryObj, options.shareparam);
            options.shareURL = options.share.split('?')[0] + '?' + stringify(queryObj);
        }

        if (options.shareURL) {
            this.setData({
                shareUrl: options.shareURL
            });
        }
    },
    bindGetMsg(e) {
        if (e.detail && e.detail.data && e.detail.data[0] && e.detail.data[0].title) {
            this.setData({
                title: e.detail.data[0].title,
            });
        }
    },
    onShareAppMessage() {
        let baseUrl = '/pages/webview/webview?url=';
        let newURL = this.data.url.split('?');
        let path = baseUrl + this.data.url;


        if (newURL[1]) {
            if (newURL[1].indexOf('&app_version') > 0) {
                let newParams = newURL[1].split('&app_version');

                if (newParams[0]) {
                    path = baseUrl + newURL[0] + encodeURIComponent('?' + newParams[0]);
                }
            } else if (newURL[1].indexOf('app_version') === 0) {
                path = baseUrl + newURL[0];
            }
        }

        if (this.data.shareUrl) {
            if (this.data.shareUrl.indexOf('http') >= 0) {
                path = baseUrl + this.data.shareUrl;
            } else {
                let idx = newURL[0].lastIndexOf('/');
                let url = newURL[0].substring(0, idx) + '/' + this.data.shareUrl;
                path = baseUrl + url;
            }
        }

        return {
            title: decodeURIComponent(this.data.title || ''),
            path: path
        }
    }
})
