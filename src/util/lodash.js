import lodash from 'lodash'
import Vue from 'vue'
export default {
    install: function(Vue) {
        Object.defineProperty(Vue.prototype, '$lodash', { value: lodash });
    }
}