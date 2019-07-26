import api from '../../common/api';

export default {
    getMessageList(page) {
        return api.get({
            data: {
                method: 'app.union.shareOrder.queryMessageList',
                page: page || 1
            }
        });
    }
};
