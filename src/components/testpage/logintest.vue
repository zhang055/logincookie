<template>
  <div>
    <!-- <el-button type="text" @click="dialogVisible = true">登录按钮</el-button> -->

    <el-dialog
      title="登录"
      :visible.sync="dialogVisible"
      width="380px"
      :show-close="true"
      center
    >
      <el-form
        :model="loginInfo"
        ref="loginInfo"
        class="deusername-form-inline"
        label-width="80px"
      >
        <el-form-item
          label="用户名"
          prop="username"
          :rules="[{ required: true, message: '用户名不能为空' }]"
        >
          <el-input
            type="username"
            v-model="loginInfo.username"
            autocomplete="off"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          :rules="[{ required: true, message: '密码不能为空' }]"
        >
          <el-input
            type="password"
            v-model="loginInfo.password"
            autocomplete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginInfo')"
            >登录</el-button
          >
          <el-button @click="resetForm('loginInfo')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
// import Axios from "axios";
import {  mapActions } from "vuex";
export default {
  name: "logintest",
  data() {
    return {
      dialogVisible: true,
      loginInfo: {
        username: "",
        password: "",
        loginstate: "",
      },
    };
  },
  methods: {
    ...mapActions({
      login: "auth/loginByEmail",
    }),
    submitForm(formName) {
      // var _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.login({
            username: this.loginInfo.username,
            pwd: this.loginInfo.password,
          }).then((res) => {
            this.$router.push("/show_menu2");
            this.dialogVisible = false;
            console.log(res);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
