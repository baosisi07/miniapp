const config = {
    domains: {
        // test3
        api: 'http://api-test3.dev.yohocorp.com',
        // wrap: 'http://m.yohobuy.com',

        // gray
        // api: 'http://apigray.yoho.cn',

        // production
        // api: 'https://api.yoho.cn',
        yasApi: 'https://analysis.yohobuy.com/yas_mobile'

    },
    apiParams: {
        client_type: 'miniapp',
        business_line: 'miniappRebate',
        private_key: 'b43890b0a296ff3c7b8c260ca763980b',
        app_version: '6.9.7',
      miniapp_version: '1.2.0',
      source_type: 'wechat',
      user_source: 'wechat'
    },
    appid: 'wx193403dfd8cf74a1', // 业务中使用、与package.config.json内appid保持一致
    unionType: '', // 渠道号后台写死
    mini_app_type: '62', // 小程序类型
    resourceContentCode: {
        index: 'b688fc3b15100d23f247271b7dbe1193',
        home: {
            top: '72c65730150543d295532c942b0e5a33'
        },
        coat:'9d1a46355cd36a89eca1cb7729acf690',
      inviteNew: 'a51c8222d21b3d88faa4a49c01c9c93e'
    }
};

export default config;
