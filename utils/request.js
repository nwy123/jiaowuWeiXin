/**
 * name: request.js
 * description: wx.request 简单封装
 * author: nwy
 * date: 2019-5-18
 */
const app = getApp()

class request {
  // 构造函数
  constructor() {
    this._header = {}
  }

  /**
   * 设置统一的异常处理
   */
  setErrorHandler(handler) {
    this._errorHandler = handler;
  }

  /**
   * 网络请求
   */
  request(url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.data.url + url,
        data: data,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res => {
          console.log(res)
          if (res.data.code == 200) {
            resolve(res)
          } else {
            if (res.data.code == 401){//身份过期，调用二次登录模块
              wx.redirectTo({
                url: '/pages/error/error?msg=' + res.data.msg,
              })
            } else{
              reject(res)
            }
          }
        }),
        fail: (res => {
          reject(res)
        })
      })
    })
  }
}
export default request