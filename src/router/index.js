import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
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
            name: '投票',
            path: '/classFunction/vote',
            component: () => import('@/views/classFunction/vote/vote')
          }, {
            name: '课堂提问',
            path: '/classFunction/quiz',
            component: () => import('@/views/classFunction/quiz/quiz')
          }, {
            name: '学生疑问',
            path: '/classFunction/question',
            component: () => import('@/views/classFunction/question/question')
          }, {
            name: '加分申请',
            path: '/classFunction/addPoint',
            component: () => import('@/views/classFunction/addPoint/addPoint')
          }
        ]
      }]
    }, {
      path: '/storage',
      redirect: '/storage/personspace',
      component: Layout,
      children: [
        {
          name: '课内功能',
          path: '/storage/index',
          redirect: '/storage/personspace',
          component: () => import('@/views/storage/storageIndex'),
          children: [
            {
              name: '个人空间',
              path: '/storage/personspace',
              component: () => import('@/views/storage/personspace/personspace')
            },
            {
              name: '公共素材',
              path: '/storage/publicmaterial',
              component: () => import('@/views/storage/publicmaterial/publicmaterial')
            },
            {
              name: '班级素材',
              path: '/storage/classmaterial',
              component: () => import('@/views/storage/classmaterial/classmaterial')
            },
            {
              name: '个人素材',
              path: '/storage/personmaterial',
              component: () => import('@/views/storage/personmaterial/personmaterial')
            }
          ]
        }
      ]
    }
  ]
})
