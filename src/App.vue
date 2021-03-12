<template>
  <div id="app">
    <!-- <logintest></logintest> -->
    <div id="fixfoot">
      <el-container>
        <el-header v-if="isRouterAlive"><mainMenu></mainMenu></el-header>
      </el-container>
      <router-view />
    </div>

    <el-footer>制造处---通讯工程</el-footer>
  </div>
</template>

<script>
// import Axios from "axios";
import mainMenu from "./components/mainmenu";
import Cookie from 'js-cookie'

export default {
  name: "App",
  data() {
    return {
      isRouterAlive: true,
      url:
        "http://localhost:3000/auth?client_id=1&redirect_uri=http://localhost:8080/&scope=openid profile&response_type=code&state=455356436",
      // loginInfo: {
      //   userrole: "",
      //   loginstate: "",
      // },
    };
  },
  components: {
    mainMenu: mainMenu,
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    login(e) {
      window.location.href = e;
    },
  },
  beforeMount() {
      // 首次加载/刷新时判断当前是否在登录状态
      console.log("appvue中beforemount")
      if (Cookie.get('isLogin')) {
        console.log(Cookie.get('isLogin'))
        console.log("APPVUE重新登录")
        this.$store.dispatch('auth/relogin')
      } else {
        this.$router.push('/logintest')
      }

    },
  mounted() {
    // this.login(this.url);
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  margin: 0px !important;
  padding: 0px !important;
  height: 100%;
}
#fixfoot {
  height: 100%;
}
.el-header {
  padding: 0px !important;
}
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  width: 100%;
  text-align: center;
  border-top: 1px solid rgb(145, 138, 138);
  line-height: 30px;
  font-size: 90%;
  height: 30px !important;
  position: absolute;
  bottom: 0px;
}
.el-table::before,
.el-table__fixed-right::before,
.el-table__fixed::before {
  height: 0px !important;
}
</style>
