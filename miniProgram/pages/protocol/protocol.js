// 获取app变量
const app = getApp();
const { SERVER_IP } = app.globalData;
Page({
  data: {
    src: `${SERVER_IP}/shared/listence`
  },
})
