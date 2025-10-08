import { post, get, put, del } from '@/utils/request'

/**
 * 1. 分页查询铜板数据
 * @param {Object} params - 查询参数
 * @param {string|number} [params.pageNumber=1] - 页码（默认1，需为正整数）
 * @param {string|number} [params.pageSize=10] - 每页大小（默认10，需为正整数）
 * @returns {Promise<Object>} - 响应结果（含page分页对象，内有铜板列表和分页信息）
 */
export function getTbPage(params) {
  return get('/cl_tb/getpage', params)
}

/**
 * 2. 根据ID查询单个铜板记录
 * @param {Object} params - 查询参数
 * @param {number} params.id - 铜板记录ID（必传，需为有效数字）
 * @returns {Promise<Object>} - 响应结果（含record字段，存储单个铜板详情）
 */
export function getTbById(params) {
  return get('/cl_tb/get', params)
}

/**
 * 3. 新增铜板记录
 * @param {Object} data - 铜板新增数据（需匹配ClTb模型字段，如matRecheckNo、mafactory等）
 * @returns {Promise<Object>} - 响应结果（含recordId字段，返回新增记录的ID）
 */
export function createTb(data) {
  return post('/cl_tb/save', data)
}

/**
 * 4. 更新铜板记录
 * @param {Object} data - 铜板更新数据（需包含id字段标识待更新记录，及其他需修改的字段）
 * @returns {Promise<Object>} - 响应结果（仅返回操作状态，无额外数据）
 */
export function updateTb(data) {
  return put('/cl_tb/update', data)
}

/**
 * 5. 根据ID删除单个铜板记录
 * @param {Object} params - 删除参数
 * @param {number} params.id - 铜板记录ID（必传，需为有效数字）
 * @returns {Promise<Object>} - 响应结果（仅返回删除操作状态）
 */
export function deleteTb(params) {
  return del('/cl_tb/delete', params)
}

/**
 * 6. 批量删除铜板记录
 * @param {Object} params - 批量删除参数
 * @param {string} params.ids - 铜板记录ID列表（必传，格式为"1,2,3"的字符串，需排除空值）
 * @returns {Promise<Object>} - 响应结果（仅返回批量删除操作状态）
 */
export function batchDeleteTb(params) {
  return del('/cl_tb/batchdelete', params)
}

/**
 * 7.更新状态
 * @param {Object} data - 更新状态数据（需包含id字段标识待更新记录，及status字段，updatePeson字段）
 */
export function updateStatus(data) {
  return get('/cl_tb/updateStatus', data)
}