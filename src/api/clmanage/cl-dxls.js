import { post, get, put, del } from '@/utils/request'

/**
 * 1. 分页查询镀锌螺栓数据
 * @param {Object} params - 查询参数
 * @param {string|number} [params.pageNumber=1] - 页码（默认1，需为正整数）
 * @param {string|number} [params.pageSize=10] - 每页大小（默认10，需为正整数）
 * @returns {Promise<Object>} - 响应结果（含page分页对象，内有镀锌螺栓列表和分页信息）
 */
export function getDxlsPage(params) {
  return get('/cl_dxls/getpage', params)
}

/**
 * 2. 根据ID查询单个镀锌螺栓记录
 * @param {Object} params - 查询参数
 * @param {number} params.id - 镀锌螺栓记录ID（必传，需为有效数字）
 * @returns {Promise<Object>} - 响应结果（含record字段，存储单个镀锌螺栓详情）
 */
export function getDxlsById(params) {
  return get('/cl_dxls/get', params)
}

/**
 * 3. 新增镀锌螺栓记录
 * @param {Object} data - 镀锌螺栓新增数据（需匹配ClDxls模型字段，如matRecheckNo、mafactory等）
 * @returns {Promise<Object>} - 响应结果（含recordId字段，返回新增记录的ID）
 */
export function createDxls(data) {
  return post('/cl_dxls/save', data)
}

/**
 * 4. 更新镀锌螺栓记录
 * @param {Object} data - 镀锌螺栓更新数据（需包含id字段标识待更新记录，及其他需修改的字段）
 * @returns {Promise<Object>} - 响应结果（仅返回操作状态，无额外数据）
 */
export function updateDxls(data) {
  return put('/cl_dxls/update', data)
}

/**
 * 5. 根据ID删除单个镀锌螺栓记录
 * @param {Object} params - 删除参数
 * @param {number} params.id - 镀锌螺栓记录ID（必传，需为有效数字）
 * @returns {Promise<Object>} - 响应结果（仅返回删除操作状态）
 */
export function deleteDxls(params) {
  return del('/cl_dxls/delete', params)
}

/**
 * 6. 批量删除镀锌螺栓记录
 * @param {Object} params - 批量删除参数
 * @param {string} params.ids - 镀锌螺栓记录ID列表（必传，格式为"1,2,3"的字符串，需排除空值）
 * @returns {Promise<Object>} - 响应结果（仅返回批量删除操作状态）
 */
export function batchDeleteDxls(params) {
  return del('/cl_dxls/batchdelete', params)
}

/**
 * 7.更新状态
 * @param {Object} data - 更新状态数据（需包含id字段标识待更新记录，及status字段，updatePeson字段）
 */
export function updateStatus(data) {
  return get('/cl_dxls/updateStatus', data)
}