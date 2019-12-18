// pages/number/number.js
import request from '../../utils/request.js'
const app = getApp()
var ajax = new request;
var timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    number:"",
    tcId:'',
    finish_number:0,
    timeout:''
  },
  /**记录点名人数 */
  setnumber: function (tcId){
    var that = this;   
    var token_key = wx.getStorageSync('token_key');
    let data = {
      token_key: token_key,
      tcId: tcId
    }
    timer = setInterval(function () {//设置定时器
       ajax.request('teakq.dj', data)
         .then(function (res) {//成功 
         var timeout=that.data.timeout-2
          that.setData({
            finish_number:res.data.extend.count,
            timeout: timeout
          })    
           if (that.data.timeout <= 0) {
             that.cancelTap();
           }
           console.log(that.data.timeout)   
         }, function (res) {//失败
         })
    },2000) 
},
  onLoad:function(options){
    wx.hideShareMenu();
    var that = this
    var token_key = wx.getStorageSync('token_key');
    var tcId = options.tcId
    let data = {
      token_key: token_key,
      tcId: tcId
    }
    wx.showLoading({
      title: '正在加载',
    })

    ajax.request('teakq.kl', data)
      .then(function (res) {//成功
        wx.hideLoading();
        var number=res.data.extend.psw
        var timeout=res.data.extend.timeout
        that.setData({
          number:number,
          tcId:tcId,
          timeout:timeout
        })
        console.log(that.data.timeout)
      }, function (res) {//失败
        wx.hideLoading();
      })
    that.setnumber(tcId) 
    
  },
  onUnload:function(){
    clearInterval(timer)

  },
  /**结束签到 */
  cancelTap() {
    var that=this
    var token_key = wx.getStorageSync('token_key');
    var tcId = that.data.tcId;
    var data = {
      token_key: token_key,
      tcId: tcId
    }
    if(that.data.timeout <= 0){
      ajax.request('teakq.klgb', data)
        .then(function (res) {//成功
          wx.hideLoading();
          clearInterval(timer)
          wx.showModal({
            title: '提示',
            content: res.data.extend.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                ajax.request('teakq.rg', data)
                  .then(function (res2) {//成功
                    var resData = res2.data.extend;
                    //考勤信息存入缓存存入缓存
                    wx.setStorage({
                      key: "kq" + tcId,
                      data: resData
                    })
                    wx.hideLoading();
                    wx.redirectTo({
                      url: '../record/record?tcId=' + tcId,
                    })
                  }, function (res2) {//失败
                    wx.showToast({
                      title: res2.data.extend.msg,
                    })
                  })
              }
            }
          })
        }, function (res) {//失败
          wx.showToast({
            title: res.data.extend.msg,
          })
        })
    }else{
      wx.showModal({
        title: '提示',
        content: '确定结束',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            ajax.request('teakq.klgb', data)
              .then(function (res2) {//成功
                clearInterval(timer);
                ajax.request('teakq.rg', data)
                  .then(function (res3) {//成功
                    var resData = res3.data.extend;
                    //考勤信息存入缓存存入缓存
                    wx.setStorage({
                      key: "kq" + tcId,
                      data: resData
                    })
                    wx.hideLoading();
                    wx.redirectTo({
                      url: '../record/record?tcId=' + tcId,
                    })
                  }, function (res3) {//失败
                    wx.showToast({
                      title: res3.data.extend.msg,
                    })
                  })
              }, function (res2) {//失败
                wx.showToast({
                  title: res2.data.extend.msg,
                })
              })
          } else if (res.cancel) {
            return false
          }
        }
        })
    }
  }
})