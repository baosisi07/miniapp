import api from '../../common/api';

export default {
    /**
     * 商品列表
     * @param params
     * @returns {*}
     */
    productList(params) {
        return api.get({
            data: Object.assign({
                method: 'app.search.cpsPool.productList'
            }, params)
        });
    }
};
