import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/login/login'
import Index from '@/page/index/index'


import User from './user'
import GoodsCategory from './goodsCategory'
import DistributorLevel from './distributor-level'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
            path: '/',
            name: 'Login',
            component: Login
        }, {
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
        },
    ].concat(User).concat(GoodsCategory).concat(DistributorLevel)
})