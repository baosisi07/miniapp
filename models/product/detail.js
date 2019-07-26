import api from '../../common/api';

export default {
    /**
     * 商品信息
     * @param skn
     * @returns {*}
     */
    getProductInfo(skn) {
        return api.get({
            data: {
                method: 'app.union.shareOrder.getProductInfo',
                product_skn: skn
            }
        });
    },

    /**
     * 相似商品
     * @param skn
     * @returns {*}
     */
    getSimilarProductList(skn) {
        return api.get({
            data: {
                method: 'app.search.cpsSimilar.productList',
                product_skn: skn
            }
        });
    },

    /**
     * 分享信息
     * @param skn
     * @returns {*}
     */
    getShareCodeInfo(skn) {
        return api.get({
            data: {
                method: 'app.union.shareOrder.getShareCodeInfo',
                type: 1,
                unionType: 11446,
                skn
            }
        });
    },

    /**
     * 商品收藏状态
     * @param id
     * @returns {*}
     */
    getProductFavStatus(id) {
        return api.get({
            data: {
                method: 'app.favorite.isFavoriteNew',
                type: 'product',
                id
            }
        });
    },

    /**
     * 商品收藏
     * @param id
     * @returns {*}
     */
    setProductFav(id, isCancel) {
        return api.get({
            data: {
                method: isCancel ? 'app.favorite.cancel' : 'app.favorite.add',
                type: 'product',
                fav_id: id,
                id
            }
        });
    }
};
