import udid from '../../common/udid';
import config from '../../common/config';

Component({
    /**
     * 组件的初始数据
     */
    data: {
        imageSrc: '',
        degrees: [0, 0, 0, 0],
        imageClass: [0, 0, 0, 0]
    },

    attached: function() {
        this.setData({
            imageSrc: this.getVerifyImage()
        });
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 获取图片
         */
        getVerifyImage: function() {
            let timestamp = Date.parse(new Date());
            let url = `${config.domains.api}/passport/img-check?business_line=${config.apiParams.business_line}&app_version=0.0.1&udid=${udid.get()}&client_type=${config.apiParams.client_type}&fromPage=${config.apiParams.client_type}&t=${timestamp}`; // eslint-disable-line

            return url;
        },

        /**
         * 更新图片
         */
        refreshImage: function() {
            this.setData({
                imageSrc: this.getVerifyImage()
            });
        },

        /**
         * 改变图片的方向
         */
        changeDirection: function(event) {
            let indexNum = event.currentTarget.id.replace('image-', '');
            let degrees = this.data.degrees;
            let imageClass = this.data.imageClass;

            degrees[indexNum] = (degrees[indexNum] + 1) % 4;
            imageClass[indexNum] = (imageClass[indexNum] + 140) % 560;

            this.setData({
                degrees: degrees,
                imageClass: imageClass
            });
            this.triggerEvent('refreshCode', {
                degrees: this.data.degrees
            });
        }
    }
});
