import resourcesModel from '../../models/resources/index';
import config from '../../common/config';
import {tapToLogin} from "../../common/login";
import accountModel from "../../models/account/index";
import event from '../../common/event'

const app = getApp();

Component({
    properties: {
        from: {
            type: String,
            value: 'home'
        }
    },
    data: {
        coatType: 0,
        isShow: false,
        url: '',
        tip: {title: '', content: '', bottom: ''},
    },
    ready() {
        resourcesModel.getContent(config.resourceContentCode.coat).then(data => {
            if (data.length) {
                this.setData({
                    url: data[0].data.list[0].src.split('?')[0],
                })
            }
        });
    },
    methods: {
        init() {
            if (app.getUid()) {
                this.setCoat();
            }else{
                event.off('user-login-success');
                event.on('user-login-success',this.setCoat.bind(this));
            }
        },
        setCoat(){
            return accountModel.getCheckApply().then(union => {
              wx.setStorageSync('applyStatus', union.data.status)
                switch (union.data.status) {
                    case 1:
                        // 申请中
                        this.setData({
                            coatType: 1,
                            tip: {title: '审核中', content: '我们将在1个工作日完成审核，审核通过后，会通过短信和有货推手公众号通知您，敬请留意！', bottom: '我知道了'}
                        });
                        this.showTip();
                        break;
                    case 2:
                        // 申请成功
                        this.setData({coatType: 2, isShow: false});
                        
                        break;
                    case 3:
                        // 申请失败
                        this.setData({
                            coatType: 1,
                            tip: {title: '申请失败', content: '申请失败', bottom: '我知道了'}
                        });
                        this.showTip();
                        break;
                    default:
                        this.setData({
                            coatType: 0,
                        })
                        this.showTip();
                        break;
                }
            })
        },
        jumpTo() {
            this.hideTip();
            if (!app.getUid()) {
                tapToLogin('');
            } else {
                return global.router.go('webview', {
                    //url: config.domains.wrap + '/activity/have-gain/index',
                    url:'https://activity.yoho.cn/feature/2601.html?share_id=5047&title=有货推手介绍'
                });
            }
        },
        //隐藏弹框
        hideTip() {
            this.setData({
                isShow: false
            })
        },
        //展示弹框
        showTip() {
            this.setData({
                isShow: true
            })
        },
        showDialog() {
            if (app.getUid()) {
                this.showTip()
            } else {
                let uri = this.data.from;
                event.off('user-login-success');
                event.on('user-login-success', function () {
                    global.router.go(uri);
                });
                event.emit('user-is-login')
            }
        }
    }
});
