import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '../components/HelloWorld'
import filehandle from '../components/filehandle'
import showmenu2 from '../components/showmenu2'
import productconfig from '../components/productconfig'
import test from '../components/test'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


export default new Router({
  routes: [
    {
      path: '/showmenu2',
      name: 'showmenu2',
      component: showmenu2,
      children: [
        {
          path: '/filehandle',
          name: 'filehandle',
          component: filehandle
        },{
          path: '/productconfig',
          name: 'productconfig',
          component: productconfig
        },{
          path: '/test',
          name: 'test',
          component: test
        }
      ]
    },

    {
      path: '*',
      redirect: '/showmenu2'
    }

  ]
})