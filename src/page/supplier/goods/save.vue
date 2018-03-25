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
                                          <div class="col-sm-10"><input v-model="save.productNo" type="text" class="form-control" placeholder="编号" maxlenth="20"></div>
                                      </div>
                                      <div class="form-group"><label class="col-sm-2 control-label">名称:</label>
                                          <div class="col-sm-10"><input  v-model="save.productName"  type="text" class="form-control" placeholder="产品名称" maxlenth="20"></div>
                                      </div>
                                      <div class="form-group"><label class="col-sm-2 control-label">分类:</label>
                                          <div class="col-sm-10">
                                              <select  v-model="save.categoriesId" class="form-control" >
                                                   <option v-for="(item,index) in categoryList" :key="index" v-bind:value="item.id">
                                                    {{ item.categoriesName }}
                                                </option>
                                              </select>
                                          </div>
                                      </div>
                                      <div class="form-group"><label class="col-sm-2 control-label">成本:</label>
                                          <div class="col-sm-10"><input v-model="save.cost" type="text" class="form-control" placeholder="成本"  maxlenth="8"></div>
                                      </div>
                                      <div class="form-group"><label class="col-sm-2 control-label">建议售价:</label>
                                          <div class="col-sm-10"><input  v-model="save.recommendedRetailPrice"  type="text" class="form-control" placeholder="建议售价"   maxlenth="8"></div>
                                      </div>
                                        <div class="form-group"><label class="col-sm-2 control-label">最低售价:</label>
                                          <div class="col-sm-10"><input  v-model="save.minRetailPrice"  type="text" class="form-control" placeholder="最低售价"  maxlenth="8"></div>
                                      </div>
                                        <div class="form-group"><label class="col-sm-2 control-label">库存:</label>
                                          <div class="col-sm-10"><input   v-model="save.stock" type="text" class="form-control" placeholder="库存" maxlenth="8"></div>
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
                                                <input v-model="save.description" type="text" class="form-control" placeholder="" maxlenth="8">
                                              </div>
                                          </div>
                                      </div>
                                      <div class="hr-line-dashed"></div>
                                      <div class="form-group">
                                        <div class="col-sm-4 col-sm-offset-2">
                                          <button  v-bind:disabled="loading" v-bind:readonly="loading" @click="saveBase()"  class="btn btn-primary" type="button">保存</button>
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
                                            <th> 分销商等级 </th>
                                            <th> 默认折扣 </th>
                                            <th> 允许分销 </th>
                                            <th> 分销价 </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item,index) in leveList" :key="index">
                                                <td> {{item.levelName}} </td>
                                                <td> {{item.discount}}% </td>
                                                <td><input type="checkbox" v-model="item.allow"  class="i-checks" v-bind:checked="item.allow"></td>
                                                <td><input v-model="item.price" type="text" class="form-control" placeholder=""></td>
                                            </tr>
                                        </tbody>
                                        </table>
                                      <button @click="savePrice()" class="btn btn-primary" type="submit">保存</button>
                                  </div>
                              </div>
                          </div>
                          <div class="tab-pane" v-bind:class="{active:tabType=='images'}" >
                              <div class="panel-body">
                                  <div class="table-responsive">
                                      <table class="table table-bordered table-stripped">
                                          <thead>
                                          <tr>
                                              <th>展示图片</th>
                                              <th>图片链接</th>
                                              <th>显示顺序</th>
                                              <th>操作</th>
                                          </tr>
                                          </thead>
                                          <tbody>
                                          <tr v-for="(item,index) in images" :key="index">
                                              <td>
                                                  <div @click="uploadImage(index)" v-if="!item.url"  class="fileinput fileinput-new">
                                                    <span class="btn btn-default btn-file">
                                                        <span class="fileinput-new">上传附件</span>
                                                    </span>
                                                  </div>
                                                  <img v-if="item.url"  v-bind:src="item.url"  style="width:100px;height:100px;">
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" disabled  v-bind:value="item.url">
                                              </td>
                                              <td>
                                                  <input type="text" class="form-control" v-model="item.sort">
                                              </td>
                                              <td>
                                                  <button @click="imgRemove(index)" class="btn btn-white"><i class="fa fa-trash"></i> </button>
                                              </td>
                                          </tr>
                                          </tbody>
                                      </table>
                                  </div>
                                  <button @click="saveImages()" class="btn btn-primary" type="submit">保存</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <form action="" id="uploadImgForm" style="display:none;">
        <input type="file" name="uploadFile" id="uploadFile" multiple="multiple" style="display:none;" @change="imgUploadFileChange($event)">
      </form>
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
      categoryList: [],
      tabType: "base", //base: 基本信息,price: 分销价格设置 , images: 图片
      save: {
        status: 1,
        categoriesId: "",
        productNo: "",
        productName: "",
        cost: "",
        recommendedRetailPrice: "",
        minRetailPrice: "",
        stock: "",
        description: "",
        id: ""
      },
      leveList: [],
      imageIndex: -1,
      images: []
    };
  },
  mounted() {
    this.SHIFT_LOADING();
    this.levelListData();
    this.categoryListData();
    this.inintImages();
  },
  methods: {
    ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
    tabChange(key) {
      this.tabType = key;
      switch (key) {
        case "base":
          {
          }
          break;
        case "price":
          {
          }
          break;
        case "images":
          {
          }
          break;
      }
    },
    saveBase() {
      let _this = this;
      let status = _this.save.status;
      let categoriesId = _this.save.categoriesId;
      let productNo = _this.save.productNo;
      let productName = _this.save.productName;
      let cost = _this.save.cost;
      let recommendedRetailPrice = _this.save.recommendedRetailPrice;
      let minRetailPrice = _this.save.minRetailPrice;
      let stock = _this.save.stock;
      let description = _this.save.description;

      if (!productNo) {
        _this.$toast.warning("编号不可为空");
        return false;
      }
      if (!productName) {
        _this.$toast.warning("产品名称不可为空");
        return false;
      }
      if (!priceValidate(cost)) {
        _this.$toast.warning("成本格式不正确");
        return false;
      }
      if (!priceValidate(recommendedRetailPrice)) {
        _this.$toast.warning("建议售价格式不正确");
        return false;
      }
      if (!priceValidate(minRetailPrice)) {
        _this.$toast.warning("最低售价格式不正确");
        return false;
      }
      if (!numberExValidate(stock)) {
        _this.$toast.warning("库存格式不正确");
        return false;
      }

      _this.loading = true;
      _this.$axios
        .post("products", {
          status: status,
          categoriesId: categoriesId,
          productNo: productNo,
          productName: productName,
          cost: cost,
          recommendedRetailPrice: recommendedRetailPrice,
          minRetailPrice: minRetailPrice,
          stock: stock,
          description: description
        })
        .then(result => {
          let res = result.data;
          _this.$toast.success("操作成功");
          _this.save.id = res.productId;
          // switch (res.code) {
          //     case 200:
          //     {
          //         _this.$toast.success("操作成功");
          //         _this.save.id = res.productId;
          //     }
          //     break;
          //     default: {
          //         _this.$toast.error(res.msg);
          //     }
          // }
          _this.loading = false;
          _this.SHIFT_LOADING();
        })
        .catch(err => {
          _this.loading = false;
          _this.SHIFT_LOADING();
        });
    },
    savePrice() {
      let _this = this;
      let id = _this.save.id;
      if (!_this.save.id) {
        _this.$toast.success("请先保存基础信息");
        return false;
      }
      let prices = [];
      let errors = [];
      _this.$lodash.forEach(_this.leveList, function(item) {
        if (!priceValidate(item.price.trim())) {
          errors.push("分销商等级：" + item.levelName + "的价格格式不正确");
        }
        prices.push({
          productId: id,
          price: item.price.trim(),
          allow: item.allow
        });
      });
      if (errors.length > 0) {
        _this.$toast.warning(errors.join("\r\n"));
      }

      _this.$axios
        .put("products", {
          id: id,
          prices: prices
        })
        .then(result => {
          let res = result.data;
          switch (res.code) {
            case 200:
              {
                _this.$toast.success("操作成功");
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
    saveImages() {
      let _this = this;
      let id = _this.save.id;
      if (!_this.save.id) {
        _this.$toast.success("请先保存基础信息");
        return false;
      }
      let imgs = _this.$lodash.filter(_this.images, function(item) {
        return item.url != "";
      });
      let arr = _this.$lodash.orderBy(imgs, "sort", "asc");
      let imageCodes = _this.$lodash.map(arr, "code");
      if (imageCodes.length == 0) {
        _this.$toast.warning("请先上传图片且至少上传一张图片");
        return false;
      }
      //提交
      _this.$axios
        .put("products", {
          id: id,
          images: imageCodes.join(",")
        })
        .then(result => {
          let res = result.data;
          switch (res.code) {
            case 200:
              {
                _this.$toast.success("操作成功");
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
    categoryListData() {
      let _this = this;
      _this.$axios
        .get("categories")
        .then(result => {
          _this.categoryList = result.data;
          if (result.data.length > 0) {
            _this.save.categoriesId = result.data[0].id;
          }
        })
        .catch(err => {});
    },
    levelListData() {
      let _this = this;
      _this.$axios
        .get("distributorLevels")
        .then(result => {
          let list = result.data;
          _this.$lodash.forEach(list, function(item) {
            item.discount = 100;
            item.allow = false;
            item.price = "";
          });
          _this.leveList = list;
        })
        .catch(err => {});
    },
    imgRemove: function(index) {
      let _this = this;
      _this.images[index].url = "";
    },
    inintImages: function() {
      this.images.push({ url: "", code: "", sort: 1 });
      this.images.push({ url: "", code: "", sort: 2 });
      this.images.push({ url: "", code: "", sort: 3 });
      this.images.push({ url: "", code: "", sort: 4 });
      this.images.push({ url: "", code: "", sort: 5 });
    },
    uploadImage: function(index) {
      this.imageIndex = index;
      $("#uploadFile").val(null);
      if ($("#uploadFile").val()) {
        document.getElementById("uploadImgForm").reset();
      }
      document.getElementById("uploadFile").click();
    },
    imgUploadFileChange: function(event) {
      if (event) {
        var filePath = "";
        var size = 0;
        var updatingCount = 0;

        if (event && event.target && event.target.files) {
          var file = event.target.files[0];
          size = file.size || 0;
          filePath = file.name;
          var index = filePath.lastIndexOf(".");
          var suffix = filePath.substring(index, filePath.length);

          if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(suffix)) {
            _this.$toast.warning("图片类型必须是.gif,jpeg,jpg,png中的一种");
            return false;
          }

          var imgSize = size / 1024 / 1024;
          if (imgSize > 3) {
            _this.$toast.warning("图片大小超过3M,请上传小于3M的图片.");
            return false;
          }
          var formData = new FormData();
          formData.append("file", file);

          let _this = this;
          _this.$axios
            .post("upload", formData, {
              headers: { "Content-Type": "multipart/form-data" }
            })
            .then(result => {
              let res = result.data;
              _this.images[_this.imageIndex].url = imgCdn + res.fileCode;
              _this.images[_this.imageIndex].code = res.fileCode;

              _this.$toast.success("操作成功");
            })
            .catch(err => {});
        }
      }
    }
  }
};
</script>

<style>

</style>
