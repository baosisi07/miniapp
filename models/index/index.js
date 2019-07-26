import api from '../../common/api';

export default {
    /**
     * 推荐商品列表
     * @param params
     * @returns {*}
     */
    productList(params) {
        return api.get({
            url: '',
            data: Object.assign({
                method: 'app.search.cpsPool.productList'
            }, params)
        });
    }
};
