import config from './config';
import rules from '../router/rules';
import {MD5} from '../vendors/crypto';
import {parse} from '../vendors/query-stringify';

export default class yas {
    constructor(app) {
        let self = this;

        this.app = app || getApp();
        this.pvid = this.app.getPvid();
        this.deviceInfo = {
            os: '', // 系统类型
            dm: '', // 设备型号
            res: '', // 屏幕大小
            osv: '', // 系统版本
            ak: 'yhshop_mp',
            ch: this.app.globalData.union_type || this.app.globalData.ch || '',
            udid: this.app.globalData.udid
        };

        // 获取设备信息
        wx.getSystemInfo({
            success(res) {
                self.language = res.language;

                if (res.platform === 'devtools') {
                    self.devEnv = true;
                }

                Object.assign(self.deviceInfo, {
                    os: res.platform,
                    dm: res.model,
                    res: `${res.screenWidth}*${res.screenHeight}`,
                    osv: res.system,
                });
            }
        });
    }
    uploadData(params) {
        let sid = '';

        if (this.app && this.app.globalData) {
            sid = this.app.globalData.sid || '';
        }

        // 开发环境不上报
        if (this.devEnv) {
            return console.log(params);
        }

        return wx.request({
            url: config.domains.yasApi,
            data: {_mlogs: JSON.stringify(params)},
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'x-yoho-sid': MD5(sid).toString(),
            },
        });
    }
    report(event, info) {
        return; // 暂不上报，待上报需求提供

        let self = this;
        let userInfo = info || {};
        let statusInfo = {ln: this.language};

        if (this.app) {
            Object.assign(userInfo, {
                UNION_ID: this.app.getUnionID(),
                APP_ID: this.app.getAppId()
            });
        }

        if (!userInfo.PV_ID) {
            userInfo.PV_ID = this.pvid;
        }

        return new Promise(resolve => {
            wx.getNetworkType({
                success(res) {
                    switch (res.networkType) {
                        case 'wifi':
                            statusInfo.net = '1';
                            break;
                        case '2g':
                            statusInfo.net = '2';
                            break;
                        case '3g':
                            statusInfo.net = '3';
                            break;
                        case '4g':
                            statusInfo.net = '1';
                            break;
                        default:
                            statusInfo.net = '0';
                            break;
                    }
                },
                complete() {
                    return resolve(self.uploadData({
                        status: statusInfo,
                        device: self.deviceInfo,
                        events: [{
                            param: userInfo,
                            ts: new Date().getTime(),
                            op: event,
                            uid: self.app.getReportUid(),
                            sid: self.app.globalData.sid || '',
                        }]
                    }));
                }
            });
        });
    }
    pageOpenReport(pvid, extra) {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        let path = `/${currentPage.route}`,
            options = currentPage.options || {},
            fromPage = options.fromPage || '',
            fromParam = parse(decodeURIComponent(options.fromParam || ''));

        let info = {PV_ID: pvid || this.pvid};

        for (let i in rules) {
            if (rules.hasOwnProperty(i) && rules[i].path === path) {
                Object.assign(info, {
                    PAGE_PATH: path,
                    PAGE_NAME: rules[i].report && rules[i].report.pageName || i,
                    FROM_PAGE_NAME: fromPage && rules[fromPage].report && rules[fromPage].report.pageName || fromPage
                });

                info.PAGE_PARAM = '';
                info.FROM_PAGE_PARAM = '';
                if (rules[i].report && rules[i].report.paramKey) {
                    info.PAGE_PARAM = options[rules[i].report.paramKey] || '';
                }

                if (fromPage && rules[fromPage].report && rules[fromPage].report.paramKey) {
                    info.FROM_PAGE_PARAM = fromParam[rules[fromPage].report.paramKey] || '';
                }
            }
        }

        this.report('YB_PAGE_OPEN_L', Object.assign(info, extra || {}));
    }
}
