const router = global.router;
Page({
    onLoad: function (options) {
        router.go('productDetail',{productSkn:options.productSkn},'redirectTo');
    },
});