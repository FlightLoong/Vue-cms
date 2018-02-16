import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


import Home from '@/components/Home'
import Login from '@/components/Login'
import ManIndex from '@/components/ManIndex'
import User from '@/components/user/User'


export default new Router({
	routes: [
		{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/home',
			name: 'home',
			component: Home,
			redirect: '/ManIndex',
			children: [
				{ path: '/ManIndex', component: ManIndex },
				{ path: '/users', component: User}
			]
		}
	]
})
