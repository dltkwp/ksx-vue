<template>
  <div id="wrapper">
      <v-menus></v-menus>
      <div id="page-wrapper" class="gray-bg" style="min-height: 394px;">
        <v-top></v-top>
        <div class="wrapper wrapper-content animated fadeInRight">
          <div class="row">
            <div class="col-lg-12">
              <div class="ibox float-e-margins">
              <div class="ibox-title">
                分类设置
              </div>
                <div class="ibox-content">
                  <div class="row">
                    <div class="col-sm-9 m-b-xs">
                      <div class="btn btn-primary btn-sm" @click="showSaveModal()">新增分类</div>
                    </div>
                  </div>
                  <div class="table-responsive">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>分类名称</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item,index) in list" :key="index">
                          <td>{{index + 1}}</td>
                          <td>{{item.categoriesName}}</td>
                          <td>
                            <div @click="showEditModal(index)" class="btn btn-sm btn-default m-r-xs">编辑</div>
                            <div @click="showConfirmModal(index)" class="btn btn-sm btn-default">删除</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                     <v-empty :isShow="list.length==0"></v-empty>
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
                        <label>分类名称*</label>
                        <input v-model="save.categoriesName" type="text" placeholder="请输入分销名称" class="form-control" maxlength="20">
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
                        <label>分类名称*</label>
                        <input v-model="edit.categoriesName" type="text" placeholder="请输入分销名称" class="form-control" maxlength="20">
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
   </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import * as types from "@/store/mutation-types.js";

import vMenus from "@/components/menus/menus.vue";
import vTop from "@/components/top/top.vue";
import vFoot from "@/components/foot/foot.vue";
import vEmpty from "@/components/empty/empty.vue";


export default {
  components: {
    vMenus,
    vTop,
    vFoot,
    vEmpty
  },
  data() {
    return {
      loading: false,
      index:-1,
      list: [],
      save: {
        categoriesName: ""
      },
      edit: {
        categoriesName: "",
        id: 0
      }
    };
  },
  mounted() {
    this.SHIFT_LOADING();
    this.save.categoriesName = "";
    this.edit.categoriesName = "";
    this.edit.id = 0;
    this.listData();
  },
  methods: {
    ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
    showSaveModal() {
      this.save.categoriesName = "";
      $("#add").modal("show");
    },
    showEditModal(index) {
      let cur = this.list[index];
      this.edit.categoriesName = cur.categoriesName;
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
        .delete("categories/" + id)
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
    saveData() {
      let _this = this;
      let categoriesName = _this.save.categoriesName.trim();
      if (_this.$lodash.isEmpty(categoriesName)) {
        _this.$toast.warning("分类名称不可为空");
        return false;
      }
      _this.loading = true;
      _this.$axios
        .post("categories", {
          categoriesName: categoriesName
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
      let categoriesName = _this.edit.categoriesName.trim();
      if (_this.$lodash.isEmpty(categoriesName)) {
        _this.$toast.warning("分类名称不可为空");
        return false;
      }
      _this.loading = true;
      _this.$axios
        .put("categories", {
          categoriesName: categoriesName,
          id: _this.edit.id
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
        .get("categories")
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