<template>
  <div id="wrapper">
      <v-menus></v-menus>
      <div id="page-wrapper" class="gray-bg" style="min-height: 394px;">
        <v-top></v-top>
        <div class="wrapper wrapper-content animated fadeInRight">
          <div class="row">
            <div class="col-lg-12">
              <div class="tabs-container">
                <ul class="nav nav-tabs">
                  <li v-bind:class="{active:tabType==='baseInfo'}" @click="tabChange('baseInfo')"><a  href="javascript:;;"> 基础信息</a></li>
                  <li v-bind:class="{active:tabType==='passwordUpdate'}" @click="tabChange('passwordUpdate')"><a  href="javascript:;;"> 修改密码</a></li>
                </ul>
                <div class="tab-content">
                  <div  v-bind:class="{active:tabType==='baseInfo'}" class="tab-pane ">
                    <div class="panel-body">
                      <form method="get" class="form-horizontal">
                        <div class="form-group">
                          <label class="col-sm-2 control-label">姓名*</label>
                          <div class="col-sm-10">
                            <input v-model="baseInfo.realname" type="text" class="form-control" placeholder="请输入姓名" maxlength="15">
                          </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">手机号*</label>
                          <div class="col-sm-10">
                            <input  v-model="baseInfo.phone"  type="text" class="form-control" placeholder="请输入手机号" maxlength="11">
                          </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">微信</label>
                          <div class="col-sm-10">
                            <input v-model="baseInfo.wechart" type="text" class="form-control" placeholder="输入微信后方便供应商与分销商之间转账（非必填）"  maxlength="20">
                          </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">支付宝</label>
                          <div class="col-sm-10">
                            <input v-model="baseInfo.alipay" type="text" class="form-control" placeholder="输入支付宝后方便供应商与分销商之间转账（非必填）"  maxlength="20">
                          </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                          <div class="col-sm-4 col-sm-offset-2">
                            <button @click="updateBaseInfo()" class="btn btn-primary" type="button">保存修改</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div  v-bind:class="{active:tabType==='passwordUpdate'}" class="tab-pane">
                    <div class="panel-body">
                      <form method="get" class="form-horizontal">
                        <div class="form-group">
                          <label class="col-sm-2 control-label">原密码*</label>
                          <div class="col-sm-10">
                            <input v-model="password.oldPassword" type="password" class="form-control" placeholder="原密码" maxlength="20">
                          </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">新密码*</label>
                          <div class="col-sm-10">
                            <input  v-model="password.newPassword"  type="password" class="form-control" placeholder="新密码"  maxlength="20">
                          </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">再次输入*</label>
                          <div class="col-sm-10">
                            <input  v-model="password.relNewPassword"  type="password" class="form-control" placeholder="再次输入"  maxlength="20">
                          </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                          <div class="col-sm-4 col-sm-offset-2">
                              <button class="btn btn-primary" type="button" @click="updatePassword()">保存修改</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import * as types from "@/store/mutation-types.js";

import vMenus from "@/components/menus/menus.vue";
import vTop from "@/components/top/top.vue";
import vFoot from "@/components/foot/foot.vue";

export default {
  components: {
    vMenus,
    vTop,
    vFoot
  },
  data() {
    return {
      tabType: "baseInfo", // baseInfo 基本信息  passwordUpdate 修改密码
      baseInfo: {
        realname: "",
        phone: "",
        wechart: "",
        alipay: ""
      },
      password: {
        oldPassword: "",
        newPassword: "",
        relNewPassword: ""
      }
    };
  },
  mounted() {
    let _this = this;
    let userInfo = localStorage.getItem("ksx-user-c");
    if (!_this.$lodash.isEmpty(userInfo)) {
      let u = JSON.parse(userInfo);
      _this.baseInfo.realname = u.realname;
      _this.baseInfo.phone = u.phone;
      _this.baseInfo.wechart = u.wechart;
      _this.baseInfo.alipay = u.alipay;
    }
  },
  methods: {
    ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
    tabChange(key) {
      this.tabType = key;
      switch (key) {
        case "baseInfo":
          {
          }
          break;
        case "passwordUpdate":
          {
            this.password.oldPassword = "";
            this.password.newPassword = "";
            this.password.relNewPassword = "";
          }
          break;
      }
    },
    updateBaseInfo() {
      let _this = this;
      let realname = _this.baseInfo.realname.trim();
      let phone = _this.baseInfo.phone.trim();
      let wechart = _this.baseInfo.wechart.trim();
      let alipay = _this.baseInfo.alipay.trim();
      if (_this.$lodash.isEmpty(realname)) {
        _this.$toast.warning("姓名不可为空");
        return false;
      }
      if (_this.$lodash.isEmpty(phone)) {
        _this.$toast.warning("手机号不可为空");
        return false;
      }
      if(!mobileValidate(phone)){
        _this.$toast.warning("手机号格式不正确");
        return false;
      }
      _this.PUSH_LOADING();
      _this.$axios
        .post("user", {
          'alipay': alipay,
          'phone': phone,
          'realname': realname,
          'wechart': wechart
        })
        .then(result => {
          let res = result.data;
          switch (res.code) {
            case 200:
              {
                _this.$toast.success("操作成功");
                let userInfo = localStorage.getItem("ksx-user-c");
                if (!_this.$lodash.isEmpty(userInfo)) {
                  let u = JSON.parse(userInfo);
                  u.realname = realname;
                  u.phone = phone;
                  u.wechart = wechart;
                  u.alipay = alipay;
                  localStorage.setItem("ksx-user-c",JSON.stringify(u))
                }
              }
              break;
            default: {
              _this.$toast.error(res.msg);
            }
          }
          _this.SHIFT_LOADING();
        })
        .catch(err => {
          _this.SHIFT_LOADING();
        });
    },
    updatePassword() {
      let _this = this;
      let oldPassword = _this.password.oldPassword.trim();
      let newPassword = _this.password.newPassword.trim();
      let relNewPassword = _this.password.relNewPassword.trim();

      if (_this.$lodash.isEmpty(oldPassword)) {
        _this.$toast.warning("原密码不可为空");
        return false;
      }
      if (_this.$lodash.isEmpty(newPassword)) {
        _this.$toast.warning("新密码不可为空");
        return false;
      }
      if (_this.$lodash.isEmpty(relNewPassword)) {
        _this.$toast.warning("再次输入密码不可为空");
        return false;
      }
      if (relNewPassword !== newPassword) {
        _this.$toast.warning("新密码和再次输入密码不一致");
        return false;
      }
      _this.PUSH_LOADING();
      _this.$axios
        .post("updatePassword", {
          oldPassword: oldPassword,
          newPassword1: newPassword,
          newPassword2: relNewPassword
        })
        .then(result => {
          let res = result.data;
          switch (res.code) {
            case 200:
              {
                _this.$toast.success("操作成功");
                setTimeout(function() {
                  localStorage.setItem("ksx-token-c", "");
                  window.location.href = "/v_login";
                }, 1000);
              }
              break;
            default: {
              _this.$toast.error(res.msg);
            }
          }
          _this.SHIFT_LOADING();
        })
        .catch(err => {
          _this.SHIFT_LOADING();
        });
    }
  }
};
</script>