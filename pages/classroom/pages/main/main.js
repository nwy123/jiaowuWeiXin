import request from '../../../../utils/request.js'
const app = getApp()
var ajax = new request;
Page({
  onShow() {
    wx.reportAnalytics('enter_home_programmatically', {})
  },
  data: {
    list: [
    ],
    
  },

  
  onLoad: function () {
    wx.hideShareMenu();
    var that = this
    var token_key = wx.getStorageSync('token_key'); 
    let data = {
      token_key:token_key
    }
    wx.showLoading({
      title: '正在加载',
    })
    ajax.request('zhjs.getBuilding', data)
      .then(function (res) {//成功
        that.setData({
             list: res.data.extend.Points
           })
           wx.hideLoading()

      }, function (res) {//失败
        wx.hideLoading()

      })
  },
})
