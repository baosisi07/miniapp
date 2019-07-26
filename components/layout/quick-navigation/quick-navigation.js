const router = global.router;

Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },

    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    properties: {
        show: {
            type: Boolean,
            value: true
        },
        showBackTop: {
            type: Boolean,
            value: false,
            observer: '_showBackTop'
        },
        showCart: {
            type: Boolean,
            value: false
        },
        marginBottom: {
            type: Number,
            value: 100
        },
        showMenu: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 私有数据,组件的初始数据
     * 可用于模版渲染
     */
    data: {
        // 弹窗显示控制
        isShow: true,
        isExpand: false,
        menuOpacity: 0,
        homeAnimation: {},
        shopcartAnimation: {},
        searchAnimation: {},
        indicatorAnimation: {},
        menuAnimation: {},
        isAnimation: false,
    },

    /**
     * 组件的方法列表
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
    methods: {
        /*
         * 公有方法
         */
        hide() { // 隐藏
            this.setData({isShow: !this.data.isShow});
        },
        show() { // 展示
            this.setData({isShow: !this.data.isShow});
        },
        switchMenu() {
            if (this.data.isAnimation) {
                return;
            }

            let time = 150;

            if (this.data.isExpand) {
                this.takeback(time);
            } else {
                this.popout(time);
            }

            this.setData({
                isAnimation: true
            });

            let delayTime = this.properties.showCart ? time * 3 : time * 2;

            setTimeout(function() {
                this.setData({
                    isAnimation: false
                });
            }.bind(this), delayTime);

            this.setData({
                isExpand: !this.data.isExpand,
            });
        },
        _showBackTop: function(newVal) {
            let animtionIndicator = wx.createAnimation({
                duration: 300,
                timingFunction: 'linear',
            });

            let animtionMenu = wx.createAnimation({
                duration: 300,
                timingFunction: 'linear',
            });

            if (newVal) {
                animtionIndicator.opacity(1).scale(1).step();
                animtionMenu.translateY(-49).step();
            } else {
                animtionIndicator.opacity(0).scale(0).step();
                animtionMenu.translateY(0).step();
            }

            this.setData({
                indicatorAnimation: animtionIndicator.export(),
                menuAnimation: animtionMenu.export()
            });
        },

        // 动画
        popout(time) {
            let animtionHome = wx.createAnimation({
                duration: time,
                timingFunction: 'ease-in-out'
            });
            let animationSearch = wx.createAnimation({
                duration: time,
                timingFunction: 'ease-in-out'
            });
            let animationShopcart = wx.createAnimation({
                duration: time,
                timingFunction: 'ease-in-out'
            });

            if (this.properties.showCart) {
                animationShopcart.opacity(1).translateY(-49).step();
                animationSearch.opacity(1).translateY(-49 * 2).step({duration: time * 2});
                animtionHome.opacity(1).translateY(-49 * 3).step({duration: time * 3});
                this.setData({
                    shopcartAnimation: animationShopcart.export(),
                    searchAnimation: animationSearch.export(),
                    homeAnimation: animtionHome.export()
                });
            } else {
                animationSearch.opacity(1).translateY(-49).step();
                animtionHome.opacity(1).translateY(-49 * 2).step({duration: time * 2});
                this.setData({
                    searchAnimation: animationSearch.export(),
                    homeAnimation: animtionHome.export()
                });
            }
        },

        takeback(time) {
            let animtionHome = wx.createAnimation({
                duration: time,
                timingFunction: 'ease-in-out'
            });
            let animationSearch = wx.createAnimation({
                duration: time,
                timingFunction: 'ease-in-out'
            });
            let animationShopcart = wx.createAnimation({
                duration: time,
                timingFunction: 'ease-in-out'
            });

            if (this.properties.showCart) {
                animtionHome.opacity(0).translateY(0).step();
                animationSearch.opacity(0).translateY(0).step();
                animationShopcart.opacity(0).translateY(0).step();
                this.setData({
                    homeAnimation: animtionHome.export({ duration: time * 3 })
                });
                setTimeout(function() {
                    animationSearch.opacity(0).translateY(0).step({ duration: time * 2 });
                    this.setData({
                        searchAnimation: animationSearch.export()
                    });
                }.bind(this), time);

                setTimeout(function() {
                    animationShopcart.opacity(0).translateY(0).step({ duration: time });
                    this.setData({
                        shopcartAnimation: animationShopcart.export()
                    });
                }.bind(this), time * 2);
            } else {
                animtionHome.opacity(0).translateY(0).step();
                animationSearch.opacity(0).translateY(0).step();
                this.setData({
                    homeAnimation: animtionHome.export({ duration: time * 2 })
                });
                setTimeout(function() {
                    animationSearch.opacity(0).translateY(0).step({ duration: time });
                    this.setData({
                        searchAnimation: animationSearch.export()
                    });
                }.bind(this), time);
            }
        },
        jumpToHome() {
            wx.switchTab({
                url: '/pages/index/index',
            });
        },
        jumpToSearch() {
            router.go('productSearch');
        },
        jumpToShopCart() {
        },
        backToTop() {
            this.triggerEvent('backtop');
        }
    }
});
