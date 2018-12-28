// 获取app变量
const app = getApp();

// 获取百度地图实例
const { BMap } = require('../../utils/util.js');

const mapId = "map";
const defaultScale = 14;
let wxMarkerData = [];
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    centerLongitude: '',
    centerLatitude: '',
    // 地图缩放级别
    scale: defaultScale,
    startAddress: '',
    endAddress: '',
    // 中心图标状态
    center_img_status: 0,
    rgcData: {},
    showNoDriverTips: true,
    isAppointment: false
  },

  onLoad: function (query) {
    const that = this;
    const {position, point} = query;
    if (point === "start"){
      that.setData({
        startAddress: position
      })
    } else if (point === "end"){
      that.setData({
        endAddress: position
      })
    }

    //请求百度地图api并返回模糊位置
    that.initLocation();
  },

  /**
   * 点击个人信息图标
   */
  userInfoClick: function(){
    const { token } = app.globalData;
    if (!token||true) {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }else{
      wx.navigateTo({
        url: "/pages/user/user"
      });
    }   
  },

  /**
   * 点击目的地
   */
  handleStartClick: function(){
    const that = this;

    wx.navigateTo({
      url: '/pages/suggestion/suggestion?point=start',
    })
  },

  /**
 * 点击目的地
 */
  handleEndClick: function () {
    const that = this;

    wx.navigateTo({
      url: '/pages/suggestion/suggestion?point=end',
    })
  },

  /**
   * 点击联系客服
   */
  contactUs: () => {
    const service_tel = app.globalData.SERVICE_TEL;
    wx.makePhoneCall({
      phoneNumber: service_tel
    })
  },

  /**
   * 初始化位置信息
   */
  initLocation: function(){
    const that = this;

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude: res.latitude,//经度
          longitude: res.longitude//纬度
        })
        BMap.regeocoding({
          location: that.data.latitude + ',' + that.data.longitude,
          success: function (res) {
            that.setData({
              startAddress: res.originalData.result.formatted_address
            })
          },
          fail: function () {
            wx.showToast({
              title: '请检查位置服务是否开启',
            })
          },
        });
      },
      fail: function () {
        console.log('小程序得到坐标失败')
      }
    })
  },

  //请求地理位置
  requestLocation: function () {
    const that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        that.moveTolocation();
      },
    })
  },

  /**
   * 移动到中心点
   */
  moveTolocation: function () {
    const mapCtx = wx.createMapContext(mapId);
    mapCtx.moveToLocation();
  },

  /**
   * 拖动地图回调
   */
  regionChange: function (res) {
    const that = this;
    // 改变中心点位置  
    if (res.type == "end") {
      that.getCenterLocation();
    }
  },

  /**
     * 得到中心点坐标
     */
  getCenterLocation: function () {
    const that = this;

    // mapId 就是你在 map 标签中定义的 id
    const mapCtx = wx.createMapContext(mapId);
    mapCtx.getCenterLocation({
      success: function (res) {
        that.updateCenterLocation(res.latitude, res.longitude);
        that.regeocodingAddress();
        // that.queryMarkerInfo();
      }
    })
  },

  /**
 * 更新中心坐标点
 */
  updateCenterLocation: function (latitude, longitude)   {
    const that = this;
    that.setData({
      centerLatitude: latitude,
      centerLongitude: longitude,
    })
  },

  /**
   * 逆地址解析
   */
  regeocodingAddress: function () {
    const that = this;
    
    // 修改中心图标状态
    that.setData({
      center_img_status: 1,
    })
    //通过经纬度解析地址
    BMap.regeocoding({
      location: that.data.centerLatitude + ',' + that.data.centerLongitude,
      success: function (res) {
        that.setData({
          startAddress: res.originalData.result.formatted_address,
          center_img_status: 0,
        })
      },
      fail: function (res) {
        that.setData({
          center_img_status: 0,
        })
        console.log(res);
      }
    });
  },

  /**
   * 点击定位图标，回到当前位置
   */
  selfLocationClick: function(){
    const that = this;
    //还原默认缩放级别
    that.setData({
      scale: defaultScale
    })
    //必须请求定位，改变中心点坐标
    that.requestLocation();
  }
})