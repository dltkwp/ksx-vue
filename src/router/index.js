import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/login/login'
import Index from '@/page/index/index'


import User from './user'
import GoodsCategory from './goods-category'
import DistributorLevel from './distributor-level'
import Goods from './distributor-goods'

Vue.use(Router)

let router = new Router({
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
    ].concat(User).concat(GoodsCategory).concat(DistributorLevel).concat(Goods)
});


router.beforeEach((to, from, next) => {
    if (to.name !== 'Login') {
        let token = localStorage.getItem('ksx-token-c');
        if (!token) {
            localStorage.setItem('ksx-user-c', '');
            window.location.href = '/v_login';
        }
    }
    next();
})

export default router