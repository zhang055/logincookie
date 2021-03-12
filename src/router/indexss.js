// import Vue from 'vue'
// import Router from 'vue-router'
// import filehandle from '../components/filehandle'
// import showmenu2 from '../components/showmenu2'
// import productconfig from '../components/productconfig'
// import monthsummy from '../components/monthsummy'
// Vue.use(Router)
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }


// export default new Router({
//   routes: [
//     {
//       path: '/showmenu2',
//       name: 'showmenu2',
//       component: showmenu2,
//       children: [
//         {
//           path: '/filehandle',
//           name: 'filehandle',
//           component: filehandle
//         },{
//           path: '/productconfig',
//           name: 'productconfig',
//           component: productconfig
//         },{
//           path: '/monthsummy',
//           name: 'monthsummy',
//           component: monthsummy
//         }
//       ]
//     },

//     {
//       path: '*',
//       redirect: '/showmenu2'
//     }

//   ]
// })