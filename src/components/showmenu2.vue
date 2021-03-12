<template>
  <div id="app12">
    <el-container>
      <el-aside width="125px" id="app123">
        <el-menu :default-active="$route.path" router class="el-menu-demo" @select="handleSelect" text-color="#000"
          active-text-color="#409EFF">
          <el-menu-item index="/admin">管理员</el-menu-item>
          <el-menu-item index="/home">页面权限测试</el-menu-item>
          <el-menu-item index="/filehandle">文件处理</el-menu-item>
          <el-menu-item index="/productconfig">机型类别维护</el-menu-item>
          <el-menu-item index="/monthsummy">月总结</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>

  </div>
</template>
<script>
  export default {
    name: 'showmenu2',
    data: function() {
      return {
        visible: false
      }
    },
    methods: {
      handleSelect() {

      }
    }
  }
</script>

