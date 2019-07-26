import api from '../common/api';

export default {
    /**
     * 添加微信模版消息FormId
     * @param params
     * @returns {*}
     */
    addWechatFormId(params) {
        return api.get({
            data: Object.assign({
                method: 'wechat.formId.add'
            }, params)
        });
    },
};
