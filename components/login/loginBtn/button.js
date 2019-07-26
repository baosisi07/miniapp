import { getPhoneNumber ,tapToLogin} from '../../../common/login.js';
Component({
    properties: {
        openType: {
            type: String,
            value: ''
        }
    },
    methods: {
        getPhoneNumber,
        tapToLogin(e){
            tapToLogin(e.detail)
        }
    }
});
