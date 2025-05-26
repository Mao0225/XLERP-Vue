import { get,post,del,put } from '@/utils/request'

/**
 * 获取分页部门列表
 * @param {Object} params - 分页参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页大小
 * @returns {Promise} - 返回部门列表Promise
 */
export function getBasDepartments(params) {
  return get('/basdepartment/getpage', params)
}

/**
 * 根据ID获取部门
 * @param {Object} params - 查询参数
 * @param {number} params.id - 部门ID
 * @returns {Promise} - 返回部门信息Promise
 */
export function getBasDepartmentById(params) {
  return get('/basdepartment/get', params)
}

/**
 * 创建部门
 * @param {Object} data - 部门信息
 * @param {string} data.no - 部门编号
 * @param {string} data.name - 部门名称
 * @param {string} data.memo - 备注信息
 * @param {number} data.flag - 标志位
 * @param {string} data.type - 部门类型
 * @param {number} data.status - 状态 (0正常, -1删除)
 * @returns {Promise} - 返回创建结果Promise
 */
export function createBasDepartment(data) {
  return post('/basdepartment/save', data)
}

/**
 * 更新部门
 * @param {Object} data - 部门信息
 * @param {number} data.id - 部门ID
 * @param {string} data.no - 部门编号
 * @param {string} data.name - 部门名称
 * @param {string} data.memo - 备注信息
 * @param {number} data.flag - 标志位
 * @param {string} data.type - 部门类型
 * @param {number} data.status - 状态 (0正常, -1删除)
 * @returns {Promise} - 返回更新结果Promise
 */
export function updateBasDepartment(data) {
  return put('/basdepartment/update', data)
}

/**
 * 删除部门
 * @param {Object} params - 删除参数
 * @param {number} params.id - 部门ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteBasDepartment(params) {
  return del('/basdepartment/delete', params)
}

/**
 * 获取部门选项列表
 * @returns {Promise} - 返回包含部门id和名称的选项列表Promise
 */
export function getBasDepartmentOptions() {
  return get('/basdepartment/getoption')
}