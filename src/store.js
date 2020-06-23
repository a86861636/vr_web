import Vue from 'vue'
import Vuex from 'vuex' // 引入 vuex
import axios from 'axios'
import qs from 'qs'
// 发送请求库

Vue.use(Vuex) // 使用 vuex

export default new Vuex.Store({
  state: {
    baseURL: 'http://192.168.1.34:8000/', // 外网服务器//http://www.gbamr.com/
    mediaURL: 'http://192.168.1.34:8000/media/',
    videoURL: 'http://192.168.1.34:8000/video/',
    // baseURL: 'http://192.168.8.246:8002/',//本地服务器http://192.168.8.235:8888
    // mediaURL: 'http://192.168.8.246:8002/media/',
    // videoURL: 'http://192.168.8.246:8002/video/',
    userInfo: JSON.parse(window.localStorage.getItem('userInfo')) || {},
    courseInfo: JSON.parse(window.localStorage.getItem('courseInfo')) || {},
    currentTerm: '', // 课表选中学期
    currentWeek: '' // 课表选中周数
  },
  mutations: {

  },
  actions: {
    // 3种请求方式
    post ({state}, data) { // post请求
      let url = data.url
      let trans = data.trans
      delete data.url
      delete data.trans
      if (trans) { // 转换json对象直接转为(以?和&符连接的形式)
        data = qs.stringify(data)
      }
      console.log(data)
      return new Promise((resolve, reject) => {
        axios({
          url: state.baseURL + url, // 请求地址
          method: 'post', // post或者get
          headers: {// 请求头部
            'Content-Type': 'application/x-www-form-urlencoded',
            'AUTHORIZATION': state.userInfo.token || ''
          },
          data: data
        }).then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    get ({ state }, data) { // get请求
      let url = data.url
      delete data.url
      return new Promise((resolve, reject) => {
        axios({
          url: state.baseURL + url, // 请求地址
          method: 'get', // post或者get
          headers: {// 请求头部
            'AUTHORIZATION': state.userInfo.token || ''
          },
          params: data
        }).then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    uploadFile ({ state }, data) { // 上传文件方法
      let url = data.url
      return new Promise((resolve, reject) => {
        axios.post(state.baseURL + url, data.param, {
          'Content-Type': 'multipart/form-data',
          'AUTHORIZATION': state.userInfo.token || ''
        }).then(res => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  getters: {

  }
})
