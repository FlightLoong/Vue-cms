import axios from 'axios';

// 设置请求的基准路径
axios.defaults.baseURL = 'http://47.96.21.88:8888/api/private/v1/'

// 设置拦截器
axios.interceptors.request.use(function(config) {
    let token = localStorage.getItem('mytoken');
    if(token) {
        config.headers['Authorization'] = token
    }
    return config
}, function(error) {
    return Promise.reject(error)
})

// 用户的登录
export const login = (params) => {
    return axios.post('login',params).then(res => {
        // 返回数据
        return res.data
    })
}

// 获取 users 列表的数据
export const usersData = (params) => {
    return axios.get('users', { params: params }).then((res) => {
        // 返回具体的数据，用来传递给下一个 then
        return res.data
    })
}

// 修改管理员的状态
export const usersStateChange = (params) => {
    return axios.put('users/' + params.uId + '/state/' + params.state).then(res => {
        return res.data
    })
}