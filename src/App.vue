<template>
  <div id="app">
    <!-- <logintest></logintest> -->
    <el-container>
      <el-header v-if="isRouterAlive"><mainMenu></mainMenu></el-header>
    </el-container>
    <router-view />
  </div>
</template>

<script>
// import Axios from "axios";
import mainMenu from "./components/mainmenu";

export default {
  name: "App",
  data() {
    return {
      isRouterAlive: true,
      url:
        "http://localhost:3000/auth?client_id=1&redirect_uri=http://localhost:8080/#/show_menu2&scope=openid profile&response_type=code&state=455356436",
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
    // getroles() {
    //   Axios.get("/webservices/public_services.asmx/login", {
    //     params: {
    //       username: "zhangpanwang",
    //       pwd: "19585793",
    //     },
    //   })
    //     .then((res) => {
    //       console.log(res)
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    //   // console.log('123333')
    // },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
  },
  mounted() {
    // this.getroles();
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
}
.el-header {
  padding: 0px !important;
}
</style>
