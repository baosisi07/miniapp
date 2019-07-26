function choose(callback) {
    wx.chooseAddress({
        success(res) {
            if (callback && typeof callback === 'function') {
                return callback(res);
            }
        }
    });
}

function beforeChoose(callback) {
    if (wx.getSetting) {
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.address']) {
                    wx.authorize({
                        scope: 'scope.address',
                        success() {
                            choose(callback);
                        },
                        fail() {
                            wx.showModal({
                                content: '获取微信地址授权失败,请重新授权',
                                showCancel: false,
                                confirmText: '好的'
                            });
                        }
                    });
                } else {
                    choose(callback);
                }
            }
        });
    } else {
        wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        });
    }
}

export default {
    choose: beforeChoose
};
