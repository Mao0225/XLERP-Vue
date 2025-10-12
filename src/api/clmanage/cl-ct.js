import { post, get, put, del } from '@/utils/request'

/**
 * 1. 分页查询锤头数据
 * @param {Object} params - 查询参数
 * @param {string|number} [params.pageNumber=1] - 页码（默认1，需为正整数）
 * @param {string|number} [params.pageSize=10] - 每页大小（默认10，需为正整数）
 * @returns {Promise<Object>} - 响应结果（含page分页对象，内有锤头列表和分页信息）
 */
export function getCtPage(params) {
  return get('/cl_ct/getpage', params)
}

/**
 * 2. 根据ID查询单个锤头记录
 * @param {Object} params - 查询参数
 * @param {number} params.id - 锤头记录ID（必传，需为有效数字）
 * @returns {Promise<Object>} - 响应结果（含record字段，存储单个锤头详情）
 */
export function getCtById(params) {
  return get('/cl_ct/get', params)
}

/**
 * 3. 新增锤头记录
 * @param {Object} data - 锤头新增数据（需匹配ClCt模型字段，如matRecheckNo、mafactory等）
 * @returns {Promise<Object>} - 响应结果（含recordId字段，返回新增记录的ID）
 */
export function createCt(data) {
  return post('/cl_ct/save', data)
}

/**
 * 4. 更新锤头记录
 * @param {Object} data - 锤头更新数据（需包含id字段标识待更新记录，及其他需修改的字段）
 * @returns {Promise<Object>} - 响应结果（仅返回操作状态，无额外数据）
 */
export function updateCt(data) {
  return put('/cl_ct/update', data)
}

/**
 * 5. 根据ID删除单个锤头记录
 * @param {Object} params - 删除参数
 * @param {number} params.id - 锤头记录ID（必传，需为有效数字）
 * @returns {Promise<Object>} - 响应结果（仅返回删除操作状态）
 */
export function deleteCt(params) {
  return del('/cl_ct/delete', params)
}

/**
 * 6. 批量删除锤头记录
 * @param {Object} params - 批量删除参数
 * @param {string} params.ids - 锤头记录ID列表（必传，格式为"1,2,3"的字符串，需排除空值）
 * @returns {Promise<Object>} - 响应结果（仅返回批量删除操作状态）
 */
export function batchDeleteCt(params) {
  return del('/cl_ct/batchdelete', params)
}

/**
 * 7.更新状态
 * @param {Object} data - 更新状态数据（需包含id字段标识待更新记录，及status字段，updatePeson字段）
 */
export function updateStatus(data) {
  return get('/cl_ct/updateStatus', data)
}