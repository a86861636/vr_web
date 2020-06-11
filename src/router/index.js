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
            path: '/classFunction/exam',
            component: () => import('@/views/classFunction/exam/exam')
          }, {
            name: '投票',
            path: '/classFunction/vote',
            component: () => import('@/views/classFunction/vote/vote')
          }, {
            name: '作业',
            path: '/classFunction/homework',
            component: () => import('@/views/classFunction/homework/homework')
          }, {
            name: '回放',
            path: '/classFunction/playBack',
            component: () => import('@/views/classFunction/playBack/playBack')
          }, {
            name: '批改',
            path: '/classFunction/exam/check',
            component: () => import('@/views/classFunction/exam/check')
          }, {
            name: '投票',
            path: '/classFunction/vote',
            component: () => import('@/views/classFunction/vote/vote')
          }, {
            name: '学生问答',
            path: '/classFunction/question',
            component: () => import('@/views/classFunction/question/question')
          }
        ]
      }, {
        path: '/storage',
        name: '课程表',
        component: () => import('@/views/storage/storageIndex')
      }]
    }
  ]
})
