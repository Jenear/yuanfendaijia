// 获取app变量
const app = getApp();
const { SERVER_IP } = app.globalData;

Page({
  data: {
    tel: '',
    balance: 0.0,
    name: ''
  },

  onLoad: function(){
    const that = this;

    const { tel, balance, name } = app.globalData.user_info;
    that.setData({
      tel,
      balance: balance.toFixed(1),
      name
    })
  }
});