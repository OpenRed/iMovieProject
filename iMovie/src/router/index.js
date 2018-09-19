import Vue from 'vue'
import Router from 'vue-router'

import index from '@/views/pages/index'
import detail from '@/views/pages/detail'

import login from '@/views/admin/login'
import choice1 from '@/views/admin/pages/choice1'
import choice2 from '@/views/admin/pages/choice2'
import choice3 from '@/views/admin/pages/choice3'
import choice4 from '@/views/admin/pages/choice4'
import choice5 from '@/views/admin/pages/choice5'
import choice6 from '@/views/admin/pages/choice6'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // iMovie
    { path: '/', redirect: '/index' },
    { path: '/index', name: 'index', component: index },
    { path: '/detail/:id', name: 'detail', component: detail },

    // admin
    { path: '/login', name: 'login', component: login },
    { path: '/admin', name: 'admin', component: choice1 },
    { path: '/choice1', name: 'choice1', component: choice1 },
    { path: '/choice2', name: 'choice2', component: choice2 },
    { path: '/choice3', name: 'choice3', component: choice3 },
    { path: '/choice4', name: 'choice4', component: choice4 },
    { path: '/choice5', name: 'choice5', component: choice5 },
    { path: '/choice6', name: 'choice6', component: choice6 }
  ]
})
