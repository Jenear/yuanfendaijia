/**
 * 百度地图实例
*/
const bmap = require('../libs/bmap-wx.min.js');
const BMap = new bmap.BMapWX({
  ak: 'iA5vaGj0mvWw61lGzFUkg0A47uAGV5x7'
});

/**
 * 格式化时间
*/
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const obejct2Query = (paramObject) => {
  let obj = {...paramObject};
  let url = `?`;
  const queryString = Object.keys(obj).reduce((accumulator, currentKey) =>
    accumulator + currentKey + '=' + obj[currentKey], url);
  return queryString;
}

/**
 * 格式化URL
 */
const urlFormatter = (serverIp, path, paramObject) => {
  // const queryString = obejct2Query(paramObject);
  return `${serverIp}${path}`
}

/**
 * 请求数据
 */
const fetchData = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 校验手机号
 */
const checkMobile = phoneNumber => /^1[3|4|5|7|8]\d{9}$/.test(phoneNumber);

/**
 * 校验手机验证码
 */
const checkPhoneCode = phoneCode => /\d{6}/.test(phoneCode);

/**
 * 防抖
 */
const debounce = function(fn, wait) {
  let timer = null;
  return function (...args) {
    return new Promise((resolve, reject) => {
      const context = this
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(function () {
        resolve(fn.apply(context, args))
      }, wait)
    }) 
  }
}

module.exports = {
  formatTime,
  urlFormatter,
  checkMobile,
  checkPhoneCode,
  fetchData,
  BMap,
  debounce
}
