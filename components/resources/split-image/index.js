

Component({
    properties: {
      floorData: {
        type: Object,
        observer: '_dataChange'
      },
        floorIdx: {
            type: Number
        },
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
      style: ''
    },
    methods: {
      _dataChange() {
        let that = this;
        let floorData = this.data.floorData;
        let width = floorData.image_width;
        let height = floorData.image_height;
        
        wx.getSystemInfo({
          success: function(res) {
            let windowWidth = res.screenWidth;
            windowWidth = floorData.is_extend == 1 ? windowWidth : windowWidth - 30;
            let realHeight = windowWidth * height / width;
            let style = `margin: 0 ${floorData.is_extend == 1 ? 0 : 15}px; height:${realHeight}px`;
            that.setData({
              style
            })
          }
        })
        
      },
      report: function (e) {
        this.triggerEvent('clickreport', e.detail);
      }
    }

});
