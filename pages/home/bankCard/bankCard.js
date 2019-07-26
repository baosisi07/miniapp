import bankCardModel from '../../../models/home/bankCard';

let router = global.router;

Page({
    data: {
        formList: [
            {
                title: '持卡人',
                placeholder: '请输入持卡人姓名',
                type: 'name',
                errorTip: '您输入的姓名不符合规范，请重新输入'
            },
            {
                title: '身份证号',
                placeholder: '请输入身份证号',
                type: 'idCardNo',
                errorTip: '您输入的身份证号码不符合规范，请重新输入' // 15个数字
            },
            {
                title: '开户行',
                placeholder: '请选择开户行',
                type: 'bankName',
                errorTip: '请选择开户行',
                tapGo: 'goBankList',
                bandCode: '',
            },
            {
                title: '分行 支行',
                placeholder: '例如：南京分行雨花支行',
                type: 'bankBranch',
                errorTip: '请输入正确的分行和支行信息',
                tapTip: 'showTip'
            },
            {
                title: '银行卡号',
                placeholder: '请输入银行卡号',
                type: 'bankCardNo',
                errorTip: '您输入的银行卡号不符合规范，请重新输入'
            },
        ],
        errorTip: '',
        showTip: false,
    },
    onLoad() {
        this.loadBankcard();
    },
    loadBankcard() {
        bankCardModel.getBankCard().then(res => {
            if (res.code === 200 && res.data) {
                this.setData({
                    isEdit: false,
                    bankCard: res.data
                });
            };
        });
    },
    tapToEdit() {
        this.setData({isEdit: true});
    },
    goBankList() {
        router.go('bankList');
    },
    showTip() {
      this.setData({
        showTip: true
      });
    },
    hideTip() {
      this.setData({
        showTip: false
      });
    },
    onInputChanged(e) {
      let type = e.currentTarget.dataset.type;
      let formList = this.data.formList || [];

      formList.forEach(val => {
        if (val.type === type) {
          val.value = e.detail.value;
        }
      });
      this.setData({ formList });
    },
    chooseBankCallback(info) {
        let formList = this.data.formList || [];

        formList.forEach(val => {
            if (val.type === 'bankName') {
                val.value = info.name;
                val.bankCode = info.code;
            }
        });

        this.setData({formList});
    },
    saveBank() {
        let info = {};
        let errorTip;
        for (var i = 0; i < this.data.formList.length; i++){
          let result = this.data.formList[i];
          let value = result.value;
          if (!value) {
            errorTip = result.errorTip;
            break;
          }
          info[result.type] = value;

          if (result.type === 'bankName') {
            info.bankCode = result.bankCode;
          }
        }
        
        if (errorTip) {
            return this.setData({errorTip});
        }

        bankCardModel.checkBankCard(info).then(res => {
            if (res.code === 200) {
                this.setData({ errorTip: '' });
                this.saveBankConfirm(res.data);
            } else {
                this.setData({errorTip: res.message || '输入信息有误，请检查后提交！'});
            }
        });
    },
    saveBankConfirm(info) {
        this.setData({confirmBank: info});
    },
    saveBankConfirmSure() {
        bankCardModel.bindBankCard(this.data.confirmBank).then(subRes => {
            subRes.code === 200 && this.loadBankcard();
            this.saveBankConfirmCancel();
        });
    },
    saveBankConfirmCancel() {
        this.setData({confirmBank: ''});
    },
    phoneCall() {
        wx.makePhoneCall({
            phoneNumber: '400-889-9646'
        })
    }
})
