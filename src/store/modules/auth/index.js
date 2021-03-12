import Cookies from 'js-cookie'
import axios from 'axios'
import Auth from '@/util/auth'
import qs from 'qs'

const state = {
    token: '',
    navList: []
}

const mutations = {
    setNavList: (state, data) => {
        state.navList = data
    },

    setToken: (state, data) => {
        if (data) {
            Auth.setToken(data)
            Auth.setLoginStatus()
        } else {
            Auth.removeToken()
            Auth.removeLoginStatus()
        }
        state.token = data
    }
}

const actions = {
    // 邮箱登录
    loginByEmail({ commit }, userInfo) {
        console.log("执行登录")
        return new Promise((resolve) => {
            axios({
                url: '/webservices/public_services.asmx/login',
                method: 'post',
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
                },
                data: qs.stringify(userInfo)
            }).then(res => {
                console.log(res)
                console.log(res.token)
                commit('setToken', res.data)
                commit('user/setName', res.data.username, { root: true })
                resolve(res)
            })
        });
    },

    // 登出
    logout({ commit }) {
        return new Promise((resolve) => {
            commit('setToken', '')
            commit('user/setName', '', { root: true })
            commit('tagNav/removeTagNav', '', { root: true })
            resolve()
        })
    },

    // 重新获取用户信息及Token
    // TODO: 这里不需要提供用户名和密码，实际中请根据接口自行修改
    relogin({ dispatch, commit, state }) {
        console.log("11111")
        return new Promise((resolve) => {
            // 根据Token进行重新登录
            let token = Cookies.get('token'),
                userName = Cookies.get('userName')

            // 重新登录时校验Token是否存在，若不存在则获取
            if (!token) {
                dispatch("getNewToken").then(() => {
                    commit('setToken', state.token)
                })
            } else {
                commit('setToken', token)
                console.log(token)
            }
            // 刷新/关闭浏览器再进入时获取用户名
            commit('user/setName', decodeURIComponent(userName), { root: true })
            resolve()
        })
    },

    // 获取新Token
    getNewToken() {
        console.log(123)
        // return new Promise((resolve) => {
        //     axios({
        //         url: '/getToken',
        //         method: 'get',
        //         param: {
        //             token: state.token
        //         }
        //     }).then((res) =>{
        //         commit("setToken", res.token)
        //         resolve()
        //     })
        // })
    },
    // getNewToken({ commit, state }) {
    //     // return new Promise((resolve) => {
    //     //     axios({
    //     //         url: '/getToken',
    //     //         method: 'get',
    //     //         param: {
    //     //             token: state.token
    //     //         }
    //     //     }).then((res) =>{
    //     //         commit("setToken", res.token)
    //     //         resolve()
    //     //     })
    //     // })
    // },

    // 获取该用户的菜单列表
    getNavList({ commit }) {
        return new Promise((resolve) => {
            axios({
                url: '/user/navlist',
                methods: 'post',
                data: {}
            }).then((res) => {
                commit("setNavList", res)
                resolve(res)
            })
        })
    },

    // 将菜单列表扁平化形成权限列表
    getPermissionList({ state }) {
        return new Promise((resolve) => {
            let permissionList = []
            // 将菜单数据扁平化为一级
            function flatNavList(arr) {
                for (let v of arr) {
                    if (v.child && v.child.length) {
                        flatNavList(v.child)
                    } else {
                        permissionList.push(v)
                    }
                }
            }
            flatNavList(state.navList)
            resolve(permissionList)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
