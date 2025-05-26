import { post, get } from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} - 返回登录结果Promise
 */
export function login(data) {
  return get('/login/login', data)
}
