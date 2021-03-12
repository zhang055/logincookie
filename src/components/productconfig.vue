<template>
  <div class="grid-content bg-purple addc" width="600px">
    <el-form
      width="600px"
      :model="modelInfo"
      ref="modelInfo"
      class="deusername-form-inline"
      label-width="80px"
    >
      <el-form-item
        label="成品料号"
        prop="pid"
        :rules="[{ required: true, message: '请输入成品料号' }]"
      >
        <el-input v-model="modelInfo.pid"></el-input>
      </el-form-item>
      <el-form-item
        label="机型名称"
        prop="modelname"
        :rules="[{ required: true, message: '请输入机型名称' }]"
      >
        <el-input v-model="modelInfo.modelname"></el-input>
      </el-form-item>
      <el-form-item
        label="机型描述"
        prop="modelgroup"
        :rules="[{ required: true, message: '请输入机型描述' }]"
      >
        <el-input v-model="modelInfo.modelgroup"></el-input>
      </el-form-item>
      <el-form-item
        label="机型标准"
        prop="simplegroup"
        :rules="[{ required: true, message: '请输入机型标准' }]"
      >
        <el-input v-model="modelInfo.simplegroup"></el-input>
      </el-form-item>
      <el-form-item
        label="机型分类"
        prop="modeltype"
        :rules="[{ required: true, message: '请输入机型类别' }]"
      >
        <el-input v-model="modelInfo.modeltype"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('modelInfo')"
        >确定</el-button
      >
      <el-button @click="resetForm('modelInfo')">重置</el-button>
    </el-form>
  </div>
</template>
<script>
import Axios from "axios";
import qs from "qs";
export default {
  name: "productconfig",
  data() {
    return {
      visibleStatus: false,
      modelInfo: {
        pid: "",
        modelname: "",
        modelgroup: "",
        simplegroup: "",
        modeltype: "",
      }
    };
  },
  methods: {
    submitForm(formName) {
      // var _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.modelInfo);
          var data1 = {
            type: "deletefxproductconfig",
            params: JSON.stringify(this.modelInfo),
          };
          var data2 = {
            type: "testtemp",
            params: JSON.stringify(this.modelInfo),
          };
          if (this.modelInfo.pid.toString().length != 10) {
            alert("成品料号为10位");
          } else if (
            this.modelInfo.modelname.toString().length == 0 ||
            this.modelInfo.modelgroup.toString().length == 0 ||
            this.modelInfo.modeltype.toString().length == 0 ||
            this.modelInfo.simplegroup.toString().length == 0
          ) {
            alert("机型信息不完整，请补充");
          } else {
            this.$confirm(
              "请确认是否更新机型信息?" +
                this.modelInfo.pid +
                "---" +
                this.modelInfo.modelname +
                "---" +
                this.modelInfo.modelgroup +
                "---" +
                this.modelInfo.modeltype +
                "---" +
                this.modelInfo.simplegroup,
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                this.insertProductConfig(data1, data2);
                this.resetForm("modelInfo");
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消更新",
                });
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    insertProductConfig(data1, data2) {
      Axios({
        headers: {
          deviceCode: "A95ZEF1-47B5-AC90BF3",
        },
        method: "post",
        url: "/modifydata",
        data: qs.stringify(data1),
      })
        .then(() => {
          Axios({
            headers: {
              deviceCode: "A95ZEF1-47B5-AC90BF3",
            },
            method: "post",
            url: "/modifydata",
            data: qs.stringify(data2),
          })
            .then(() => {
              this.$message({
                type: "info",
                message: "机型维护成功",
              });
              this.$emit("latestStatus", new Date());
              this.visibleStatus = false;
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "机型维护失败，请重新操作",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "机型维护失败，请重新操作",
          });
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // this.tableData = [];
      // this.$emit('reUintData', this.tableData);
    },
  },
  mounted() {},
  computed: {
    newValue() {
      return this.modelInfo.pid;
    },
  },
  watch: {},
};
</script>
<style>
.addc {
  display: inline-block;
  width: 30%;
}
</style>
