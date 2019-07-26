import Canvas from '../../../utils/canvas';

let app = getApp();

const windowWidth = app.globalData.systemInfo.windowWidth;
const windowHeight = app.globalData.systemInfo.windowHeight;
const screenHeight = app.globalData.systemInfo.screenHeight;
const ratio = 1;

Component({
    properties: {
        timestamp: {
            type: Number,
            value: 0,
            observer: '_timestampChange'
        },
        options: {
            type: Object,
            value: {},
            observer: '_optionsChange'
        }
    },
    data: {
        show: false,
        type: 'product',
        canvasId: new Date().getTime(),
        snapWidth: windowWidth * ratio,
        snapHeight: screenHeight * ratio
    },
    ready() {
        let pages = getCurrentPages();
        this.currentPage = pages[pages.length - 1];

        this.canvas = new Canvas(this.data.canvasId, this, {
            width: this.data.snapWidth,
            height: this.data.snapHeight,
            fillColor: 'white'
        });
    },
    methods: {
        _timestampChange(timestamp) {
            if (timestamp) {
                this.tollgeShow();

                if (this[`_${this.data.type}CreatSnapShoot`]) {
                    this[`_${this.data.type}CreatSnapShoot`]();
                } else {
                    console.error(`${this.data.type} SnapShoot creat function not found `)
                }
            }
        },
        _optionsChange(options) {
            this.setData(options);
        },
        tollgeShow() {
            this.setData({show: !this.data.show});
        },
        saveSnapshootPre() {
            if (!wx.getSetting) {
                return wx.showModal({
                    title: '提示',
                    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                });
            }

            const self = this;

            wx.getSetting({
                success(res) {
                    if (res.authSetting['scope.writePhotosAlbum']) {
                        return self.saveSnapShoot();
                    }

                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success: () => {
                            self.saveSnapShoot();
                        },
                        fail: () => {
                            if (res.authSetting['scope.writePhotosAlbum']) {
                                return;
                            }

                            wx.showModal({
                                title: '',
                                content: '需要打开小程序的设置，重新授权访问您的系统相册',
                                confirmText: '去开启',
                                confirmColor: '#000000',
                                success: (mres) => {
                                    mres.confirm && wx.openSetting({});
                                }
                            });
                        },
                    })
                }
            });
        },

        saveSnapShoot() {
            let self = this;
            let width = this.data.snapWidth || 0;
            let height = this.data.snapHeight || 0;

            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: width,
                height: height,
                destWidth: width * 2,
                destHeight: height * 2,
                quality: 1.0,
                canvasId: this.data.canvasId,
                success(result) {
                    wx.saveImageToPhotosAlbum({
                        filePath: result.tempFilePath,
                        success() {
                            wx.showToast({
                                title: '保存成功',
                                icon: 'success',
                                duration: 2000
                            });
                        }
                    });
                },
                complete: function (res) {
                    self.tollgeShow();
                }
            }, this);
        },
        _productCreatSnapShoot() {
            const self = this;

            let snapWidth = this.data.snapWidth; // 画布长
            let snapHeight = this.data.snapHeight; // 画布高
            let scale = windowWidth / 262.5;
            let HScale = scale;

            let logoW = 78.4 * scale;
            let logoH = 15.4 * HScale;

            console.log((snapWidth - logoW) / 2);

            // 绘制logo
            this.canvas.image('./images/logo.png', (snapWidth - logoW) / 2, 25.2 * HScale, logoW, logoH);

            let thumbW = 227.5 * scale;
            let thumbH = 303.1 * HScale;
            let thumbX = (snapWidth - thumbW) / 2;
            let thumbY = 61.6 * HScale;

            // 绘制商品图
            this.canvas.image(this.data.thumb, thumbX, thumbY, thumbW, thumbH, {
                strokeColor: '#eeeeee',
                callback() {
                    let coverH = 56 * HScale;
                    let coverY = thumbY + thumbH - coverH;

                    self.canvas.rect(thumbX, coverY, thumbW, coverH, {
                        fillColor: 'rgba(34, 34, 34, 0.8)'
                    });

                    self.canvas.text(self.data.productName, thumbX + thumbW / 2, coverY + 10 * HScale, {
                        textAlign: 'center',
                        fontColor: 'white',
                        fontSize: 13
                    });

                    let salesX = thumbX + thumbW / 2;

                    if (self.data.marketPrice) {
                        let marketLen = self.canvas.measureText('¥' + self.data.marketPrice, 20);
                        let salesLen = self.canvas.measureText('¥' + self.data.salesPrice, 12);

                        salesX = thumbX + (thumbW - marketLen - 14) / 2;

                        self.canvas.text('¥' + self.data.marketPrice, thumbX + thumbW - (thumbW - salesLen - 14) / 2, coverY + 36 * HScale, {
                            textAlign: 'center',
                            fontColor: 'white',
                            fontSize: 12,
                            lineThrough: true
                        });
                    }

                    self.canvas.text('¥' + self.data.salesPrice, salesX, coverY + 30 * HScale, {
                        textAlign: 'center',
                        fontColor: 'white',
                        fontSize: 20
                    });
                }
            });

            let qrWH = 56 * scale;

            // 绘制wechatCode
            this.canvas.image(this.data.wechatQrCode, thumbX, thumbY + thumbH + 21 * HScale, qrWH, qrWH);

            let tipX = thumbX + qrWH + 13.7 * scale
            let tipY1 = thumbY + thumbH + 26 * scale + 10 * scale;
            let tipY2 = tipY1 + 18.3 * scale;

            this.canvas.text('长按扫码查看详情', tipX, tipY1, {
                fontColor: '#444444',
                fontSize: 9.8 * scale
            });

            this.canvas.text('实际价格以页面展示为准', tipX, tipY2, {
                fontColor: '#bbbbbb',
                fontSize: 8.4 * scale
            });
        },
      _inviteNewCreatSnapShoot() {
        const self = this;

        let snapWidth = this.data.snapWidth; // 画布长
        let snapHeight = this.data.snapHeight; // 画布高
        let scale = windowWidth / 262.5;
        let HScale = scale;

        let logoW = 78.4 * scale;
        let logoH = 15.4 * HScale;

        console.log((snapWidth - logoW) / 2);

        // 绘制logo
        this.canvas.image('./images/logo.png', (snapWidth - logoW) / 2, 25.2 * HScale, logoW, logoH);

        let thumbW = 227.5 * scale;
        let thumbH = 303.1 * HScale;
        let thumbX = (snapWidth - thumbW) / 2;
        let thumbY = 61.6 * HScale;

        // 绘制商品图
        this.canvas.image(this.data.activityImg, thumbX, thumbY, thumbW, thumbH, {
          strokeColor: '#eeeeee',
          callback() {
            
          }
        });

        let qrWH = 56 * scale;

        // 绘制wechatCode
        this.canvas.image(this.data.wechatQrCode, thumbX, thumbY + thumbH + 21 * HScale, qrWH, qrWH);

        let tipX = thumbX + qrWH + 13.7 * scale
        let tipY1 = thumbY + thumbH + 26 * scale + 10 * scale;
        let tipY2 = tipY1 + 18.3 * scale;

        this.canvas.text('长按扫码查看详情', tipX, tipY1, {
          fontColor: '#444444',
          fontSize: 9.8 * scale
        });

        this.canvas.text('活动内容以页面展示为准', tipX, tipY2, {
          fontColor: '#bbbbbb',
          fontSize: 8.4 * scale
        });
      }
    }
});
