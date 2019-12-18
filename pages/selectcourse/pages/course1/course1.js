import request from '../../../../utils/request.js'
const app = getApp()
var ajax = new request;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    display:"none",
    course_num:"0",//已经选择的课程数
    toView: 'inToView01',
    state: '',
    course_type: [
      {
        type:"1",
        type_name:"体育课",
        blockHeight: 0
      } 
      ],
      course_data:[
      ],
    choose_course_data:[],
  },
  /**点击确认按钮添加已选课程 */
  queren: function () {
    var that = this;
    var token_key = wx.getStorageSync('token_key');
    var is_choose = that.data.choose_course_data
    if (is_choose.length == 1) {
      let data = {
        token_key: token_key,
        classtype: 0,
        tcid: is_choose[0].tcId,
       // classid: is_choose[0].classId
      }
      wx.showModal({
        content: '确定选课',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '加载中',
            })
            ajax.request('stuXk.add', data)
              .then(function (res) {//成功
                wx.hideLoading()
                wx.redirectTo({
                  url: '../index/index',
                })
              }, function (res) {//失败
                wx.hideLoading()
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false,
                  success(res) {
                  }
                })
              })
          } else if (res.cancel) { 
          }
        }
      })
    } else {
      wx.showToast({
        title: '必须选择且只能选择一门课程',
        duration: 4000,
        icon: 'none'
      })
    }

  },
  //点击导航瞄点跳转
  scrollToViewFn: function (e) {

    var _id = e.currentTarget.id;
    var num = e.currentTarget.dataset.index;
    this.setData({
      toView: 'inToView' + _id,
      state: num
    })
    console.log(this.data.num);
    console.log(this.data.toView)

  }, 
  //打开隐藏层
  open_hide:function(){
    var display=this.data.display;
    if(display=="none"){
      this.setData({
        display:"block"
      })
    }else{
      this.setData({
        display:"none"
      })
    }
  },
  //关闭隐藏层
  close_hide:function(){
    var display = this.data.display;
    if (display == "none") {
      this.setData({
        display: "block"
      })
    } else {
      this.setData({
        display: "none"
      })
    }
  },

  //每节课程添加到课程栏
  add_course: function (e) {
    var id = e.currentTarget.id;
    var course_data = this.data.course_data;//获取所有课程
    var name = course_data[id].course_name;//选择课程的名字
    var type = course_data[id].course_type;//选择课程的类型
    var time = course_data[id].course_time;//选择课程的时间
    var classId = course_data[id].courseId;//选择课程id
    var tcId = course_data[id].id;//选择课程id
    let classAlias = course_data[id].classAlias;
    var course_num = this.data.course_num;//选择课程数
    var choose_course_data = this.data.choose_course_data;//获取选择的课程
    var jsonStr = '{"choose_name":"' + name + '","choose_type":"' + type + '","tcId":"' + tcId + '", "choose_time":"' + time + '","classId":"' + classId + '","classAlias":"' + classAlias + '"}';

    var state = course_data[id].state;
    //状态为0时添加课程
    if (state == 0) {
      course_num++;
      choose_course_data.push(JSON.parse(jsonStr));//json字符串变为json对象
      var item = "course_data[" + id + "].state";//改变data中的state
      this.setData({
        choose_course_data: choose_course_data,//获取选择的课程
        course_num: course_num,
        [item]: 1
      })
    }
    //状态为1时删除课程
    if (state == 1) {
      var item = "course_data[" + id + "].state";//获取data中的state
      for (var i = 0; i < choose_course_data.length; i++) {
        if (choose_course_data[i].tcId == course_data[id].id) {
          course_num--;
          choose_course_data.splice(i, 1)
          this.setData({
            choose_course_data: choose_course_data,//获取选择的课程
            course_num: course_num,
            [item]: 0
          })
        }
      }

    }
    console.log(this.data.choose_course_data)
  },
  //每节课程从课程栏中删除
  sub_course: function (e) {
    var id = e.currentTarget.id;
    var choose_course_data = this.data.choose_course_data;//获取选择的课程
    var course_num = this.data.course_num;
    var course_data = this.data.course_data;
    console.log(id)
    console.log(choose_course_data);
    for (var i = 0; i < course_data.length; i++) {
      var item = "course_data[" + i + "].state";//改变data中的state
      if (course_data[i].id == choose_course_data[id].tcId) {
        course_num--;
        choose_course_data.splice(id, 1);
        this.setData({
          choose_course_data: choose_course_data,
          course_num: course_num,
          [item]: 0
        })
        break;
      }
    }
  },
  //清除课程栏所有课程
  clear_course:function(){
    var choose_course_data=this.data.choose_course_data;
    var course_data = this.data.course_data;
    var course_num=this.data.course_num;
    for (var i = 0; i < course_data.length;i++){
      var item = "course_data[" +i + "].state";//改变data中的state
      this.setData({
        choose_course_data: [],
        course_num: 0,
        [item]:0
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    wx.showLoading({
      title: '正在加载',
    })
    var that = this;
    var course_data = that.data.course_data
    var needclass = wx.getStorageSync('needClass');//从缓存中取选修课
    for (var i = 0; i < needclass.length; i++) {
      let id = needclass[i].tcId
      let courseId = needclass[i].courseId
      let type = needclass[i].commCourseType
      let state = 0
      let course_name = needclass[i].courseName;
      let course_time = needclass[i].arrangeDescript
      let course_xf = needclass[i].pointScore
      let teacherName = needclass[i].teacherName
      let course_people = needclass[i].selectNumber;
      let course_allpeople = needclass[i].studentCnt;
      let classAlias = needclass[i].classAlias;
      var jsonstr = '{"id":"' + id + '","type":"' + type + '","state":"' + state + '", "course_name":"' + course_name + '","course_time":"' + course_time + '","course_xf":"' + course_xf + '","teacherName":"' + teacherName + '","course_people":"' + course_people + '","course_allpeople":"' + course_allpeople + '","classAlias":"' + classAlias + '","courseId":"' + courseId +'"}';
      course_data.push(JSON.parse(jsonstr));//json字符串变为json对象
    }
    that.setData({
      course_data: course_data
    })
    console.log(that.data.course_data)
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  //  this.initBlockHeight();
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