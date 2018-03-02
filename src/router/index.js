import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/login/Login'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
        path: '/v_login',
        name: 'Login',
        component: Login
    }]
})