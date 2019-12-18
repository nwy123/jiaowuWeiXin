// pages/record/record.js
//获取应用实例
import request from '../../utils/request.js'
const app = getApp()
var ajax = new request;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    times : [],
    tcId:"",
    flag:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that=this
    var token_key = wx.getStorageSync('token_key');
    var tcId = options.tcId
    var thisClassKq = wx.getStorageSync('kq'+tcId);
    wx.showLoading({
      title: '正在加载',
    })
    if (thisClassKq){
      that.setData({
        times: thisClassKq.times,
        tcId: tcId
      })
      wx.hideLoading();
    }else{
      let data = {
        token_key: token_key,
        tcId: tcId
      }
      ajax.request('teakq.rg', data)
        .then(function (res) {//成功
          wx.hideLoading();
          that.setData({
            times: res.data.extend.times,
            tcId: tcId
          })
          //考勤信息存入缓存存入缓存
          wx.setStorage({
            key: "kq" + tcId,
            data: res.data.extend
          })
          
         
          /* setWeidian();*/
        }, function (res) {//失败
          
        
          wx.hideLoading();
        })
    }
    if(this.data.times.length==0){
      this.setData({
        flag:true
      })
      console.log(this.data.flag)

    }
    
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