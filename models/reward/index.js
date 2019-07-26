import api from '../../common/api';

export default {
  getQueryShareTotal() {
    return api.get({
      data: {
        method: 'app.union.shareOrder.queryShareTotal'
      }
    });
  },
  getSettlementInfo() {
    return api.get({
      data: {
        method: 'app.union.shareOrder.settlementInfo'
      }
    });
  },
  getStatisticsInfo(type = 1) {
    return api.get({
      data: {
        method: 'app.union.shareOrder.getStatisticsInfo',
        queryTimeType: type
      }
    });
  },
  getOrderList(type, status, page) {
    let data = {
      method: 'app.union.shareOrder.queryOrderList',
      type: type || 1,
      order_type: 1,
      size: 20,
      page: page || 1
    };

    if (status) {
      data.order_status = status;
    }

    return api.get({
      data
    });
  },
  getOrderDetail(code) {
    return api.get({
      data: {
        method: 'app.union.shareOrder.queryOderDetail',
        order_code: code
      }
    });
  },
  getActivityOrderDetail(id) {
    return api.get({
      data: {
        method: 'app.union.shareOrder.queryActivityOrder',
        id: id
      }
    });
  },
  getSettlementRecord(page) {
    return api.get({
      data: {
        method: 'app.union.shareOrder.querySettlementRecord',
        page: page || 1,
        size: 20
      }
    });
  },
  getTopList(type, page) {
    return api.get({
      data: {
        method: 'app.union.shareOrder.queryRankList',
        type: type || 1,
        page: page || 1,
        size: 10
      }
    });
  },
  applySettlement() {
    return api.get({
      data: {
        method: 'app.union.shareOrder.addSettlement'
      }
    });
  },
  checkSettlement() {
    return api.get({
      data: {
        method: 'app.union.shareOrder.checkSettlement'
      }
    });
  }
};