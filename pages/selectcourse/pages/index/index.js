// pages/text/index.js
import request from '../../../../utils/request.js'
const app = getApp()
var ajax = new request;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yxkc: [],
    ifchoose:'',//是否为选课状态
    classId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var token_key = wx.getStorageSync('token_key');
    var version = 0;
    var xk = wx.getStorageSync('xk')
    if (xk) {
      version = xk.version;
    }
    let data = {
      token_key: token_key,
      version: version
    }
    wx.showLoading({
      title: '加载中',
    })
    ajax.request('stuXK.yxkc', data)
      .then(function (res) {//成功
        wx.hideLoading()
        var needClass = [];
        var optionalclass = [];
        if(version == res.data.extend.xk.version){
          needClass = wx.getStorageSync('needClass');
          var bxkcNum = res.data.extend.bxkcNum;
          var kxkcNum = res.data.extend.kxkcNum;
          optionalclass = wx.getStorageSync('optionalclass');
          for (var i = 0; i < needClass.length;i++){
            needClass[i].selectNumber = bxkcNum[i];
          }
          for (var i = 0; i < optionalclass.length; i++) {
            optionalclass[i].selectNumber = kxkcNum[i];
          }
        }else{
          needClass = res.data.extend.bxkc;
          optionalclass = res.data.extend.kxkcList;
        }
        //选课信息存入考勤 
        wx.setStorage({ //所有课程信息
          key: "xk",
          data: res.data.extend.xk
        })
        wx.setStorage({ //选修
          key: "optionalclass",
          data: optionalclass
        })
        wx.setStorage({ //必修
          key: "needClass",
          data: needClass
        })
        that.setData({
          yxkc:res.data.extend.yxkc,
          ifchoose: res.data.extend.isDelete,
          classId: res.data.extend.xk.classId
        })
        if (res.data.extend.isDelete == 0){
          that.setData({
            opacity: '0.4',
          })
        }else{
          that.setData({
            opacity: '',
          })
        }
        console.log(that.data.yxkc);
      }, function (res) {//失败
        wx.hideLoading()
    })
  },
  chooseclass:function(){
    var that=this;
    var ifchoose = that.data.ifchoose;
    if (ifchoose==0){//不可选
      wx.showModal({
        title: '提示',
        content: '当前不为选课状态',
        showCancel:false
      })
    }else{
      that.setData({
        opacity: '',
      })
      wx.navigateTo({
        url: '../course/course',
      })
    }
  },
  //退选
  select_class:function(e){
    wx.hideShareMenu();
    var that=this;
    var token_key = wx.getStorageSync('token_key');
    var yxkc=that.data.yxkc;
    var tcId=e.currentTarget.dataset.tcid;
    let data = {
      token_key:token_key,
      tcid:tcId
    }
    wx.showModal({
      content: '确定删除？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          ajax.request('stuXk.del', data)
            .then(function (res) {//成功
              wx.hideLoading()
              that.onLoad();
            }, function (res) {//失败
              wx.hideLoading()
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
   
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