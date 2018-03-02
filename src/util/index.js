import Vue from 'vue'

import AxiosPlugin from './axios.js';
Vue.use(AxiosPlugin);

import LodashPlugin from './lodash.js';
Vue.use(LodashPlugin);

import MomentPlugin from './moment.js';
Vue.use(MomentPlugin);

import ToastPlugin from '@/components/toast/toast.js'
Vue.use(ToastPlugin);