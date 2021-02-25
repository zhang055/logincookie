<template>
	<div>
		<el-menu router :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" background-color="#545c64"
		@select="handleSelect" text-color="#fff" active-text-color="#ffd04b">			
			<el-menu-item index="/showmenu2"><i class="el-icon-s-operation"></i><span slot="title">处理中心</span></el-menu-item>
			<!-- <el-submenu index="2">
				<template slot="title"><i class="el-icon-menu"></i><span slot="title">SMT相关</span></template>
				<el-menu-item index="/show_menu2">SMT分料系统</el-menu-item>
				<el-menu-item index="2-3">SMT效率2</el-menu-item>
				<el-submenu index="2-4">
					<template slot="title">选项4</template>
					<el-menu-item index="2-4-1">选项1</el-menu-item>
					<el-menu-item index="2-4-2">选项2</el-menu-item>
				</el-submenu>
			</el-submenu>
			<el-menu-item index="/packBoxScan"><i class="el-icon-finished"></i><span slot="title">包装条码核对</span></el-menu-item> -->
			<el-menu-item index="5">
				<a class="a" href="http://tp-link.net/" target="_blank"><i class="el-icon-paperclip"></i><span slot="title">内网导航</span></a>
			</el-menu-item>
			<!-- <el-submenu index="dd2" class="rightstyle">
				<template slot="title">{{username}}</template>
				<el-menu-item index="11111">退出</el-menu-item>
			</el-submenu> -->
		</el-menu>
		
	</div>
</template>
<script>
	export default {
		name: 'mainMenu',
		data: function() {
			return {
				username:'',
				visible: false,
				activeIndex2: '/showmenu2',
				loginInfo:{
					username:'',
					password:'',
					loginstate:''
				}
			}
		},
		methods: {
			handleSelect(){}
		},
		mounted() {

		},
		watch:{

		}
	}
</script>
<style>
	/* div {
		margin: 0px;
		background-color:#545c64;
	} */
	.a {
		text-decoration: none;
	}
	.rightstyle{
		float: right ;
		margin: 0px 0px 0px 1050px;
		
	}
	
</style>
