<template>
  <div id="app">
    <rotate-square5></rotate-square5>
    <router-view/>
  </div>
</template>

<script>
 import {RotateSquare5} from 'vue-loading-spinner'
 export default {
  name: 'App',
  components: {
    RotateSquare5
  }
}
</script>

<style>
  @import "assets/css/bootstrap.min.css";
  @import "assets/font-awesome/css/font-awesome.css";
  @import "assets/css/animate.css";
  @import "assets/css/style.css";
</style>
