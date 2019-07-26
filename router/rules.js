import jump from './jump';

export default {
    home: {path: '/pages/index/index', type: jump.switchTab},
    reward: {path: '/pages/reward/index', type: jump.switchTab},
    message: {path: 'pages/message/list', type: jump.switchTab},
    userCenter: {path: '/pages/home/home', type: jump.switchTab},

    productList: {path: '/pages/product/list/list'},
    productDetail: {path: '/pages/product/detail/detail', report: {paramKey: 'productSkn'}},

    rewardTop: {path: '/pages/reward/top/top'},
    rewardList: {path: '/pages/reward/list/list'},
    rewardDetail: {path: '/pages/reward/detail/detail'},
    rewardExtract: {path: '/pages/reward/extract/extract'},

    bindMobile: {path: '/pages/account/bindMobile'},
    chooseArea: {path: '/pages/account/chooseArea'},

    bankCard: {path: '/pages/home/bankCard/bankCard'},
    bankList: {path: '/pages/home/bankCard/bankList'},

    idCard: {path: '/pages/home/idCard/idCard'},

    friends: {path: '/pages/home/friends/friends'},

    webview: {path: '/pages/webview/webview'},
    login: {path: '/pages/login/login'},
    goodsDetail: {path: '/pages/goodsDetail/goodsDetail'},
    inviteNew: { path: '/pages/inviteNew/inviteNew'}
};
