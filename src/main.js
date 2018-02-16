// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// 导入 element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

// 配置全局导航过滤，拦截路由请求
router.beforeEach((to, from, next) => {
	let user = localStorage.getItem('mytoken');
	// 判断是否登录过，
	if (user) {
		// 已经登录，就按照正常的逻辑向下跳转
		next()
	} else {
		// 登录页面不需要验证权限
		if (to.path !== '/login') {
			// 如果没有权限，从新路由跳转到登录页面
			next({ path: '/login' })
		} else {
			// 如果是登录页面，直接跳转到登录页面即可
			next()
		}
	}
})

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
})
