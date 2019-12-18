//index.js
//获取应用实例
import request from '../../../../utils/request.js'
const app = getApp()
var ajax = new request;
Page({
  data: {
    clientHeight: "",
    winWidth: 0,
    // tab切换  
    currentTab: 0,
    isOpen:'',
    list: [ 
      
    ],
  },
  /**点击图片展开教室操作项 */
  kindToggle: function (e) {
    const id = parseInt(e.currentTarget.id)
    const list = this.data.list
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
    
  },
  /**对教室进行开关门等操作 */
  optration:function(e){
    var token_key = wx.getStorageSync('token_key');
    console.log(e)
    var roomid = e.currentTarget.dataset.roomid;
    var command = e.currentTarget.dataset.command;
    console.log(roomid)
    console.log(command)
    let data = {
      roomid:roomid,
      command:command,
      token_key: token_key
    }
    ajax.request('zhjs.operateRoom', data)
      .then(function (res) {//成功
      var msg=res.data.msg
      wx.showToast({
        title: msg,
        icon: 'none'
      })
      }, function (res) {//失败
        var msg = res.data.msg
        wx.showToast({
          title: msg,
          icon: 'none'
        })

      })


  },
/**有教室操作权限的人员可对教室操作 */
  isToggle:function(e) {
    if (this.data.isOpen =="smartOpen"){
      this.kindToggle(e);
    }else{
      return false
    }
    
  },
/**点击打开教室开关门、开关设备操作 */
  
  
  onLoad: function (options) {
    wx.hideShareMenu();
    wx.showLoading({
      
      title: '正在加载',
    })
    var that = this
    /**动态改变页面标题 */
    wx.setNavigationBarTitle({
      title: options.title
    })
    var token_key = wx.getStorageSync('token_key');
    let data = {
      point: options.id,
      token_key: token_key
    }
    ajax.request('zhjs.getRoomData', data)
      .then(function (res) {//成功
      wx.hideLoading();
        var isOpen = res.data.extend.SmartQx
        var listItem = res.data.extend.Rooms;
        for (var i = 0; i < listItem.length; i++) {
          var item = JSON.stringify(listItem[i]);
          item = item.substring(0, item.length - 1) + ',"open":false}';
          listItem[i] = JSON.parse(item);
          
        }
        that.setData({
          list: listItem,
          isOpen:isOpen
        })

      }, function (res) {//失败
        wx.hideLoading();

      })

  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /** 阻止手动滑动切换*/

  stopTouchMove: function () {
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
  }
})