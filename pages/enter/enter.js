// pages/enter/enter.js
import request from '../../utils/request.js'
const app = getApp()
var ajax = new request;

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

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
    wx.login({
        success(res) {
          if (res.code) {
           let data = {
              code: res.code
            }
            ajax.request('login.checkLogin', data)
              .then(function (res) {//成功
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
                // if (userInfo.type==3){//管理员
                //   wx.redirectTo({
                //     url: '../main/main',
                //   })
                // }
                 if (userInfo.type == 1){//学生
                  wx.redirectTo({
                    url: '../main1/main1',
                  })
                } if (userInfo.type == 2 || userInfo.type==3) {//教师
                  wx.redirectTo({
                    url: '../main2/main2',
                  })
                }
              }, function (res) {//失败
                wx.redirectTo({
                  url: '../login/login',
                })
              })
            }
          }
        })
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

  
  
})