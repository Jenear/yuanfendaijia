const { BMap, debounce } = require('../../utils/util.js');

Page({
  data: {
    sugData: [],
    inputValue: '',
    point: 'start'
  },

  onLoad: function(e){
    const that = this;
    const { point } = e;
    that.setData({
      point
    })
    
  },

  /**
   * 输入框change
   */
  bindKeyInput: function(e) {
    const that = this;

    const { value: inputValue } = e.detail;
    that.setData({
      inputValue,
    });

    if (inputValue === '') {
        that.setData({
            sugData: ''
        });
        return;
    }

    that.delayFetchPosition(inputValue)
      .then(function (data) {
        const { result: sugData } = data;
        that.setData({
          sugData
        });
      })
      .catch(console.log)
    
  },

  /**
   * 查询位置信息
  */
  fetchPosition: function (query){
    const that = this;
    return new Promise((resolve, reject) => {
      BMap.suggestion({
        query,
        region: '北京',
        city_limit: true,
        fail: reject,
        success: resolve
      });
    })
    
  },

  /**
   * 延时位置查询
   */
  delayFetchPosition: debounce(
    function (query) {
      const that = this;
      return that.fetchPosition(query)
    }, 500),

  /**
   * 点击列表元素
   */
  handleListClick: function(e){
    const that = this;
    const {point} = that.data;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    const {dataset:{name: position}} = e.currentTarget;

    if (point === "start") {
      prevPage.setData({
        startAddress: position
      })
    } else if (point === "end") {
      prevPage.setData({
        endAddress: position
      })
    }

    wx.navigateBack({
      delta: 1,
    })
    // wx.redirectTo({
    //   url: `/pages/index/index?position=${position}&point=${point}`,
    // })
  }
})