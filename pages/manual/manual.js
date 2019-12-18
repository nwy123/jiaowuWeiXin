//index.js
//获取应用实例
import request from '../../utils/request.js'
const app = getApp()
var ajax = new request;
Page({
  data: {
    clientHeight: "",
    winWidth: 0,
    winHeight: '',
    // tab切换  
    currentTab: 0,
    selectIndex: -1,
    active: 'active',
    tcId:'',
    stuList: [
      
    ],
    weidianList:[

    ],
    operation:"",
    fid:0,
    classNote: 'item-',                    //循环节点前缀
    count: 0                            //总共加载到多少张
  },
  
/*点击改变样式*/
  bg_change: function (e) {
    let itemId = e.currentTarget.dataset.itemid;
    let state = e.currentTarget.dataset.state;
    var stuList = this.data.stuList;
    for(var i=0;i<stuList.length;i++){
      if (stuList[i].stuID == itemId){
        var item = "stuList[" + i +"].state";
        stuList[i].state = state;
        //var item = -1;
        this.setData({
          [item]: state,
        });
      }
    }
  },
  /**未点学生签到 点击改变状态*/
  bg_change1: function (e) {
    let itemId = e.currentTarget.dataset.itemid;
   var stuList=this.data.stuList;
    let state = e.currentTarget.dataset.state;
    var weidianList = this.data.weidianList;
    for (var i = 0; i < weidianList.length; i++) {
      if (weidianList[i].stuID == itemId) {
        var item = "weidianList[" + i + "].state";
        this.setData({
          [item]: state,
        });
      }
    }
    for (var j = 0; j < stuList.length; j++) {
      if (stuList[j].stuID == itemId) {
        var stustate = "stuList[" + j + "].state";
        this.setData({
          [stustate]: state
        })
      }
    }

  },

  /**未点学生签到 */
  changeState1: function (e) {
    let itemId = e.currentTarget.dataset.itemid;
    var stuList = this.data.stuList;
    var weidianList = this.data.weidianList;
    for (var i = 0; i < weidianList.length; i++) {
      if (weidianList[i].stuID == itemId) {
        var item = "weidianList[" + i + "].state";
        this.setData({
          [item]: 100
        });
      }
    }
    for (var j = 0; j < stuList.length; j++) {
      if (stuList[j].stuID == itemId) {
        var stustate = "stuList[" + j + "].state";
        this.setData({
          [stustate]: 100
        })
      }
    }
  },
  /*所有学生点击改变状态*/
  changeState:function(e){
    let itemId = e.currentTarget.dataset.itemid;
    var stuList = this.data.stuList;
    for (var i = 0; i < stuList.length; i++) {
      if (stuList[i].stuID == itemId) {
        var item = "stuList[" + i + "].state";
        this.setData({
          [item]: 100
        });
      }
    }

  },
  // 点击保存
  submit:function(){
    this.setWeidian();
    var that = this;
    var stuList=this.data.stuList
    var weidianList = this.data.weidianList
    var operation = this.data.operation
    var fid = this.data.fid;
    var isAll = false;
    for (var i = 0; i < stuList.length; i++) {
      if(stuList[i].state == 0){
        isAll = true;
        break;
      }
    }
    if(isAll == true){
      wx.showModal({
        title: '提示',
        content: '您还有未点名学生',
        showCancel:false,
        success(res) {
          if (res.confirm) {
            that.setData({
              currentTab:1
            });
            wx.showLoading({
              title: '正在加载',
            })
            setTimeout(function () {
              wx.hideLoading()
            }, 6000)
          } 
        }
      })
    }else{
      var token_key = wx.getStorageSync('token_key');
      var tcId =this.data.tcId
      var stuID = [];
      var state = [];
      for (var i = 0; i < stuList.length; i++) {
        stuID.push(stuList[i].stuID);
        state.push(stuList[i].state);
      }
      let data1 = {
        token_key: token_key,
        tcId:tcId,
        state:state,
        stuID:stuID,
        operation:operation,
        fid:fid
      }
      wx.showLoading({
        title: '正在加载',
      })
       ajax.request('teakq.dm', data1)
        .then(function (res1) {//成功
          wx.hideLoading();
          let data2 = {
            token_key: token_key,
            tcId: tcId
          }
          wx.showLoading({
            title: '正在加载',
          })
          ajax.request('teakq.rg', data2)
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
              wx.hideLoading();
            })
      }, function (res1) {//失败
        wx.hideLoading();
      })

    }
  },
  onLoad: function (options) {
     wx.hideShareMenu();
     console.log('加载执行')
      wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 4000)
    
    var that=this
    var token_key = wx.getStorageSync('token_key');
    var tcId = options.tcId;
    var thisClassKq = wx.getStorageSync('kq' + tcId);
    if (thisClassKq) {
      this.timeToRec(options, thisClassKq);
    }else{
      let data = {
        token_key: token_key,
        tcId: tcId
      }
      ajax.request('teakq.rg', data)
        .then(function (res) {//成功
          var resData = res.data.extend;
          that.timeToRec(options, resData);
          //考勤信息存入缓存存入缓存
          wx.setStorage({
            key: "kq" + tcId,
            data: resData
          })
          wx.hideLoading();
        }, function (res) {//失败
          wx.hideLoading();
        })
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.screenHeight
        });
      }
    });
    
  },
  // 考勤时间对应考勤记录
  timeToRec: function (options, res){
    var that = this;
    var records = res.records;
    var times = res.times;
    var fid = 0;
    if (options.operation == "old") {
      fid = options.timeId
      var index = -1;
      for (var i = 0; i < times.length; i++) {
        if (times[i].id == options.timeId) {
          index = i;
        }
      }
      for (var i = 0; i < records.length; i++) {
        records[i].state = records[i].rec[index];
      }
    }
    
    that.setData({
      stuList: records,
      operation: options.operation,
      tcId: options.tcId,
      fid: fid
    })
    
    console.log(records);
  },
  
  /** 阻止手动滑动切换*/

  stopTouchMove:function(){
    return false
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**点击头部tab未点查看未点学生 */
  swichNav1: function (e) {
    wx.showLoading({
      title: '正在加载',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 4000)
    var that = this;
    var stuList = this.data.stuList;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: 1
      })
      this.setWeidian();
      this.showImg1();
    }
   
  },
  setWeidian:function(){
    var that = this;
    this.setData({
      weidianList: []//先将未点学生清空
    })
    var stuList = this.data.stuList;
    var weidianList = this.data.weidianList
     /**将所有学生中state=-1的加入未点学生中 */
    for(var i=0;i<stuList.length;i++){
      if(stuList[i].state==0){
        var stuID=stuList[i].stuID
        var address = stuList[i].address
        var name=stuList[i].name
        var number=stuList[i].number
        var record=stuList[i].rec
        // var isShow = stuList[i].isShow
        var newList=
          {
            stuID:stuID,
            address:address,
            name:name,
            number:number,
            rec:record,
            state:0,
            isShow:false
          }
        weidianList.push(newList);
      }
    }
    that.setData({
      weidianList: weidianList
    })
    console.log(this.data.weidianList)
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

  },

})
