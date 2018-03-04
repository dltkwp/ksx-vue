<template>
  <div id="wrapper">
      <v-menus></v-menus>
      <div id="page-wrapper" class="gray-bg" style="min-height: 394px;">
        <v-top></v-top>
        <div class="wrapper wrapper-content animated fadeInRight">
          <div class="row">
            <div class="col-lg-12">
              <div class="ibox float-e-margins">
              <div class="ibox-title">分销等级设置</div>
                <div class="ibox-content">
                  <div class="row">
                    <div class="col-sm-9 m-b-xs">
                      <div class="btn btn-primary btn-sm" @click="showSaveModal()">新增分销等级</div>
                    </div>
                  </div>
                  <div class="table-responsive">
                    <table class="table table-striped">
                      <thead>
                          <tr>
                            <th>#</th>
                            <th>等级</th>
                            <th>默认折扣</th>
                            <th>加盟费</th>
                            <th>操作</th>
                          </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item,index) in list">
                          <td>{{index + 1}}</td>
                          <td>{{item.levelName}}</td>
                          <td>{{item.discount}}折</td>
                          <td>￥{{item.initialFee}}</td>
                          <td>
                            <div @click="showEditModal(index)" class="btn btn-sm btn-default m-r-xs">编辑</div>
                            <div @click="showConfirmModal(index)" class="btn btn-sm btn-default">删除</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="add" class="modal fade" aria-hidden="true" style="display: none;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title">新增分类</h4>
              </div>
              <div class="modal-body">
                  <div class="row">
                    <div class="col-sm-12">
                      <form role="form">
                        <div class="form-group">
                          <label>等级*</label>
                          <input v-model="save.levelName" type="text" placeholder="请输入分销等级" class="form-control" maxlength="20">
                        </div>
                        <div class="form-group">
                          <label>默认折扣*</label>
                          <input v-model="save.discount"  type="text" placeholder="请输入默认折扣（5.0为打5折，10为不打折）" class="form-control"  maxlength="5">
                          <div class="help-block">设置默认折扣后，商品将自动根据分销商计算出分销价格，可手动修改</div>
                        </div>
                        <div class="form-group">
                          <label>加盟费</label>
                          <input v-model="save.initialFee"  type="text" placeholder="请输入加盟费" class="form-control"  maxlength="5">
                          <div class="help-block">成为分销商，如需加盟费可填写，后续将于小程序端进行显示</div>
                        </div>
                      </form>
                    </div>
                  </div>
              </div>
              <div class="modal-footer">
                <button v-bind:disabled="loading" v-bind:readonly="loading" @click="saveData()" type="button" class="btn btn-primary">保存</button>
                <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
              </div>
            </div>
          </div>
        </div>
        <div id="edit" class="modal fade" aria-hidden="true" style="display: none;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title">编辑分类</h4>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-sm-12">
                    <form role="form">
                      <div class="form-group">
                        <label>等级*</label>
                        <input v-model="edit.levelName" type="text" placeholder="请输入分销等级" class="form-control" maxlength="20">
                      </div>
                      <div class="form-group">
                        <label>默认折扣*</label>
                        <input v-model="edit.discount"  type="text" placeholder="请输入默认折扣（5.0为打5折，10为不打折）" class="form-control"  maxlength="5">
                        <div class="help-block">设置默认折扣后，商品将自动根据分销商计算出分销价格，可手动修改</div>
                      </div>
                      <div class="form-group">
                        <label>加盟费</label>
                        <input v-model="edit.initialFee"  type="text" placeholder="请输入加盟费" class="form-control"  maxlength="5">
                        <div class="help-block">成为分销商，如需加盟费可填写，后续将于小程序端进行显示</div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button v-bind:disabled="loading" v-bind:readonly="loading" @click="updateData()" type="button" class="btn btn-primary">保存</button>
                <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
              </div>
            </div>
          </div>
        </div>
        <div id="divConfirmModal" class="modal fade" aria-hidden="true" style="display: none;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title">温馨提示</h4>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-sm-12">
                    <form role="form">
                      <div class="form-group">
                          确定是否删除该分类?
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button v-bind:disabled="loading" v-bind:readonly="loading" @click="confirm()" type="button" class="btn btn-primary">确定</button>
                <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-foot></v-foot>
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
        loading: false,
        index:-1,
        list: [],
        save: {
          levelName: "",
          discount:"",
          initialFee:""
        },
        edit: {
          levelName: "",
          discount:"",
          initialFee:"",
          id: 0
        }
      };
    },
    mounted() {
      this.save.levelName = "";
      this.save.discount = "";
      this.save.initialFee = "";

      this.edit.levelName = "";
      this.edit.discount = "";
      this.edit.initialFee = "";
      this.edit.id = 0;

      this.listData();
    },
    methods: {
      ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
      showSaveModal() {
        this.save.levelName = "";
        this.save.discount = "";
        this.save.initialFee = "";
        $("#add").modal("show");
      },
      showEditModal(index) {
        let cur = this.list[index];

        this.edit.levelName = cur.levelName;
        this.edit.discount = cur.discount;
        this.edit.initialFee = cur.initialFee;
        this.edit.id = cur.id;

        $("#edit").modal("show");
      },
      showConfirmModal(index){
        this.index = index;
        $("#divConfirmModal").modal("show");
      },
      confirm(){
        let _this = this;
        let cur = _this.list[_this.index];
        let id = cur.id;
        _this.loading = true;
        _this.$axios
          .delete("distributorLevel/" + id)
          .then(result => {
            let res = result.data;
            switch (res.code) {
              case 200:
                {
                  _this.$toast.success("操作成功");
                  _this.listData();
                  $("#divConfirmModal").modal("hide");
                }
                break;
              default: {
                _this.$toast.error(res.msg);
              }
            }
            _this.SHIFT_LOADING();
            _this.loading = false;
          })
          .catch(err => {
            _this.loading = false;
            _this.SHIFT_LOADING();
          });
      },
      discountCheck(discount) {
        let res = true;
        if (!/^(\d+\.\d{1,1}|\d+)$/.test(discount)) {
          this.$toast.warning('请输入1-10的数,可以保留1位小数');
          res = false;
        }
        if (parseInt(discount, 10) > 10) {
          this.$toast.warning('折扣不可大于10');
          res = false;
        }
        return res;
      },
      saveData() {
        let _this = this;
        let levelName = _this.save.levelName.trim();
        let discount = _this.save.discount.trim();
        let initialFee = _this.save.initialFee.trim();
        let pricePattern = /^\d+(.\d{1,2})?$/;

        if (_this.$lodash.isEmpty(levelName)) {
          _this.$toast.warning("等级名称不可为空");
          return false;
        }
        if (!_this.discountCheck(discount)) {
          return false;
        }
        if (initialFee&&!pricePattern.test(initialFee)) {
          _this.$toast.warning("加盟费格式不正确");
          return false;
        }
        _this.loading = true;
        _this.$axios
          .post("distributorLevels", {
             levelName: levelName,
             discount: discount,
             initialFee: initialFee
          })
          .then(result => {
            let res = result.data;
            switch (res.code) {
              case 200:
                {
                  _this.$toast.success("操作成功");
                  _this.listData();
                  $("#add").modal("hide");
                }
                break;
              default: {
                _this.$toast.error(res.msg);
              }
            }
            _this.loading = false;
            _this.SHIFT_LOADING();
          })
          .catch(err => {
            _this.loading = false;
            _this.SHIFT_LOADING();
          });
      },
      updateData() {
        let _this = this;
        let levelName = _this.edit.levelName.trim();
        let discount = _this.edit.discount;
        let initialFee = _this.edit.initialFee;
        let pricePattern = /^\d+(.\d{1,2})?$/;

        if (_this.$lodash.isEmpty(levelName)) {
          _this.$toast.warning("等级名称不可为空");
          return false;
        }
        if (!_this.discountCheck(discount)) {
          return false;
        }
        if (initialFee&&!pricePattern.test(initialFee)) {
          _this.$toast.warning("加盟费格式不正确");
          return false;
        }

        _this.loading = true;
        _this.$axios
          .put("distributorLevel", {
            id: _this.edit.id,
            levelName: levelName,
            discount: discount,
            initialFee: initialFee
          })
          .then(result => {
            let res = result.data;
            switch (res.code) {
              case 200:
                {
                  _this.$toast.success("操作成功");
                  _this.listData();
                  $("#edit").modal("hide");
                }
                break;
              default: {
                _this.$toast.error(res.msg);
              }
            }
            _this.loading = false;
            _this.SHIFT_LOADING();
          })
          .catch(err => {
            _this.loading = false;
            _this.SHIFT_LOADING();
          });
      },
      listData() {
        let _this = this;
        _this.PUSH_LOADING();
        _this.$axios
          .get("distributorLevels")
          .then(result => {
            let res = result.data;
            _this.list = res;
            _this.SHIFT_LOADING();
          })
          .catch(err => {
            _this.SHIFT_LOADING();
          });
      }
    }
  };
</script>