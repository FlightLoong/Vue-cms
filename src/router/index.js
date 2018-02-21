import Vue from 'vue'
import Router from 'vue-router'


import Home from '@/components/Home'
import Login from '@/components/Login'
import ManIndex from '@/components/ManIndex'
import Users from '@/components/users/Users'
import Rights from '@/components/rights/Rights'
import Roles from '@/components/rights/Roles'
import Category from '@/components/product/Category'

Vue.use(Router)


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
				{ path: '/ManIndex', component: ManIndex, name:'ManIndex' },
				{ path: '/users', component: Users, name: 'users'},
				{ path: '/rights', component: Rights, name:'rights'},
				{ path: '/roles', component: Roles, name:'roles'},
				{ path: '/category', component: Roles, name: 'category'},
				{ path: '/categories', component: Category, name: 'categorie', name: 'categories'}
			]
		}
	]
})
