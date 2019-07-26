import api from '../../common/api';

export default {
  getInviteList(params) {
    return api.get({
      data: {
        method: 'app.union.shareOrder.queryInviteYohoList',
        ...params
      }
    });
  }
};