import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    }, {
      path: '/index',
      name: '首页',
      meta: {
        nologin: true
      },
      component: () => import('@/views/index/index')
    }, {
      path: '/course',
      name: '课程',
      meta: {
        nologin: true
      },
      component: () => import('@/views/index/course/course')
    }, {
      path: '/video',
      name: '课程',
      meta: {
        nologin: true
      },
      component: () => import('@/views/index/video/video')
    }, {
      path: '/news/content',
      name: '新闻',
      meta: {
        nologin: true
      },
      component: () => import('@/views/index/news/content')
    }, {
      path: '/news/list',
      name: '新闻',
      meta: {
        nologin: true
      },
      component: () => import('@/views/index/news/list')
    }, {
      path: '/login',
      name: '登陆',
      meta: {
        nologin: true
      },
      component: () => import('@/views/login/login')
    }, {
      path: '/timetable',
      name: '课程表',
      component: Layout,
      children: [{
        path: '/timetable',
        name: '',
        component: () => import('@/views/timetable/timetable')
      }, {
        name: '课内功能',
        path: '/teacherFunction/index',
        component: () => import('@/views/teacherFunction/functionIndex'),
        children: [
          {
            name: '名单',
            path: '/teacherFunction/rollRecord',
            component: () => import('@/views/teacherFunction/rollRecord/rollRecord')
          }, {
            name: '试卷',
            path: '/teacherFunction/exam',
            component: () => import('@/views/teacherFunction/exam/exam')
          }, {
            name: '投票',
            path: '/teacherFunction/vote',
            component: () => import('@/views/teacherFunction/vote/vote')
          }, {
            name: '作业',
            path: '/teacherFunction/homework',
            component: () => import('@/views/teacherFunction/homework/homework')
          }, {
            name: '回放',
            path: '/teacherFunction/playBack',
            component: () => import('@/views/teacherFunction/playBack/playBack')
          }, {
            name: '投票',
            path: '/teacherFunction/vote',
            component: () => import('@/views/teacherFunction/vote/vote')
          }, {
            name: '课堂提问',
            path: '/teacherFunction/quiz',
            component: () => import('@/views/teacherFunction/quiz/quiz')
          }, {
            name: '学生疑问',
            path: '/teacherFunction/question',
            component: () => import('@/views/teacherFunction/question/question')
          }, {
            name: '加分申请',
            path: '/teacherFunction/addPoint',
            component: () => import('@/views/teacherFunction/addPoint/addPoint')
          }
        ]
      }, {
        name: '课内功能',
        path: '/studentFunction/index',
        component: () => import('@/views/studentFunction/functionIndex'),
        children: [
          {
            name: '测验',
            path: '/studentFunction/exam',
            component: () => import('@/views/studentFunction/exam/exam')
          },{
            name: '作业',
            path: '/studentFunction/work',
            component: () => import('@/views/studentFunction/work/work')
          },{
            name: '投票',
            path: '/studentFunction/vote',
            component: () => import('@/views/studentFunction/vote/vote')
          },{
            name: '点名记录',
            path: '/studentFunction/rollRecord',
            component: () => import('@/views/studentFunction/rollRecord/rollRecord')
          },{
            name: '直播回放',
            path: '/studentFunction/playBack',
            component: () => import('@/views/studentFunction/playBack/playBack')
          },{
            name: '学生提问',
            path: '/studentFunction/question',
            component: () => import('@/views/studentFunction/question/question')
          },{
            name: '教师提问',
            path: '/studentFunction/quiz',
            component: () => import('@/views/studentFunction/quiz/quiz')
          }
        ]
      }]
    }, {
      path: '/storage',
      redirect: '/storage/personspace',
      component: Layout,
      children: [
        {
          name: '文件管理',
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
