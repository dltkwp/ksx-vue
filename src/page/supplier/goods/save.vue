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
                          <li v-bind:class="{active:tabType=='base'}" @click="tabChange('base')"><a href="javascript:;;"> 基础信息</a></li>
                          <li v-bind:class="{active:tabType=='price'}" @click="tabChange('price')"><a href="javascript:;;"> 分销价格设置</a></li>
                          <li v-bind:class="{active:tabType=='images'}" @click="tabChange('images')"><a href="javascript:;;"> 图片</a></li>
                      </ul>
                      <div class="tab-content">
                          <div class="tab-pane" v-bind:class="{active:tabType=='base'}" >
                              <div class="panel-body">
                                  <fieldset class="form-horizontal">
                                      <div class="form-group"><label class="col-sm-2 control-label">ID:</label>
                                          <div class="col-sm-10"><input type="text" class="form-control" placeholder="编号"></div>
                                      </div>
                                      <div class="form-group"><label class="col-sm-2 control-label">名称:</label>
                                          <div class="col-sm-10"><input type="text" class="form-control" placeholder="产品名称"></div>
                                      </div>
                                      <div class="form-group"><label class="col-sm-2 control-label">分类:</label>
                                          <div class="col-sm-10">
                                              <select  v-model="save.categoriesId" class="form-control" >
                                                   <option v-for="item in categoryList" v-bind:value="item.id">
                                                    {{ item.categoriesName }}
                                                </option>
                                              </select>
                                          </div>
                                      </div>
                                      <div class="form-group"><label class="col-sm-2 control-label">成本:</label>
                                          <div class="col-sm-10"><input type="text" class="form-control" placeholder="成本"></div>
                                      </div>
                                      <div class="form-group"><label class="col-sm-2 control-label">建议售价:</label>
                                          <div class="col-sm-10"><input type="text" class="form-control" placeholder="建议售价"></div>
                                      </div>
                                        <div class="form-group"><label class="col-sm-2 control-label">最低售价:</label>
                                          <div class="col-sm-10"><input type="text" class="form-control" placeholder="最低售价"></div>
                                      </div>
                                        <div class="form-group"><label class="col-sm-2 control-label">库存:</label>
                                          <div class="col-sm-10"><input type="text" class="form-control" placeholder="库存"></div>
                                      </div>
                                      <div class="form-group"><label class="col-sm-2 control-label">状态:</label>
                                          <div class="col-sm-10">
                                              <select v-model="save.status" class="form-control" >
                                                  <option value='1'>在售</option>
                                                  <option value='0'>停售</option>
                                              </select>
                                          </div>
                                      </div>
                                      <div class="form-group"><label class="col-sm-2 control-label">产品介绍:</label>
                                          <div class="col-sm-10">
                                              <div class="summernote">
                                                  <h3>请添加产品描述</h3>
                                              </div>
                                          </div>
                                      </div>
                                      <div class="hr-line-dashed"></div>
                                      <div class="form-group">
                                        <div class="col-sm-4 col-sm-offset-2">
                                          <button class="btn btn-primary" type="button">保存</button>
                                        </div>
                                      </div>
                                  </fieldset>
                              </div>
                          </div>
                          <div class="tab-pane" v-bind:class="{active:tabType=='price'}" >
                              <div class="panel-body">
                                  <div class="table-responsive">
                                      <table class="table table-stripped table-bordered">
                                          <thead>
                                          <tr>
                                              <th>
                                                  分销商等级
                                              </th>
                                              <th>
                                                  分销价
                                              </th>
                                          </tr>
                                          </thead>
                                          <tbody>
                                          <tr>
                                              <td>
                                                一级分销商
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" placeholder="60.00">
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>
                                                二级分销商
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" placeholder="60.00">
                                              </td>
                                          </tr>
                                            <tr>
                                              <td>
                                                三级分销商
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" placeholder="60.00">
                                              </td>
                                          </tr>
                                          </tbody>
                                      </table>
                                        <button class="btn btn-primary" type="submit">保存</button>
                                  </div>
                              </div>
                          </div>
                          <div class="tab-pane" v-bind:class="{active:tabType=='images'}" >
                              <div class="panel-body">
                                  <div class="table-responsive">
                                      <table class="table table-bordered table-stripped">
                                          <thead>
                                          <tr>
                                              <th>
                                                展示图片
                                              </th>
                                              <th>
                                                图片链接
                                              </th>
                                              <th>
                                                  显示顺序
                                              </th>
                                              <th>
                                                  操作
                                              </th>
                                          </tr>
                                          </thead>
                                          <tbody>
                                          <tr>
                                              <td>
                                                  <img src="img/gallery/2s.jpg">
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" disabled value="http://mydomain.com/images/image1.png">
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" value="1">
                                              </td>
                                              <td>
                                                  <button class="btn btn-white"><i class="fa fa-trash"></i> </button>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>
                                                  <img src="img/gallery/1s.jpg">
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" disabled value="http://mydomain.com/images/image2.png">
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" value="2">
                                              </td>
                                              <td>
                                                  <button class="btn btn-white"><i class="fa fa-trash"></i> </button>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>
                                                  <img src="img/gallery/3s.jpg">
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" disabled value="http://mydomain.com/images/image3.png">
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" value="3">
                                              </td>
                                              <td>
                                                  <button class="btn btn-white"><i class="fa fa-trash"></i> </button>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>
                                                  <img src="img/gallery/4s.jpg">
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" disabled value="http://mydomain.com/images/image4.png">
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" value="4">
                                              </td>
                                              <td>
                                                  <button class="btn btn-white"><i class="fa fa-trash"></i> </button>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td>
                                                  <img src="img/gallery/5s.jpg">
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" disabled value="http://mydomain.com/images/image5.png">
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" value="5">
                                              </td>
                                              <td>
                                                  <button class="btn btn-white"><i class="fa fa-trash"></i> </button>
                                              </td>
                                          </tr>
                                        
                                          </tbody>
                                      </table>
                                  </div>
                                  <button class="btn btn-primary" type="submit">保存</button>
                              </div>
                          </div>
                      </div>
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
          categoryList:[],
          tabType:'base', //base: 基本信息,price: 分销价格设置 , images: 图片
          save:{
              status:1,
              categoriesId:''
          },
        };
      },
      mounted() {
        this.categoryListData();
      },
      methods: {
        ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
        tabChange(key){
            this.tabType = key;
            switch (key) {
                case "base":{}break;
                case "price":{}break;
                case "images":{}break;
            }
        },
        categoryListData(){
          let _this = this;
            _this.$axios.get('categories').then((result)=> {
              _this.categoryList = result.data;
              if(result.data.length>0){
                _this.resarch.categoriesId = result.data[0].id;
              }
            }).catch(err => {});
        },
      }
    };
</script>

<style>

</style>
