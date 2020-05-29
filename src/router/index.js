import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/login'
import Course from '@/views/course/course'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    }, {
      path: '/course',
      name: 'Course',
      component: Course
    }
  ]
})
