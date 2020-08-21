import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
// const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar

  // set page title
  document.title = getPageTitle(to.meta.title)
  // 测试
  const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  console.log(to.meta.nologin)
  // const test = true
  if (to.meta.nologin) {
    next()
  } else if(!userInfo && to.path !== '/login'){
    router.push('/login').catch(err => err)
  }else{
    next()
  }
  // 正常
  // const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  // console.log('userInfo')
  // console.log(userInfo)
  // // const token = getToken()
  // // 登陆前后路由跳转限制
  // if (!userInfo && to.path !== '/login') {
  //   router.push('/login').catch(err => err)
  // } else {
  //   next()
  // }
})

router.afterEach(() => {
  // finish progress bar
})
