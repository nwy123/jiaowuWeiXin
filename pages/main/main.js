// pages/mian/main.js
import request from '../../utils/request.js'
const util = require('../../utils/util.js')
var ajax = new request;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    number:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var userInfo = wx.getStorageSync('userInfo');
    var name=userInfo.teacher.name
    var number = userInfo.teacher.number
    this.setData({
      name:name,
      number:number
    })
  },
  /**解除绑定 */
  jiebang: util.throttle(function(){
    wx.showModal({  
      content: '是否确认解除账号绑定',
      success(res) {
        if (res.confirm) {
          var token_key = wx.getStorageSync('token_key');
          let data = {
            token_key: token_key
          }
          ajax.request('login.layout', data)
            .then(function (res) {//成功
              wx.setStorage({
                key: "token_key",
                data: ''
              })
              wx.redirectTo({
                url: '../login/login',
              })
            }, function (res) {//失败
            })
        } else if (res.cancel) {
          return false
        }
      }
    })

  }),

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