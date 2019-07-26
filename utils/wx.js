import Promise from '../vendors/es6-promise';

const api = {};
const apiNames = [
    'request',
    'navigateTo',
    'navigateBack',
    'redirectTo',
    'switchTab',
    'showLoading',
    'hideLoading',
    'navigateToMiniProgram',
    'getUserInfo',
    'getSetting',
    'openSetting',
    'showModal',
    'login',
    'scanCode',
    'checkSession',
    'setStorage',
    'showToast',
    'getSystemInfo',
    'setClipboardData'
];

apiNames.forEach(key => {
    if (typeof wx[key] === 'function') {
        api[key] = (params = {}) => {
            return new Promise((resolve, reject) => {
                // console.debug(`call api ${key}: `, Object.assign({}, params));
                params.success = res => {
                    // console.debug(`call api ${key} result: `, res);
                    return resolve(res);
                };
                params.fail = err => {
                    // console.debug(`call api ${key} error: `, err);
                    return reject(err);
                };
                return wx[key](params);
            });
        };
    }
});

export default Object.assign({}, wx, api);
