import Vue from 'vue'
import VueRouter from 'vue-router'
import staticRoute from './staticRoute.js'
import whiteList from './whiteList.js'
import Cookie from 'js-cookie' 

var permissionList = [{
    path: '/admin',
    name: '管理员界面',
    permission: ['add']
  },
  // {
  //   path: '/home',
  //   name: '首页界面'
  // }
];


Vue.use(VueRouter)
// 解决element-ui路由报警问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes: staticRoute
})

function initRoute(router) {
  console.log(router)
  return new Promise((resolve) => {
    if (permissionList.length == 0) {
      console.log("没有权限数据,正在获取")
      permissionList.forEach(function(v) {
        let routeItem = router.match(v.path)
        if (routeItem) {
          routeItem.meta.permission = v.permission ? v.permission : []
          routeItem.meta.name = v.name
        }
      })
      resolve()
    } else {
      permissionList.forEach(function(v) {
        let routeItem = router.match(v.path)
        if (routeItem) {
          routeItem.meta.permission = v.permission ? v.permission : []
          routeItem.meta.name = v.name
        }
      })
      console.log("已有权限数据");
      resolve()
    }
  })
}

router.beforeEach((to, from, next) => {
  if (Cookie.get('isLogin')) {
    console.log(Cookie.get('isLogin'))
    console.log("重新登录")
    // this.$store.dispatch('auth/relogin')
  } else if(to.path === '/logintest') {
    next()
    return
  }else{
    next({
      path: "/logintest",
      replace: true
    })
  }

  console.log("routerindex中beforeEach")
  // 加入登录判断
  if (whiteList.indexOf(to.path) >= 0) {
    console.log("该页面无需登录权限")
    next()
  } else {
    if (to.path === '/logintest') {
      next({
        path: "/home",
        replace: true
      })
    } else if (to.path.indexOf("/err") >= 0) {
      next()
    } else {
      initRoute(router).then(() => {
        let isPermission = false
        console.log("进入权限判断")
        permissionList.forEach((v) => {
          // 判断跳转的页面是否在权限列表中
          console.log(to)
          if (v.path == to.fullPath) {
            isPermission = true
          }
        })
        // 没有权限时则跳转至404界面
        if (!isPermission) {
          next({
            path: "/err",
            replace: true
          })
        } else {
          next()
        }
      })
    }

  }
})

export default router
