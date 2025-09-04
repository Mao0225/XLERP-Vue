import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页辅材（紧固件、预绞丝）数据列表
 */
export function getNzxjLc(params) {
  return get('/clnzxjLc/getpage', params)
}

/**
 * 根据ID获取辅材（紧固件、预绞丝）数据
 * @param {Object} params - 查询参数
 * @param {number} params.id - 辅材（紧固件、预绞丝）ID
 * @returns {Promise} - 返回物料信息Promise
 */
export function getNzxjLcById(params) {
  return get('/clnzxjLc/get', params)
}

export function createNzxjLc(data) {
  return post('/clnzxjLc/save', data)
}

export function updateNzxjLc(data) {
  return put('/clnzxjLc/update', data)
}

/**
 * 删除辅材（紧固件、预绞丝）数据
 * @param {Object} params - 删除参数
 * @param {number} params.id - 辅材（紧固件、预绞丝）ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteNzxjLc(params) {
  return del('/clnzxjLc/delete', params)
}





/**
 * 获取生产工单号列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.woNo - 生产工单号号
 * @returns {Promise} - 返回生产工单号号列表Promise
 */
export function getWoNoList(params) {
  return get('/clnzxjLc/getWoNoList', params);
}


// 新增：获取单据号
export function getBasNo(basname) {
  return get('/Basno/getNewNoNyName', { basname })
}