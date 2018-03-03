<template>
  <div id="app">
    <v-loading :isLoading="isLoading"></v-loading>
    <router-view/>
  </div>
</template>

<script>
 
 import {mapGetters} from 'vuex'
 import * as types from './store/mutation-types'
 import vLoading  from './components/loading/loading.vue'
  import vMenus  from './components/menus/menus.vue'
 import * as components from './components'
 
 export default {
  name: 'App',
  components: {
    vLoading,
    vMenus
  },
  computed: {
    ...mapGetters({
      isLoading: [types.LOADING.IS_LOADING],
    })
  }
}
</script>

<style>
  @import "assets/css/bootstrap.min.css";
  @import "assets/font-awesome/css/font-awesome.css";
  @import "assets/css/animate.css";
  @import "assets/css/style.css";
</style>
