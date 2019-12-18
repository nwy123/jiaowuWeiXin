//index.js
//获取应用实例
import request from '../../utils/request.js'
const app = getApp()
var ajax = new request;


Page({
  data: {
    classList: [

      ]
    
  },
  
  //事件处理函数
  
  onLoad: function () {
    wx.hideShareMenu();
    var that=this
    var token_key = wx.getStorageSync('token_key');
    let data = {
      token_key: token_key
       }
      wx.showLoading({
        title: '正在加载',
      })
    ajax.request('teakq.jxrw', data)
      .then(function (res) {//成功
      wx.hideLoading();

        var classList=res.data.extend.teacherTasks;
        that.setData({
          classList:classList
        })
        
      }, function (res) {//失败
        wx.hideLoading();
      })
   
  },
  
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
