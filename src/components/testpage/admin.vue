<template>
  <div class="sys-toolbar">
    <div class="aaa">
      <el-button type="success" v-hasPermission="'add'" @click="handleClick" id="123456">注入管理员路由</el-button>
      <el-button type="primary" v-hasPermission="'edit'">修改</el-button>
      <el-button type="success"  @click="test" id="123456">注入管理员路由</el-button>
    </div>

    <!-- <el-button type="success" v-haspermission="'edit'" @click="handleClick">注入首页路由</el-button> -->
  </div>

</template>

<script>
  export default {
    name: 'adminpage',
    data() {
      return {

      }

    },
    methods: {
      handleClick() {
        alert("触发了点击事件")
        // var ss=document.getElementById("123456")
        // document.getElementById("123456").parentNode.removeChild(ss)
      },
      test(){
        console.log(this.$store.state.auth)
      }
    }
  }
</script>

<style>
</style>
