import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


import Home from '@/components/Home'
import Login from '@/components/Login'


export default new Router({
	routes: [
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/home',
			name: 'home',
			component: Home
		}
	]
})
