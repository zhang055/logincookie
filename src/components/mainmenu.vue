<template>
	<div>
		<el-menu router :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" background-color="#545c64"
		@select="handleSelect" text-color="#fff" active-text-color="#ffd04b">			
			<el-menu-item index="/showmenu2"><i class="el-icon-s-operation"></i><span slot="title">处理中心</span></el-menu-item>
			<el-menu-item index="5">
				<i class="el-icon-paperclip"></i><span slot="title">在线系统</span>
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
