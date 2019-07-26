import messageModel from '../../models/message/index';

let app = getApp();
let router = global.router;
let {windowHeight} = app.getSystemInfo();

Page({
    data: {
        windowHeight,
        msgList: [],
    },
    onLoad() {
        this.loadMsg();

        // yas = new Yas(app);
        // yas.pageOpenReport();
    },
    onShow() {
        // yas.report('YB_MAIN_TAB_C', {TAB_ID: 1});
    },
    loadMsg() {
        let page = this.page || 1;
        let list = this.data.msgList || [];

        if (page < 2) {
            this.isEnd = false;
            list = [];
        }

        if (this.isEnd || this.loading) {
            return;
        }

        this.loading = true;

        messageModel.getMessageList(page).then(res => {
            this.loading = false;

            if (res.code !== 200) {
                return;
            }

            let data = res.data || {};

            if (+page >= +data.totalPage) {
                this.isEnd = true;
            }

            this.page = ++page;

            this.setData({
                msgList: [...list, ...data.list]
            });
        });

    },
    lower() {
        this.loadMsg();
    },
    jumpToUrl(e) {
        let url = e.currentTarget.dataset.url;

        url && router.goUrl(url);
    }
})
