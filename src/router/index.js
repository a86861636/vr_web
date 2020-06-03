import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登陆',
      component: () => import('@/views/login/login')
    }, {
      path: '/course',
      name: '课程表',
      component: Layout,
      children: [{
        path: '/course',
        name: '',
        component: () => import('@/views/course/course')
      }, {
        name: '课内功能',
        path: '/classFunction/index',
        component: () => import('@/views/classFunction/functionIndex'),
        children: [
          {
            name: '名单',
            path: '/classFunction/rollRecord',
            component: () => import('@/views/classFunction/rollRecord/rollRecord')
          }, {
            name: '试卷',
            path: '/classFunction/examList',
            component: () => import('@/views/classFunction/exam/examList')
          }
        ]
      }]
    }
  ]
})
