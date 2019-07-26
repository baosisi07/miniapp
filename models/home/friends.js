import api from '../../common/api';

export default {
  getFriendsList(page) {
    return api.get({
        data: {
          method: 'app.union.shareOrder.queryInviteList',
          page: page || 1
        }
    });
  }
};
