

Component({
    properties: {
        src: {
            type: String,
            observer: '_dataChange'
        },
        width: Number,
        height: Number,
        isExtend: String,
        mode: {
            type: Number,
            value: 2
        },
        imageMode: {
            type: String,
            value: 'widthFix'
        },
        defaultWidth: { // 宽度100%
            type: Boolean,
            value: false
        }
    },
    data: {
        style: ''
    },
    methods: {
        _dataChange() {
            let width = `${this.data.width ? `${(+this.data.width > 750 ? 750 : +this.data.width)}rpx; ` : '100%;'}`;
          let realHeight = this.data.realHeight;
            // 图片宽度100%
            this.data.defaultWidth && (width = '100%; ');
            if (this.data.width && this.data.height) {
                this.data.src = this.formatImageUrl(this.data.src, this.data.width, this.data.height, this.data.mode);
            }

          
            this.setData({
                src: this.data.src,
              style: `width: ${width}`
            });
        },
     formatImageUrl(url, width, height, mode) {
        url = url || '';
        if(url && url.indexOf('?') === -1) {
          url += '?imageView2/{mode}/w/{width}/h/{height}';
        }

        return url.replace(/{width}/g, width).replace(/{height}/g, height).replace('{mode}', mode || 2);
        }
    }
});
