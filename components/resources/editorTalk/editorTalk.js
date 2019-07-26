Component({
    properties: {
        floorData: {
            type: Object,
            value: {},
            observer: '_floorChange'
        }
    },
    methods: {
        _floorChange(info) {
            let data = info.data || {};
            let {context, shareMainTitle, shareSubTitle} = data.invite || {};

            this.setData({
                talks: [
                    {
                        class: 'title',
                        main: this.handelContext(shareMainTitle)
                    },
                    {
                        class: 'sub-title',
                        main: this.handelContext(shareSubTitle)
                    },
                    {
                        class: 'content',
                        main: this.handelContext(context)
                    }
                ]
            });
        },
        handelContext(text) {
            text = text || '';

            let replaceKey = '#@@@@@@@@@@@@#';
            let arr = text.replace(/<[^>]+>/g, replaceKey).split(replaceKey);
            let resArr = [];

            arr.forEach(value => {
                if (value) {
                    let item = {
                        content: value
                    };

                    if (/\d+/.test(value)) {
                        item.tag = 'text';
                        item.class = 'red';
                    }

                    resArr.push(item);
                }
            });

            return resArr;
        },
        jumpTo(e) {
            return global.router.go('webview', {
                title: this.properties.floorData.data.name || '',
                url: 'https://activity.yoho.cn/feature/357.html'
            });

            // this.triggerEvent('clickreport', e.detail);
        }
    }
});
