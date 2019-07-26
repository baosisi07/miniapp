import api from '../../common/api';

export default {
    getContent(content_code) {
        return api.get({
            url: '/operations/api/v5/resource/get',
            data: {
                content_code,
                platform: 'platform' // 需要 APP 格式的网址
            },
            code: 200
        });
    },
    getInvitecodeTotal() {
        return api.get({
            data: {
                method: 'app.invitecode.total'
            }
        });
    }
};
