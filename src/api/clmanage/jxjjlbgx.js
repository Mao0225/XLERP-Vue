import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页铝包钢线数据列表
 */
export function getJxjjLbgx(params) {
  return get('/cljxjjLbgx/getpage', params)
}

/**
 * 根据ID获取铝包钢线数据
 * @param {Object} params - 查询参数
 * @param {number} params.id - 铝包钢线ID
 * @returns {Promise} - 返回物料信息Promise
 */
export function getJxjjLbgxById(params) {
  return get('/cljxjjLbgx/get', params)
}

export function createJxjjLbgx(data) {
  return post('/cljxjjLbgx/save', data)
}

export function updateJxjjLbgx(data) {
  return put('/cljxjjLbgx/update', data)
}

/**
 * 删除铝包钢线数据
 * @param {Object} params - 删除参数
 * @param {number} params.id - 铝包钢线ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteJxjjLbgx(params) {
  return del('/cljxjjLbgx/delete', params)
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
  return get('/cljxjjLbgx/getWoNoList', params);
}


// 新增：获取单据号
export function getBasNo(basname) {
  return get('/Basno/getNewNoNyName', { basname })
}