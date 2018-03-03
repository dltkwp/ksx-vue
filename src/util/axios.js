import axios from 'axios'
import Vue from 'vue'
export default {
    install: function(Vue) {
        axios.defaults.timeout = 5000; //响应时间
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头
        axios.defaults.baseURL = 'http://39.106.65.215:8081/EasyTime/'; //配置接口地址
        //POST传参序列化(添加请求拦截器)
        // axios.interceptors.request.use((config) => {
        //     console.log(config);
        //     //在发送请求之前做某件事
        //     if (config.method === 'post') {
        //         config.data = qs.stringify(config.data);
        //     }
        //     return config;
        // }, (error) => {
        //     return Promise.reject(error);
        // });
        // //返回状态判断(添加响应拦截器)
        // axios.interceptors.response.use((res) => {
        //     //对响应数据做些事
        //     if (!res.data.success) {
        //         return Promise.reject(res);
        //     }
        //     return res;
        // }, (error) => {
        //     return Promise.reject(error);
        // });
        Object.defineProperty(Vue.prototype, '$axios', { value: axios });
    }
}