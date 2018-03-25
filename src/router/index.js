import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/login/login'
import Index from '@/page/index/index'
import User from './user'

// 分销商的路由设置
import Distributor from './distributor.js'
// 供应商 路由管理
import Supplier from './supplier'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [{
    path: '/v_login',
    name: 'Login',
    component: Login
  },
  {
    path: '/v_index',
    name: 'Index',
    component: Index,
    meta: {
      parentKey: 'Index',
      childrenKey: 'Index'
    }
  }
  ].concat(User).concat(Supplier).concat(Distributor)
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login') {
    let token = localStorage.getItem('ksx-token-c')
    if (!token) {
      localStorage.setItem('ksx-user-c', '')
      window.location.href = '/v_login'
    }
  }
  next()
})

export default router
