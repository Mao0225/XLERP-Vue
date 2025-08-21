import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页辅材（紧固件）数据列表
 */
export function getBgxjsbxjFc(params) {
  return get('/clbgxjsbxjFc/getpage', params)
}

/**
 * 根据ID获取辅材（紧固件）数据
 * @param {Object} params - 查询参数
 * @param {number} params.id - 辅材（紧固件）ID
 * @returns {Promise} - 返回物料信息Promise
 */
export function getBgxjsbxjFcById(params) {
  return get('/clbgxjsbxjFc/get', params)
}

export function createBgxjsbxjFc(data) {
  return post('/clbgxjsbxjFc/save', data)
}

export function updateBgxjsbxjFc(data) {
  return put('/clbgxjsbxjFc/update', data)
}

/**
 * 删除辅材（紧固件）数据
 * @param {Object} params - 删除参数
 * @param {number} params.id - 辅材（紧固件）ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteBgxjsbxjFc(params) {
  return del('/clbgxjsbxjFc/delete', params)
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
  return get('/clbgxjsbxjFc/getWoNoList', params);
}