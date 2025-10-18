import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/store/user'

// ========================
// 基础 URL 配置
// ========================
export const baseURL = 'http://127.0.0.1:8099' // 本地 API
// export const baseURL = 'http://39.98.221.201:8099' // 线上打包时使用
export const uploadBaseUrl = 'http://127.0.0.1:8000' // 上传接口程序状态查看


// ========================
// 通用拦截器注册函数
// ========================
function registerInterceptors(service) {
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
      if (res.code === 200) {
        return res
      }

      // Token 过期
      if (res.code === 400 && res.msg === 'Token 已过期') {
        ElMessage.error('登录状态已过期，请重新登录')
        const userStore = useUserStore()
        userStore.logout()
        router.push('/login')
        return Promise.reject(new Error('Token 已过期'))
      }

      // 其他错误
      ElMessage.error(res.msg || '操作失败')
      return Promise.reject(new Error(res.msg || '未知错误'))
    },
    error => {
      console.log('响应错误:', error)
      if (error.response) {
        const res = error.response.data
        const status = error.response.status
        const userStore = useUserStore()

        const msgMap = {
          400: res.msg || '请求参数错误',
          401: '登录状态已过期，请重新登录',
          403: '您没有权限访问该资源',
          404: res.msg || '请求的资源不存在',
          405: res.msg || '请求方法不被允许',
          500: res.msg || '服务器内部错误'
        }

        ElMessage.error(msgMap[status] || `未知错误(${status})`)

        if (status === 400 && res.msg === 'Token 已过期') {
          userStore.logout()
          router.push('/login')
        } else if (status === 401) {
          userStore.logout()
          router.push('/login')
        }
      } else if (error.request) {
        ElMessage.error('网络连接异常，请检查您的网络')
      } else {
        ElMessage.error(error.message)
      }

      return Promise.reject(error)
    }
  )
}


// ========================
// 创建主 API 实例
// ========================
const service = axios.create({
  baseURL,
  timeout: 15000
})
registerInterceptors(service)


// ========================
// 创建上传接口实例
// ========================
const uploadService = axios.create({
  baseURL: uploadBaseUrl,
  timeout: 30000
})
registerInterceptors(uploadService)


// ========================
// 封装常用请求方法
// ========================
export function get(url, params) {
  return service({
    url,
    method: 'get',
    params
  })
}

export function uploadGet(url, params) {
  return uploadService({
    url,
    method: 'get',
    params
  })
}

export function post(url, data, isMultipart = false) {
  return service({
    url,
    method: 'post',
    data,
    isMultipart
  })
}

export function uploadPost(url, data, isMultipart = false) {
  return uploadService({
    url,
    method: 'post',
    data,
    isMultipart
  })
}

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

export function del(url, params) {
  return service({
    url,
    method: 'delete',
    params
  })
}




// ========================
// 上传接口封装
// ========================
export function uploadFile(url, data) {
  const formData = new FormData()
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      formData.append(key, data[key])
    }
  }
  return uploadService.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}


// ========================
// 默认导出
// ========================
export default service
export { uploadService }
