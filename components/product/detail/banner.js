import wx from '../../../utils/wx';
import formatImage from '../../../utils/formatImage';

Component({
    properties: {
        imageList: {
            type: Array,
            value: []
        }
    },
    data: {
        indicatorDots: false,
        interval: 5000,
        autoplay: false,
        duration: 500,
        circular: true,
        swiperCurrent: 0
    },
    methods: {
        swiperChange: function(e) {
            this.setData({
                swiperCurrent: e.detail.current
            });
        }
    }
});
