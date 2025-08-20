import { post, get, put, del } from '@/utils/request'

// ==================== 出厂抽检检验相关接口 ====================

/**
 * 获取分页出厂抽检检验列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.guowanghetonghao - 国网合同号
 * @param {string} params.spotcheckbatch - 抽检批次号
 * @returns {Promise} - 返回分页数据 Promise
 */
export function getchuchangchoujianlist(params) {
  return get('/plchuchangchoujian/getchuchangchoujianlist', params)
}

/**
 * 根据 ID 获取出厂抽检检验记录
 * @param {Object} params - 查询参数
 * @param {number} params.id - 记录 ID
 * @returns {Promise} - 返回记录信息 Promise
 */
export function getchuchangchoujianById(params) {
  return get('/plchuchangchoujian/get', params)
}

/**
 * 创建出厂抽检检验记录
 * @param {Object} data - 记录数据
 * @returns {Promise} - 返回创建结果 Promise
 */
export function addchuchangchoujian(data) {
  return post('/plchuchangchoujian/save', data)
}

/**
 * 更新出厂抽检检验记录
 * @param {Object} data - 记录数据
 * @returns {Promise} - 返回更新结果 Promise
 */
export function updatechuchangchoujian(data) {
  return put('/plchuchangchoujian/update', data)
}

/**
 * 删除出厂抽检检验记录
 * @param {Object} params - 删除参数
 * @param {number} params.id - 记录 ID
 * @returns {Promise} - 返回删除结果 Promise
 */
export function deletechuchangchoujian(params) {
  return del('/plchuchangchoujian/delete', params)
}

/**
 * 批量删除出厂抽检检验记录
 * @param {Array} ids - 记录 ID 数组
 * @returns {Promise} - 返回删除结果 Promise
 */
export function batchDeletechuchangchoujian(ids) {
  const idsString = ids.join(',')
  return del(`/plchuchangchoujian/batchdelete?ids=${encodeURIComponent(idsString)}`)
}