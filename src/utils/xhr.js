// 小数转换百分数
export function toPercent(num) {
  const str = Number(num * 100).toFixed(0)
  return str
}

// 发送网络请求
export function load(src) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', src, true)
  xhr.responseType = 'blob'
  return xhr
}