import moment from 'moment'
import Vue from 'vue'
export default {
    install: function(Vue) {
        Object.defineProperty(Vue.prototype, '$moment', { value: moment });
    }
}