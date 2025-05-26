import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页用户列表
 */
export function getHruserList(params) {
  return get('/hruser/getpage', params)
}

/**
 * 根据ID获取用户信息
 */
export function getHruserById(params) {
  return get('/hruser/get', params)
}

/**
 * 保存用户信息
 */
export function saveHruser(data) {
  return post('/hruser/save', data)
}

/**
 * 更新用户信息
 */
export function updateHruser(data) {
  return put('/hruser/update', data)
}

/**
 * 删除用户信息
 */
export function deleteHruser(params) {
  return del('/hruser/delete', params)
}
