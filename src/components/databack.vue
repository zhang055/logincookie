<template>
  <div>
    <el-dialog
      title="配置产品信息"
      :visible.sync="visibleStatus"
      width="400px"
      :show-close="true"
      center
    >
      <div class="grid-content bg-purple">
        <el-form
          :model="modelInfo"
          ref="modelInfo"
          class="deusername-form-inline"
          label-width="80px"
        >
          <el-form-item
            label="机型名称"
            prop="productId"
            :rules="[{ required: true, message: '请输入机型' }]"
          >
            <el-select
              v-model="modelInfo.productId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入机型"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in options"
                :key="item.productId"
                :label="item.productName"
                :value="item.productId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成品料号">
            <el-input
              autocomplete="off"
              disabled
              :value="modelInfo.productId"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="彩盒料号"
            prop="boxCode"
            :rules="[
              { required: true, message: '彩盒不能为空' },
              { type: 'number', message: '请输入数字' },
            ]"
          >
            <el-input
              autocomplete="off"
              v-model.number="modelInfo.boxCode"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="EAN13码"
            prop="ean13"
            :rules="[
              { required: true, message: 'EAN13码不能为空' },
              { type: 'number', message: '请输入数字' },
            ]"
          >
            <el-input
              autocomplete="off"
              v-model.number="modelInfo.ean13"
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="submitForm('modelInfo')"
            >确定</el-button
          >
          <el-button @click="resetForm('modelInfo')">重置</el-button>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Axios from "axios";
import qs from "qs";
export default {
  name: "databack",
  // props: ['dialogVisible', 'childIndex', 'childRows', 'childTableData'],
  props: ["dialogVisible", "modelList"],
  data() {
    return {
      visibleStatus: false,
      modelInfo: {
        productId: "",
        productName: "",
        boxCode: "",
        ean13: "",
      },
      options: [],
      value: [],
      list: [],
      productList: [],
      loading: false,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.modelInfo);
          var data = {
            type: "insertBoxScan",
            p: JSON.stringify(this.modelInfo),
          };
          if (this.modelInfo.boxCode.toString().length != 10) {
            alert("彩盒料号为10位");
          } else {
            if (this.modelInfo.ean13.toString().length != 13) {
              alert("彩盒料号为13位");
            } else {
              // insertBoxScan

              if (
                this.productList.findIndex(
                  (item) => item.productId == this.modelInfo.productId
                ) != -1
              ) {
                var updateData = {
                  type: "updateBoxScan",
                  p: JSON.stringify(this.modelInfo),
                };
                this.$confirm("该机型已配置,是否更新配置?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                  .then(() => {
                    var succ = this.insertProductConfig(updateData);
                    succ.then((val) => {
                      console.log(val);
                      if (val) {
                        this.$message({
                          type: "success",
                          message: "更新配置成功!",
                        });
                      }
                      this.$emit("latestStatus", new Date());
                      this.visibleStatus = false;
                    });
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消更新",
                    });
                    this.visibleStatus = false;
                  });

                // 需要多级ajax请求
              } else {
                console.log(this.modelInfo);
                // 上传信息
                this.insertProductConfig(data);
                this.$emit("latestStatus", new Date());
                this.visibleStatus = false;
              }
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    insertProductConfig(data) {
      var succ = Axios({
        headers: {
          deviceCode: "A95ZEF1-47B5-AC90BF3",
        },
        method: "post",
        url: "/webservices/private_services.asmx/excuteSql",
        data: qs.stringify(data),
      }).then((res) => {
        // returncons
        // console.log(res);

        alert("机型配置成功");
        return res.data.success;
      });
      return succ;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // this.tableData = [];
      // this.$emit('reUintData', this.tableData);
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter((item) => {
            return (
              item.productName.toLowerCase().indexOf(query.toLowerCase()) > -1
            );
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
  },
  mounted() {
    // Axios.get("/webservices/public_services.asmx/innerSimpleQuery", {
    //   params: {
    //     type: "getProductInfoConfig",
    //     p: "",
    //   },
    // })
    //   .then((res) => {
    //     var productData = res.data.data;
    //     this.list = productData.map((item) => {
    //       return {
    //         productId: `${item.productId}`,
    //         productName: `${item.productName}`,
    //       };
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  },
  computed: {
    newValue() {
      return this.modelInfo.productId;
    },
  },
  watch: {
    dialogVisible: function() {
      // console.log(this.dialogVisible);
      this.visibleStatus = true;
      console.log(this.visibleStatus);
    },
    newValue: function(cur) {
      console.log(cur);
      var arr = this.list.filter((item) => {
        return item.productId == cur;
      });
      this.modelInfo.productName = arr[0].productName;
    },
    modelList: function() {
      this.productList = this.modelList;
    },
  },
};
</script>
