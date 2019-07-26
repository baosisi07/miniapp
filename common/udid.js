import uuid from '../vendors/uuid';
import wx from '../utils/wx';

export default {
    get() {
        let udid = wx.getStorageSync('udid');

        if (udid) {
            return udid;
        }


        udid = uuid().replace(/-/g, '');
        wx.setStorageSync('udid', udid);

        return udid;
    }
};
