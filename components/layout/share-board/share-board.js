Component({
    properties: {
        timestamp: {
            type: Number,
            value: 0,
            observer: '_timestampChange'
        },
        options: {
            type: Object,
            value: {},
            observer: '_optionsChange'
        }
    },
    data: {
        show: false,
        spaceClose: true,
        cancelText: '取消',
        image: 'http://img12.static.yhbimg.com/unionimg/2019/06/13/16/02b7b19b525fcecf732f8f293c2c6eea6e.jpg',
        // actions: [{
        //     name: '分享给朋友',
        //     className: 'action-class',
        //     actionName: ''
        // }, {
        //     name: '生成卡片并分享',
        //     className: 'action-class',
        //     actionName: ''
        // }]
    },
    ready() {
        let pages = getCurrentPages();

        this.currentPage = pages[pages.length - 1];
    },
    methods: {
        _timestampChange(timestamp) {
            if (timestamp) {
                this.tollgeShow();
            }
        },
        _optionsChange(options) {
            this.setData(options);
        },
        tollgeShow(duration) {
            duration = duration >= 0 ? duration : 200;

            let maskAnimation = wx.createAnimation({
                duration: duration,  //动画时长
                timingFunction: "linear", //线性
                delay: 0  //0则不延迟
            });
            let boardAnimation = wx.createAnimation({
                duration: duration,  //动画时长
                timingFunction: "linear", //线性
                delay: 0  //0则不延迟
            });

            let show = !this.data.show;

            if (show) {
                maskAnimation.opacity(0.5).step();
                boardAnimation.bottom(0).step();
                this.setData({show});
            } else {
                maskAnimation.opacity(0).step();
                boardAnimation.bottom(-300).step();
                setTimeout(() => {
                    this.setData({show});
                }, duration);
            }

            setTimeout(() => {
                this.setData({
                    maskAnimation,
                    boardAnimation
                });
            }, 0);

        },
        actionTap(e) {
            let {action, close, duration} = e.currentTarget.dataset;

            if (close) {
                this.tollgeShow(duration);
            }

            if (!action || !this.currentPage) {
                return;
            }

            this.currentPage[action] && this.currentPage[action](e);
        }
    }
});
