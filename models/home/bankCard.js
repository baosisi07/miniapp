import api from '../../common/api';

export default {
    /**
     * 银行卡
     * @param params
     * @returns {*}
     */
    getBankCard() {
        return api.get({
            data: {
                method: 'app.union.shareOrder.getBankCard'
            }
        });
    },
    /**
     * 银行列表
     * @param params
     * @returns {*}
     */
    getBankList() {
        return api.get({
            data: {
                method: 'app.union.shareOrder.getBankList'
            }
        });
    },
    /**
     * 校验银行卡信息
     * @param params
     * @returns {*}
     */
    checkBankCard(params) {
        return api.get({
            data: {
                method: 'app.union.shareOrder.checkBankCard',
                ...params
            }
        });
    },
    /**
     * 绑定银行卡信息
     * @param params
     * @returns {*}
     */
    bindBankCard(params) {
        return api.get({
            data: {
                method: 'app.union.shareOrder.bindBankCard',
                ...params
            }
        });
    }
};
