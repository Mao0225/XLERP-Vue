import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页出入库记录列表
 */
export function getPlinoutstoreList(params) {
  return get('/plinoutstore/getpage', params)
}

/**
 * 根据 ID 获取出入库记录
 * @param {Object} params - 查询参数
 * @param {number} params.id - 出入库记录 ID
 * @returns {Promise} - 返回出入库记录信息 Promise
 */
export function getPlinoutstoreById(params) {
  return get('/plinoutstore/get', params)
}

/**
 * 创建出入库记录
 * @param {Object} data - 出入库记录数据
 * @returns {Promise} - 返回创建结果 Promise
 */
export function createPlinoutstore(data) {
  return post('/plinoutstore/save', data)
}

/**
 * 更新出入库记录
 * @param {Object} data - 出入库记录数据
 * @returns {Promise} - 返回更新结果 Promise
 */
export function updatePlinoutstore(data) {
  return put('/plinoutstore/update', data)
}

/**
 * 删除出入库记录
 * @param {Object} params - 删除参数
 * @param {number} params.id - 出入库记录 ID
 * @returns {Promise} - 返回删除结果 Promise
 */
export function deletePlinoutstore(params) {
  return del('/plinoutstore/delete', params)
}

/**
 * 批量删除出入库记录
 * @param {Array<number>} ids - 出入库记录ID数组
 * @returns {Promise} - 返回删除结果 Promise
 */
export function batchDeletePlinoutstore(ids) {
  const idsString = ids.join(',')
  return del(`/plinoutstore/batchdelete?ids=${encodeURIComponent(idsString)}`)
}