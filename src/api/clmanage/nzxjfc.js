import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页辅材（紧固件）数据列表
 */
export function getNzxjFc(params) {
  return get('/clnzxjFc/getpage', params)
}

/**
 * 根据ID获取辅材（紧固件）数据
 * @param {Object} params - 查询参数
 * @param {number} params.id - 辅材（紧固件）ID
 * @returns {Promise} - 返回物料信息Promise
 */
export function getNzxjFcById(params) {
  return get('/clnzxjFc/get', params)
}

export function createNzxjFc(data) {
  return post('/clnzxjFc/save', data)
}

export function updateNzxjFc(data) {
  return put('/clnzxjFc/update', data)
}

/**
 * 删除辅材（紧固件）数据
 * @param {Object} params - 删除参数
 * @param {number} params.id - 辅材（紧固件）ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteNzxjFc(params) {
  return del('/clnzxjFc/delete', params)
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
  return get('/clnzxjFc/getWoNoList', params);
}