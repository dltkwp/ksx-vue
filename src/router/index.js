import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/login/Login'
import Index from '@/page/index/index'

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
            component: Index
        },
    ]
})