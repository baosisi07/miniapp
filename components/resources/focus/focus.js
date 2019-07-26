Component({
    properties: {
        swiperList: {
            type: Array,
            value: []
        },
        swieperSpeed: {
            type: String,
            value: '0'
        },

        // use for floors' click report
        floorId: {
            type: String,
            value: ''
        },
        floorName: {
            type: String,
            value: ''
        },
        floorIndex: {
            type: String, // start from 1
            value: ''
        }
    },
    data: {
        indicatorDots: false,
        interval: 5000,
        autoplay: true,
        duration: 500,
        circular: true,
        swiperCurrent: 0
    },
    methods: {
        swiperChange: function(e) {
            this.setData({
                swiperCurrent: e.detail.current
            });
        },

        // use for floors' click report
        report: function(e) {
            this.triggerEvent('clickreport', e.detail);
        }
    }
});
