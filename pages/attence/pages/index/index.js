// pages/attence/pages/index/index.js
import request from '../../../../utils/request.js'
const app = getApp()
var ajax = new request;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    nocancel: false,
    number:'',
    result: '1'
  },

  // 弹窗点取消弹窗消失
  cancel: function () {
    this.setData({
      hidden: true
    });
  },
  /**获取输入口令的值 */
  getnumber:function(e){
    var number=e.detail.value
    this.setData({
      number:number
    })
  },

  /**弹窗点击确认后弹窗消失，返回签到结果 */
  confirm: function () {
    var that=this
    var number=(this.data.number).toString()
    var token_key = wx.getStorageSync('token_key');
    let data = {
      word:number,
      token_key: token_key
    }
    ajax.request('stukq.word', data)
      .then(function (res) {//成功
        var msg=res.data.msg
          that.setData({
         hidden: true
    }
    );
          wx.showModal({
          content: msg,
        })

      }, function (res) {//失败
        var msg = res.data.msg
        that.setData({
          hidden: true
        }
        );
        wx.showModal({
          content: msg,
        })

        
      })
  },
  /**点击口令点名弹出输入框 */
  inputNumber: function () {
    this.setData({
      hidden: false
    })
  },
  /*扫二维码 */
  scanCode:function(){
    const that = this
    wx.scanCode({
      // onlyFromCamera: true,
      success: function(res) {
        that.setData({
          result: res.result
        })
        var token_key = wx.getStorageSync('token_key');
        let data = {
          qrcodeNum: that.data.result,
          token_key: token_key
        }
        ajax.request('stukq.qrcode', data)
          .then(function (res) {//成功
              var msg=res.data.msg;
            var msg = res.data.msg;
            wx.showModal({
              content: msg,
            })

          }, function (res) {//失败
            var msg = res.data.msg;
            wx.showModal({
              content: msg,
            })   
          })
      },
      fail: function(res) {},
    })

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