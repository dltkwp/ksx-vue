<template>
    <div class="middle-box text-center loginscreen animated fadeInDown">
        <div>
            <div>
                <h1 class="logo-name">KSX</h1>
            </div>
            <h3>欢迎使用速销平台</h3>
            <form class="m-t" role="form">
                <div class="form-group">
                    <input type="email" class="form-control" placeholder="账号" required="">
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" placeholder="密码" required="">
                </div>
                <button type="submit" class="btn btn-primary block full-width m-b">登录</button>

                <a href="javascript:;;"><small>忘记密码？</small></a>
                <p class="text-muted text-center"><small>还没有账号？</small></p>
                <a class="btn btn-sm btn-white btn-block" href="register.html">注册账号</a>
            </form>
            <p class="m-t"> <small>注册成为分销商，月入过万</small> </p>
        </div>
    </div>
</template>

<script>
   import Vue from 'vue'
   import { mapActions , mapGetters} from 'vuex'
   import * as types from '@/store/mutation-types.js'

   export default {
      data() {
       return {
          
       } 
      },
      methods: {
         ...mapActions([types.LOADING.PUSH_LOADING,types.LOADING.SHIFT_LOADING]),
        signin() { // 登录授权
         
        },
        sms_code() { // 获取短信验证码 
         
        },
        clearTimer() {
          this.smsTxt = "获取验证码"
          this.interval.totalCnt= 60
          this.interval.isActive = false
          this.interval.instance && clearInterval(this.interval.instance)
        },
        startTimer() { // 开启计时器
          this.interval.instance = setInterval(this.updateTimer,1000)
        },
        updateTimer() { // 计时器更新
          this.interval.totalCnt--
          if(this.interval.totalCnt!=0){
              this.smsTxt = this.interval.totalCnt + "s后获取"
          }else{
              this.smsTxt = "重新获取"
              this.interval.totalCnt= 60
              this.interval.isActive = false
              this.interval.instance && clearInterval(this.interval.instance)
          }
        } 
      }
   }
</script>

