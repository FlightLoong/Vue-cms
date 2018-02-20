import Vue from 'vue'
import Router from 'vue-router'


import Home from '@/components/Home'
import Login from '@/components/Login'
import ManIndex from '@/components/ManIndex'
import Users from '@/components/users/Users'
import Rights from '@/components/rights/Rights'
import Roles from '@/components/rights/Roles'

Vue.use(Router)


export default new Router({
	routes: [
		// {
		// 	path: '/',
		// 	redirect: '/login'
		// },
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
				{ path: '/users', component: Users},
				{ path: '/rights', component: Rights},
				{ path: '/roles', component: Roles}
			]
		}
	]
})
