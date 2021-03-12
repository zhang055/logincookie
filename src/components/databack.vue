<template>
  <div>
    <el-dialog
      title="请输入时间节点"
      :visible.sync="visibleStatus"
      width="450px"
      :show-close="true"
      center
    >
      <div class="grid-content bg-purple">
        <el-form
          :model="form"
          ref="form"
          class="deusername-form-inline"
          label-width="80px"
        >
          <el-form-item
            label="起始时间"
            :rules="[{ required: true, message: '请输入时间' }]"
          >
            <el-col :span="11">
              <el-form-item prop="startdate">
                <el-date-picker
                  v-model="form.startdate"
                  type="datetime"
                  :editable="form.ed"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item
            label="截止时间"
            :rules="[{ required: true, message: '请输入时间' }]"
          >
            <el-col :span="11">
              <el-form-item prop="enddate">
                <el-date-picker
                  v-model="form.enddate"
                  type="datetime"
                  :editable="form.ed"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-button type="warning" @click="submitForm('form')"
            >删除数据</el-button
          >
          <el-button @click="resetForm('form')">重置</el-button>
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
  props: ["dialogVisible", "modelList"],
  data() {
    return {
      visibleStatus: false,
      form: {
        name: "",
        region: "",
        startdate: "",
        enddate: "",
        desc: "",
        ed: false,
      },
      loading: false,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form);
          var data = {
            type: "fxdataback",
            params: JSON.stringify(this.form),
          };
          if (
            this.form.startdate.toString().length == 0 ||
            this.form.enddate.toString().length == 0
          ) {
            alert("日期不完整");
          } else {
            this.$confirm("请确认是否删除数据?"+this.form.startdate+"---"+this.form.enddate, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.deletedata(data);
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消删除",
                });
                this.visibleStatus = false;
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deletedata(data) {
      Axios({
        headers: {
          deviceCode: "A95ZEF1-47B5-AC90BF3",
        },
        method: "post",
        url: "/modifydata",
        data: qs.stringify(data),
      })
        .then(() => {
          this.$message({
            type: "info",
            message: "删除成功",
          });
          this.$emit("latestStatus", new Date());
          this.visibleStatus = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "删除失败，请重新操作",
          });
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // this.tableData = [];
      // this.$emit('reUintData', this.tableData);
    },
  },
  watch: {
    dialogVisible: function() {
      // console.log(this.dialogVisible);
      this.visibleStatus = true;
      console.log(this.visibleStatus);
    },
  },
};
</script>
