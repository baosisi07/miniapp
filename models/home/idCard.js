import api from '../../common/api';

export default {
  /**
   * 身份证
   * @param params
   * @returns {*}
   */
  getIdCard() {
    return api.get({
      data: {
        method: 'app.union.shareOrder.getIdentityCard'
      }
    });
  },

  submit(params) {
    return api.post({
      data: {
        method: ' app.union.shareOrder.bindIdentityCard',
        ...params
      }
    });
  }
};