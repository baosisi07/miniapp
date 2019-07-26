Component({
    properties: {
        list: {
            type: Array,
            value: []
        },
        showLoading: {
            type: Boolean,
            observer: '_loading'
        },
        showNoMore: {
            type: Boolean,
            observer: '_more'
        }
    },
    data: {
        _showLoading: false,
        _showNoMore: false,
    },
    methods: {
        click: function(e) {
            const {productSkn} = e.detail;
            const {idx} = e.currentTarget.dataset;

            this.triggerEvent('productclick', {idx, productSkn});
        },
        _more: function(status) {
            this.setData({
                _showNoMore: status
            });
        },
        _loading: function(status) {
            this.setData({
                _showLoading: status
            });
        }
    }
});
