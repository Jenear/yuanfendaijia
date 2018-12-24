const bmap = require('../../libs/bmap-wx.min.js');
const mapId = "map";
let wxMarkerData = [];
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    startAddress: '',
    rgcData: {},
    showNoDriverTips: true,
    isAppointment: false
  },
  // makertap: function (e) {
  //   var that = this;
  //   var id = e.markerId;
  //   that.showSearchInfo(wxMarkerData, id);
  // },
  onLoad: function () {
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'iA5vaGj0mvWw61lGzFUkg0A47uAGV5x7'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      console.log(data)
      wxMarkerData = data.wxMarkerData;
      // that.setData({
      //   markers: wxMarkerData
      // });
      // that.setData({
      //   latitude: wxMarkerData[0].latitude
      // });
      // that.setData({
      //   longitude: wxMarkerData[0].longitude
      // });
      that.updateCenterLocation(wxMarkerData[0].latitude, wxMarkerData[0].longitude)
      that.setData({
        startAddress: wxMarkerData[0].address
      })
    }
    BMap.regeocoding({
      fail: fail,
      success: success,
      // iconPath: '../../img/marker_red.png',
      // iconTapPath: '../../img/marker_red.png'
    });
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
        console.log('getCenterLocation----------------------->');
        console.log(res);
        // that.updateCenterLocation(res.latitude, res.longitude);
        // that.regeocodingAddress();
        // that.queryMarkerInfo();
      }
    })
  },

  /**
 * 更新上传坐标点
 */
  updateCenterLocation: function (latitude, longitude)   {
    var that = this;
    that.setData({
      latitude: latitude,
      longitude: longitude
    })
  },

  /**
   * 逆地址解析
   */
  regeocodingAddress: function () {
    var that = this;
    //不在发布页面，不进行逆地址解析，节省调用次数，腾讯未申请额度前一天只有10000次
    if (!that.data.showConfirm) {
      return;
    }
    //通过经纬度解析地址
    BMap.regeocoding({
      location: {
        latitude: that.data.centerLatitude,
        longitude: that.data.centerLongitude
      },
      success: function (res) {
        console.log(res);
        that.setData({
          centerAddressBean: res.result,
          selectAddress: res.result.formatted_addresses.recommend,
          currentProvince: res.result.address_component.province,
          currentCity: res.result.address_component.city,
          currentDistrict: res.result.address_component.district,
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  // showSearchInfo: function (data, i) {
  //   var that = this;
  //   that.setData({
  //     rgcData: {
  //       address: '地址：' + data[i].address + '\n',
  //       desc: '描述：' + data[i].desc + '\n',
  //       business: '商圈：' + data[i].business
  //     }
  //   });
  // }

})