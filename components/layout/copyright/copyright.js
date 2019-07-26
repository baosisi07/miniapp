Component({
    properties: {
        delayShow: {
            type: Boolean,
            value: false
        }
    },
    ready: function() {
        setTimeout(() => {
            this.setData({
                delayShow: true
            });
        }, 500);
    }
});
