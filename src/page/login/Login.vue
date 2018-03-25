<template>
    <div class="middle-box text-center loginscreen animated fadeInDown">
        <div>
            <div>
                <h1 class="logo-name">KSX</h1>
            </div>
            <h3>欢迎使用速销平台</h3>
            <form class="m-t" role="form">
                <div class="form-group">
                    <input v-model="userName" type="text" class="form-control" placeholder="账号">
                </div>
                <div class="form-group">
                    <input v-model="password" type="password" class="form-control" placeholder="密码">
                </div>
                <input @click="signin" type="button" class="btn btn-primary block full-width m-b" value="登录">

                <a href="javascript:;;"><small>忘记密码？</small></a>
                <p class="text-muted text-center" style="display:none;"><small>还没有账号？</small></p>
                <a class="btn btn-sm btn-white btn-block"  style="display:none;" href="register.html">注册账号</a>
                
            </form>
            <p class="m-t"> <small>注册成为分销商，月入过万</small> </p>
        </div>
    </div>
</template>

<script>
   import { mapActions , mapGetters} from 'vuex'
   import * as types from '@/store/mutation-types.js'

   export default {
      data() {
       return {
          userName:'',
          password:''
       } 
      },
      mounted(){
        this.SHIFT_LOADING();
      },
      methods: {
         ...mapActions([types.LOADING.PUSH_LOADING,types.LOADING.SHIFT_LOADING]),
        signin : function (){ 
            var _this = this;
            var userName = _this.userName.trim();
            var password = _this.password.trim();
            if(_this.$lodash.isEmpty(userName)){
                _this.$toast.warning('登陆名称不可为空.');
                return false;
            }
            if(_this.$lodash.isEmpty(password)){
                _this.$toast.warning('密码不可为空.');
                return false;
            }
            _this.PUSH_LOADING();
            _this.$axios.post('login',{
                username:userName,
                password:password
            }).then((result)=> {
                var res = result.data;
                switch (res.code) {
                    case 1000200: {
                        
                        localStorage.setItem('ksx-user-c', ''); //清理user信息,登陆后如果为空则再次查询
                        localStorage.setItem('ksx-token-c', res.token);
                        
                        let isSupplier = _this.$lodash.find(res.roleList,{roleName:'dealer'}) // 供应商 
                        let isDistributor = _this.$lodash.find(res.roleList,{roleName:'dealer'}) //  分销商 
                        if(isSupplier){
                            localStorage.setItem('ksx-user-type',  isDistributor? "all" : 'supplier'); 
                            window.location.href = '/v_supplier_order'
                        }else if(isDistributor){
                            localStorage.setItem('ksx-user-type',  'distributor'); 
                            window.location.href = '/v_distributor_order'
                        }
                    } break;
                    default: {
                        _this.$toast.error(res.msg);
                    }
                }
                _this.SHIFT_LOADING();
            }).catch((err) => {
                _this.SHIFT_LOADING();
            });
        },
      }
   }
</script>

