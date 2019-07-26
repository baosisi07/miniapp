Component({
    properties: {
        url: {
            type: String,
            value: ''
        },

        // use for floors' click report
        floorId: { // 楼层id
            type: String,
            value: ''
        },
        floorName: { // 楼层名称
            type: String,
            value: ''
        },
        floorIndex: { // 楼层序号（从1开始）
            type: String,
            value: ''
        },
        floorUrl: { // 楼层传参）
            type: String,
            value: ''
        },
        floorItemIndex: { // 楼层内部item的index（从1开始，所有楼层more按钮index传0）
            type: String,
            value: ''
        }
    },
    methods: {
        jumpTo: function(e) {
            const {
                floor_id,
                floor_name,
                floor_url,
                floor_index,
                floor_item_index
            } = e.currentTarget.dataset;

            this.triggerEvent('clickreport', {
                F_ID: floor_id,
                F_NAME: floor_name,
                F_URL: floor_url,
                F_INDEX: floor_index,
                I_INDEX: floor_item_index
            });
            return global.router.goUrl(this.data.url);
        }
    }
});
