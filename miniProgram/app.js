//app.js
const { urlFormatter, fetchData } = require('./utils/util.js');

App({
  // 全局变量
  globalData: {
    SERVER_IP: "http://47.94.0.63",
    SERVICE_TEL: '400 828 3718',
    user_info: '',
    openId: '',
    token: ''
  },

  // 启动小程序
  onLaunch: function () {
    const that = this;
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    that.login();
    // 获取用户信息
    // that.getUserInfo()
  },

  // 登录
  login: function(){
    const that = this;

    wx.login({
      success: function(res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const url = urlFormatter(that.globalData.SERVER_IP, '/customer/wxlogin')
        fetchData(url, { code: res.code })
          .then(resData => {
            const { data: { map: { USER, token, openId } } } = resData;
            that.globalData.openId = openId;
            that.globalData.token = token;
            that.globalData.user_info = {...USER}
          })
          .catch(err => console.log)
      }
    })
  },

  // 获取用户信息
  getUserInfo: function(){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: err => {
              console.log('fail: ', err)
            }
          })
        }
      }
    })
  }
})