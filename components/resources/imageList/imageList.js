const marginWidth = 30;

Component({
    properties: {
        floorData: {
            type: Object,
            value: {},
            observer: '_floorChange'
        }
    },
    methods: {
        _floorChange(data) {
            let info = data.data || {};
            let imageList = info.list || [];
            let columnNum = 1;
            let imagePercent;
            let wrapStyle = `margin: 0 ${marginWidth}rpx;`;

            if (data.template_name === 'image_list') {
                if (info.title && +info.title.column_num > 0) {
                    columnNum = info.title.column_num;
                }
                wrapStyle = '';
            } else if (data.template_name === 'twoPicture') {
                imageList.length = 2;
                columnNum = 2;
                imagePercent = 49;
                wrapStyle = `margin: 0 ${marginWidth}rpx 20rpx;`;
            } else if (data.template_name === 'newSingleImage') {
                imageList.length = 1;
            }

            imagePercent = imagePercent || 100 / columnNum;

            this.setData({
                imageList,
                columnNum,
                imageWidth: info.imageWidth || 200,
                imageHeight: info.imageHeight || 200,
                imagePercent,
                wrapStyle
            });
        },

        jumpTo(e) {
            let index = e.currentTarget.dataset.index;

            // const {
            //     floor_id,
            //     floor_name,
            //     floor_url,
            //     floor_index,
            //     floor_item_index
            // } = e.currentTarget.dataset;

            // this.triggerEvent('clickreport', {
            //     F_ID: floor_id,
            //     F_NAME: floor_name,
            //     F_URL: floor_url,
            //     F_INDEX: floor_index,
            //     I_INDEX: floor_item_index
            // });
            console.log(this.data.imageList[index].url);
            return global.router.goUrl(this.data.imageList[index].url);
        }
    }
});
