Component({
    properties: {
        title: {
            type: String,
            value: '默认标题'
        },
        height: {
            type: String,
            value: 100,
            observer: '_setHeight'
        }
    },
    data: {
        style: ''
    },
    methods: {
        _setHeight: function(val) {
            this.setData({
                style: `height: ${val}rpx;line-height: ${val}rpx;`
            });
        }
    }
});
