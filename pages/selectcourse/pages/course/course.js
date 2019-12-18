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
        type_name:"人文社科类",
        blockHeight: 0,
        commCourseType:1
      },
      {
        type: "2",
        type_name: "自然科学与技术类",
        blockHeight: 0,
        commCourseType: 2
      },
      {
        type: "3",
        type_name: "经济管理类",
        blockHeight: 0,
        commCourseType: 3
      },
      {
        type: "4",
        type_name: "艺术类",
        blockHeight: 0,
        commCourseType: 4
      },
      {
        type: "5",
        type_name: "医学保健与体育类",
        blockHeight: 0,
        commCourseType: 5
      },
      {
        type: "6",
        type_name: "职业生涯规划与创业就业类",
        blockHeight: 0,
        commCourseType: 6
      }
    ],
    course_data:[],//所有的选修
    choose_course_data:[],
  },
  initBlockHeight: function(e){
    let that = this;
    var course_type = this.data.course_type;
    var query = wx.createSelectorQuery(); //创建节点选择器
    for (let i = 0; i < course_type.length; i++){
      var tt = 'inToView' + course_type[i].type
      query.select('#' + tt).boundingClientRect()//选择id
      query.exec(function (res) {
        if(i==0){
          let item = "course_type[" + i + "].blockHeight"
          that.setData({
            [item]: res[i].height
          });
        } else{
          let item = "course_type[" + i + "].blockHeight"
          let height = res[i].height + that.data.course_type[i - 1].blockHeight;
          that.setData({
            [item]: height
          });
        }
      })
    }
  
  },

  /**点击确认添加已选课程 */
  queren: function () {
    var that = this;
    var token_key = wx.getStorageSync('token_key');
    var is_choose = that.data.choose_course_data
    if (is_choose.length==1) {
      let data = {
        token_key: token_key,
        tcid: is_choose[0].tcId,
        classtype: is_choose[0].commCourseType,
        //classid: is_choose[0].classId,
      }
      wx.showModal({
        title: '提示',
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
              wx.showToast({
                title: res.data.msg,
                icon:'none',
                duration:3000
                
              })
              console.log(res.data.msg)
                wx.hideLoading()
              })
            
          } else if (res.cancel) {
            console.log('用户点击取消')
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
  add_course:function(e){
    var id=e.currentTarget.id ;
    var course_data=this.data.course_data;//获取所有课程
    var name = course_data[id].course_name;//选择课程的名字
    var type = course_data[id].type;//选择课程的类型
    var time = course_data[id].course_time;//选择课程的时间
    var classId= course_data[id].course_id;//选择课程id
    var tcId = course_data[id].id;//选择课程id
    var course_num=this.data.course_num;//选择课程数
    var choose_course_data=this.data.choose_course_data;//获取选择的课程
    var commCourseType = course_data[id].type
    var state = course_data[id].state;
    console.log(jsonStr)
    if(type==1){
      type='人文社科类'
    }
    if (type == 2) {
      type = '自然科学与技术'
    }
    if (type == 3) {
      type = '经济管理类'
    }
    if (type == 4) {
      type = '艺术类'
    }
    if (type == 5) {
      type = '医学保健与体育类'
    }
    if (type == 6) {
      type = '职业生涯规划与创业就业类'
    }
    var jsonStr = '{"choose_name":"' + name + '","choose_type":"' + type + '","tcId":"' + tcId + '", "choose_time":"' + time + '","classId":"' + classId + '","commCourseType":"' + commCourseType +'"}';
    //状态为0时添加课程
    if (state==0){
      course_num++;
      choose_course_data.push(JSON.parse(jsonStr));//json字符串变为json对象
      var item = "course_data[" + id + "].state";//改变data中的state
        this.setData({
          choose_course_data: choose_course_data,//获取选择的课程
          course_num: course_num,
          [item]:1
        })
    }
     //状态为1时删除课程
    if(state==1){
      var item = "course_data[" + id + "].state";//获取data中的state
      for (var i = 0; i < choose_course_data.length;i++){
        if (choose_course_data[i].tcId == course_data[id].id){
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
  sub_course:function(e){
    var id = e.currentTarget.id;
    var choose_course_data = this.data.choose_course_data;//获取选择的课程
    var course_num=this.data.course_num;
    var course_data=this.data.course_data;
    console.log(id)
    console.log(choose_course_data);
    for (var i = 0; i < course_data.length; i++) {
        var item = "course_data[" + i + "].state";//改变data中的state
        if(course_data[i].id==choose_course_data[id].tcId){
          course_num--;
          choose_course_data.splice(id, 1);
          this.setData({
            choose_course_data: choose_course_data,
            course_num: course_num,
            [item]:0
          })
          break;
        }
      }
  },
  //清除课程栏所有课程
  clear_course:function(){
    var choose_course_data=this.data.choose_course_data;
    var course_data=this.data.course_data;
    var course_num=this.data.course_num;
    for (var i = 0; i < course_data.length;i++){
      let item = "course_data[" + i + "].state";//改变data中的state
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
    var that=this;
    var course_data = that.data.course_data;
    var optionalclass = wx.getStorageSync('optionalclass');//从缓存中取选修课
    for (var i = 0; i < optionalclass.length;i++){
      let id = optionalclass[i].tcId
      let type = optionalclass[i].commCourseType
      let state = 0
      let course_name = optionalclass[i].courseName;
      let course_time = optionalclass[i].arrangeDescript
      let course_xf = optionalclass[i].pointScore
      let course_id = optionalclass[i].courseId
      let course_people = optionalclass[i].selectNumber;
      let course_allpeople = optionalclass[i].studentCnt;
      var jsonstr = '{"id":"' + id + '","type":"' + type + '","state":"' + state + '", "course_name":"' + course_name + '","course_time":"' + course_time + '","course_xf":"' + course_xf + '","course_id":"' + course_id + '","course_people":"' + course_people + '","course_allpeople":"' + course_allpeople +'"}';
      course_data.push(JSON.parse(jsonstr));//json字符串变为json对象
    }
    
    that.setData({
      course_data: course_data
    })
    console.log(that.data.course_data[0])
    wx.hideLoading();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '正在加载',
    })
    this.initBlockHeight();
    wx.hideLoading();
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