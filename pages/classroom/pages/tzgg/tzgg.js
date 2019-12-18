// pages/classroom/pages/tzgg/tzgg.js
import request from '../../../../utils/request.js'
const app = getApp()
var ajax = new request;
Page({

  /**
   * 页面的初始数据
   */
  data: {
   url:[],
   path:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    // var that = this
    // /**动态改变页面标题 */
    // var token_key = wx.getStorageSync('token_key');
    // let data = {
    //   point: options.id,
    //   token_key: token_key
    // }
    // ajax.request('zhjs.getNotice', data)
    //   .then(function (res) {//成功
    //     var path = res.data.extend.Notices.path
    //       for(var i=0;i<3;i++){
    //        var url1 = res.data.extend.Notices.images[i].diskName
    //         var url2='{"url":"'+url1+'"}'
    //         var url3=that.data.url
    //         url3.push(JSON.parse(url2))
    //         that.setData({
    //           url: url3,
    //           path:path
    //         })
    //       }
          
    //       console.log(that.data.url)
    //   }, function (res) {//失败

    //   })
    


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