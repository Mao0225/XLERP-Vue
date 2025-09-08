import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/store/user'

// 定义并导出 baseURL
export const baseURL = 'http://127.0.0.1:8099'//本地
// export const baseURL = 'http://39.98.221.201:8099'//线上--打包时候用



// 创建 axios 实例
const service = axios.create({
  baseURL, // API 基础 URL
  timeout: 15000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    if (config.isMultipart) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    return config
  },
  error => {
    console.log('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 检查后端返回的 code 是否为 200
    if (res.code === 200) {
      return res // 返回整个响应对象
    }

    // 处理 token 过期的情况（code: 400 且 msg 包含 "Token 已过期"）
    if (res.code === 400 && res.msg === 'Token 已过期') {
      ElMessage({
        message: '登录状态已过期，请重新登录',
        type: 'error',
        duration: 5 * 1000
      })
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
      return Promise.reject(new Error('Token 已过期'))
    }

    // 其他非 200 错误
    ElMessage({
      message: res.msg || '操作失败',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(new Error(res.msg || '未知错误'))
  },
  error => {
    console.log('响应错误:', error)

    // 处理 HTTP 状态码错误
    if (error.response) {
      const res = error.response.data
      switch (error.response.status) {
        case 400: // 客户端错误
          // 如果后端返回的 msg 是 "Token 已过期"，特殊处理
          if (res.msg === 'Token 已过期') {
            ElMessage({
              message: '登录状态已过期，请重新登录',
              type: 'error',
              duration: 5 * 1000
            })
            const userStore = useUserStore()
            userStore.logout()
            router.push('/login')
            return Promise.reject(new Error('Token 已过期'))
          }
          ElMessage({
            message: res.msg || '请求参数错误',
            type: 'error',
            duration: 5 * 1000
          })
          break
        case 401: // 未授权
          ElMessage({
            message: '登录状态已过期，请重新登录',
            type: 'error',
            duration: 5 * 1000
          })
          const userStore = useUserStore()
          userStore.logout()
          router.push('/login')
          break
        case 403: // 禁止访问
          ElMessage({
            message: '您没有权限访问该资源',
            type: 'error',
            duration: 5 * 1000
          })
          break
        case 404: // 资源不存在
          ElMessage({
            message: res.msg || '请求的资源不存在',
            type: 'error',
            duration: 5 * 1000
          })
          break
        case 405: // 方法不允许
          ElMessage({
            message: res.msg || '请求方法不被允许',
            type: 'error',
            duration: 5 * 1000
          })
          break
        case 500: // 服务器错误
          ElMessage({
            message: res.msg || '服务器内部错误',
            type: 'error',
            duration: 5 * 1000
          })
          break
        default:
          ElMessage({
            message: res.msg || `未知错误(${error.response.status})`,
            type: 'error',
            duration: 5 * 1000
          })
      }
    } else if (error.request) {
      ElMessage({
        message: '网络连接异常，请检查您的网络',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      ElMessage({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

// 封装 GET 请求
export function get(url, params) {
  return service({
    url,
    method: 'get',
    params
  })
}

// 封装 POST 请求
export function post(url, data, isMultipart = false) {
  return service({
    url,
    method: 'post',
    data,
    isMultipart
  })
}

// 封装 PUT 请求
export function put(url, data, isMultipart = false) {
  const config = {
    url,
    method: 'put',
    data
  }
  if (isMultipart) {
    config.isMultipart = true
    const formData = new FormData()
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        formData.append(key, data[key])
      }
    }
    config.data = formData
  }
  return service(config)
}

// 封装 DELETE 请求
export function del(url, params) {
  return service({
    url,
    method: 'delete',
    params
  })
}

export default service