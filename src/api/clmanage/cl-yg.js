import { post, get, put, del } from '@/utils/request'

/**
 * 1. 分页查询圆钢数据
 * @param {Object} params - 查询参数
 * @param {string|number} [params.pageNumber=1] - 页码（默认1，需为正整数）
 * @param {string|number} [params.pageSize=10] - 每页大小（默认10，需为正整数）
 * @returns {Promise<Object>} - 响应结果（含page分页对象，内有圆钢列表和分页信息）
 */
export function getYgPage(params) {
  return get('/cl_yg/getpage', params)
}

/**
 * 2. 根据ID查询单个圆钢记录
 * @param {Object} params - 查询参数
 * @param {number} params.id - 圆钢记录ID（必传，需为有效数字）
 * @returns {Promise<Object>} - 响应结果（含record字段，存储单个圆钢详情）
 */
export function getYgById(params) {
  return get('/cl_yg/get', params)
}

/**
 * 3. 新增圆钢记录
 * @param {Object} data - 圆钢新增数据（需匹配ClLd模型字段，如matRecheckNo、mafactory等）
 * @returns {Promise<Object>} - 响应结果（含recordId字段，返回新增记录的ID）
 */
export function createYg(data) {
  return post('/cl_yg/save', data)
}

/**
 * 4. 更新圆钢记录
 * @param {Object} data - 圆钢更新数据（需包含id字段标识待更新记录，及其他需修改的字段）
 * @returns {Promise<Object>} - 响应结果（仅返回操作状态，无额外数据）
 */
export function updateYg(data) {
  return put('/cl_yg/update', data)
}

/**
 * 5. 根据ID删除单个圆钢记录
 * @param {Object} params - 删除参数
 * @param {number} params.id - 圆钢记录ID（必传，需为有效数字）
 * @returns {Promise<Object>} - 响应结果（仅返回删除操作状态）
 */
export function deleteYg(params) {
  return del('/cl_yg/delete', params)
}

/**
 * 6. 批量删除圆钢记录
 * @param {Object} params - 批量删除参数
 * @param {string} params.ids - 圆钢记录ID列表（必传，格式为"1,2,3"的字符串，需排除空值）
 * @returns {Promise<Object>} - 响应结果（仅返回批量删除操作状态）
 */
export function batchDeleteYg(params) {
  return del('/cl_yg/batchdelete', params)
}

/**
 * 7.更新状态
 * @param {Object} data - 更新状态数据（需包含id字段标识待更新记录，及status字段，updatePeson字段）
 */
export function updateStatus(data) {
  return get('/cl_yg/updateStatus', data)
}