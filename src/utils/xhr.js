// 小数转换百分数
export function toPercent(num) {
  const str = Number(num * 100).toFixed(0)
  return str
}

// 发送网络请求
export function load(options) {
  let { url, type, method, success, error, progress, time } = options

  const xhr = new XMLHttpRequest()

  // 初始化网络请求
  xhr.open(method, url, true)

  // 处理请求方式，默认为GET
  method = method ? method.toUpperCase() : 'GET';

  // 设置响应类型
  xhr.responseType = type || 'blob'

  // 设置超时时间
  xhr.timeout = time

  // 设置请求处理回调
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (success && typeof success === 'function') {
          success(xhr.response)
        }
      } else {
        if (error && typeof error === 'function') {
          error(new Error(xhr.statusText))
        }
      }
    }
  }

  // 获取进度
  xhr.onprogress = progress

  return xhr
}