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

// 添加管理员用户
export const addUser = (params) => {
    return axios.post('users', params).then(res => {
        return res.data
    })
}

// 获取管理员列表数据
export const getUserById = (params) => {
    return axios.get('users/' + params.id).then(res => {
        return res.data
    })
}

// 提交管理员列表数据
export const editUser = (params) => {
    return axios.put('users/' + params.id, params).then(res => {
        return res.data
    })
}

// 删除管理员列表
export const deleteUser = (params) => {
    return axios.delete('users/' + params.id, params).then(res => {
        return res.data
    })
}

// 查询管理员
export const findUser = (params) => {
    return axios.get('users/' + params.id, params).then(res => {
        return res.data
    })
}

// 权限列表
export const Rights = (params) => {
    return axios.get('rights/' + params.type).then(res => {
        return res.data
    })
}

// 角色列表
export const Roles = () => {
    return axios.get('roles').then(res => {
        return res.data
    })
}
// 添加角色
export const addRoles = (params) => {
    return axios.post('roles', params).then(res => {
        return res.data
    })
}
// 根据id查询角色信息
export const getRolesById = (params) => {
    return axios.get('roles/' + params.id).then(res => {
        return res.data
    })
}
// 编辑角色
export const editRoles = (params) => {
    return axios.put('roles/' + params.id, params).then(res => {
        return res.data
    })
}
// 删除角色
export const deleteRoles = (params) => {
    return axios.delete('roles/' + params.id).then(res => {
        return res.data
    })
}