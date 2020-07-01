import axios from 'axios'
export default function downloadfile (url) {
  let params = {}
  axios.post(url, params, { responseType: 'blob' })
    .then(res => {
      let content = res.data
      let blob = new Blob([content])
      let fileName = url
      if ('download' in document.createElement('a')) {
        // 非IE下载
        let elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    })
    .catch(err => {
      console.log(err)
    })
}
