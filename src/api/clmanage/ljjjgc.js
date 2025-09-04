import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页钢材（钢板、圆钢）数据列表
 */
export function getLjjjGc(params) {
  return get('/clljjjGc/getpage', params)
}

/**
 * 根据ID获取钢材（钢板、圆钢）数据
 * @param {Object} params - 查询参数
 * @param {number} params.id - 钢材（钢板、圆钢）ID
 * @returns {Promise} - 返回物料信息Promise
 */
export function getLjjjGcById(params) {
  return get('/clljjjGc/get', params)
}

export function createLjjjGc(data) {
  return post('/clljjjGc/save', data)
}

export function updateLjjjGc(data) {
  return put('/clljjjGc/update', data)
}

/**
 * 删除钢材（钢板、圆钢）数据
 * @param {Object} params - 删除参数
 * @param {number} params.id - 钢材（钢板、圆钢）ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteLjjjGc(params) {
  return del('/clljjjGc/delete', params)
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
  return get('/cljjjGc/getWoNoList', params);
}

// 新增：获取单据号
export function getBasNo(basname) {
  return get('/Basno/getNewNoNyName', { basname })
}