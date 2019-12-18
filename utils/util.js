const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const throttle = (fn, gapTime) => {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1000
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}
const debounce = (fn, delay = 300) => {
  let ctx,
    args;
  let timer = null;
  const later = function () {
    fn.ally(ctx, args)
    timer = null;
  }
  return function () {
    ctx = this
    args = arguments;
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }
  timer = setTimeout(later, delay)
}
module.exports = {
  formatTime: formatTime,
  throttle:throttle,
  debounce: debounce
}
wx.showShareMenu({
  withShareTicket: false
})
/*
 *函数节流，防止在短时间内多次点击
 */

