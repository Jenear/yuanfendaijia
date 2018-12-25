const bmap = require('../../libs/bmap-wx.min.js');
const mapId = "map";
const defaultScale = 14;
let BMap = null;
let wxMarkerData = [];
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    centerLongitude: '',
    centerLatitude: '',
    //地图缩放级别
    scale: defaultScale,
    startAddress: '',
    rgcData: {},
    showNoDriverTips: true,
    isAppointment: false
  },

  onLoad: function () {
    var that = this;
    BMap = new bmap.BMapWX({
      ak: 'iA5vaGj0mvWw61lGzFUkg0A47uAGV5x7'
    });
    
    //请求百度地图api并返回模糊位置
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
    var that = this;
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
    var mapCtx = wx.createMapContext(mapId);
    mapCtx.moveToLocation();
  },

  /**
   * 拖动地图回调
   */
  regionChange: function (res) {
    var that = this;
    // 改变中心点位置  
    if (res.type == "end") {
      that.getCenterLocation();
    }
  },

  /**
     * 得到中心点坐标
     */
  getCenterLocation: function () {
    var that = this;
    //mapId 就是你在 map 标签中定义的 id
    var mapCtx = wx.createMapContext(mapId);
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
    var that = this;
    that.setData({
      centerLatitude: latitude,
      centerLongitude: longitude
    })
  },

  /**
   * 逆地址解析
   */
  regeocodingAddress: function () {
    var that = this;
    //通过经纬度解析地址
    BMap.regeocoding({
      location: that.data.centerLatitude + ',' + that.data.centerLongitude,
      success: function (res) {
        that.setData({
          startAddress: res.originalData.result.formatted_address
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  /**
   * 点击定位图标，回到当前位置
   */
  selfLocationClick: function(){
    var that = this;
    //还原默认缩放级别
    that.setData({
      scale: defaultScale
    })
    //必须请求定位，改变中心点坐标
    that.requestLocation();
  }
})