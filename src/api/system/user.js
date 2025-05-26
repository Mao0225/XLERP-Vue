import { post, get ,put , del} from '@/utils/request'

/**
 * 获取分页用户列表
 * @param {Object} params - 分页和搜索参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页大小
 * @param {string} [params.username] - 用户名搜索关键字
 * @returns {Promise} - 返回用户列表Promise
 */
export function getUsers(params) {
  return get('/user/getpage', params)
}

/**
 * 根据ID获取用户
 * @param {Object} params - 查询参数
 * @param {number} params.id - 用户ID
 * @returns {Promise} - 返回用户信息Promise
 */
export function getUserById(params) {
  return get('/user/get', params)
}

/**
 * 创建用户
 * @param {Object} data - 用户信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} - 返回创建结果Promise
 */
export function createUser(data) {
  return post('/user/save', data)
}

/**
 * 更新用户
 * @param {Object} data - 用户信息
 * @param {number} data.id - 用户ID
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} - 返回更新结果Promise
 */
export function updateUser(data) {
  return put('/user/update', data)
}

/**
 * 删除用户
 * @param {Object} params - 删除参数
 * @param {number} params.id - 用户ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteUser(params) {
  return del('/user/delete', params)
}


/**修改密码
 * @param {Object} data - 用户信息
 * @param {number} data.id - 用户ID
 * @param {string} data.oldPassword - 密码
 * @param {string} data.newPassword - 密码
 * @returns {Promise} - 返回更新结果Promise
 */

export function changePassword(data) {
  return get('/user/changePassword', data)
}