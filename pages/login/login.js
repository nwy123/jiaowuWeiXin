// pages/login/login.js

import request from '../../utils/request.js'
const util = require('../../utils/util.js')
const app = getApp()
var ajax = new request;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:''
  },
  
  /**获取userName */
  formSubmit:util.throttle(function(e) {
    var that = this;
    var username = e.detail.value.username;
    var password = e.detail.value.password;
      wx.login({
        success(res) {
          if (res.code) {
            var item = JSON.stringify(e.detail.value);
            var valueData = item.slice(0, item.length - 1) + ',"code":"' + res.code + '"' +item.slice(item.length - 1);
            let data = JSON.parse(valueData);
            if (username == "") {
              wx.showToast({
                title: '用户名为空',
                icon:'none',
                duration: 2000
              })
            }else{
              if (password == ""){
                wx.showToast({
                  title: '密码为空',
                  icon: 'none',
                  duration: 2000
                })
              }else{
                wx.showLoading({
                  title: '正在加载',
                })
                ajax.request('login.login', data)
                  .then(function (res) {//成功
                    wx.hideLoading();
                    var userInfo = res.data.extend.userInfo;
                    //消息存入缓存
                    wx.setStorage({
                      key: "token_key",
                      data: res.data.extend.token_key
                    })
                    wx.setStorage({
                      key: 'userInfo',
                      data: userInfo,
                    })
                    if (userInfo.type == 1){//学生
                      wx.redirectTo({
                        url: '../main1/main1',
                      })
                    } if (userInfo.type == 2 || userInfo.type == 3) {//教师
                      wx.redirectTo({
                        url: '../main2/main2',
                      })
                    }
                  }, function (res) {//失败
                    var msg=res.data.msg
                    wx.showToast({
                      title: msg,
                      icon: 'none'
                    })
                  })
              }
            }
          }
        }
      })
    },1000),


  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();

    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})