import wx from '../utils/wx';
import {stringify} from '../vendors/query-stringify';

export default {
    navigateTo(path, qs) {
        return wx.navigateTo({url: `${path}?${stringify(qs)}`});
    },
    redirectTo(path, qs) {
        return wx.redirectTo({url: `${path}?${stringify(qs)}`});
    },
    switchTab(path) {
        return wx.switchTab({url: path});
    }
};
