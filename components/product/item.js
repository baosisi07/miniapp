let router = global.router;

Component({
    properties: {
        item: {
            type: Object,
            value: {}
        }
    },
    methods: {
        goDetail(e) {
            let productSkn = e.currentTarget.dataset.skn;
            let collagePrice = e.currentTarget.dataset.cprice;
            let collageRebatesPrice = e.currentTarget.dataset.crebates;
            this.triggerEvent('productclick', {productSkn});
            router.go('productDetail', {productSkn,collagePrice,collageRebatesPrice});
        }
    }
});
