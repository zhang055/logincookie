import logintest from '../components/testpage/logintest.vue'
import admin from '../components/testpage/admin.vue'
import home from '../components/testpage/home.vue'
import err from '../components/testpage/err.vue'
import filehandle from '../components/filehandle'
import showmenu2 from '../components/showmenu2'
import productconfig from '../components/productconfig'
import monthsummy from '../components/monthsummy'

const staticRoute = [
	// {
	//   path: '/mainMenu',
	//   name: 'mainMenu',
	//   component: mainMenu},
	{
		path: '/logintest',
		name: 'logintest',
		component: logintest
	},
	{
		path: '/err',
		name: 'err',
		component: err
	},
	{
		path: '/showmenu2',
		name: 'showmenu2',
		component: showmenu2,
		children: [
			{
				path: '/filehandle',
				name: 'filehandle',
				component: filehandle
			}, {
				path: '/productconfig',
				name: 'productconfig',
				component: productconfig
			}, {
				path: '/monthsummy',
				name: 'monthsummy',
				component: monthsummy
			},
			{
				path: '/admin',
				name: 'admin',
				component: admin
			},
			{
				path: '/home',
				name: 'home',
				component: home
			},
		]
	},
	{
		path: '*',
		redirect: '/showmenu2'
	}

	// {
	// 	path:'/admin',
	// 	name:'admin',
	// 	component:admin
	// },
	// {
	// 	path:'*',
	// 	redirect:'/show_menu2'
	// }

]


export default staticRoute
