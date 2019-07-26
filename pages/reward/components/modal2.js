// pages/reward/components/modal2.js

let router = global.router;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    confirm() {
      this.triggerEvent('confirm');
    },
    cancel() {
      this.triggerEvent('cancel');
    },
    goDesc() {
      router.goUrl('http://m.yohobuy.com?openby:yohobuy={"action":"go.h5","params":{"title":"提现说明", "url":"https://activity.yoho.cn/feature/3233.html"}}');
    }
  }
})
