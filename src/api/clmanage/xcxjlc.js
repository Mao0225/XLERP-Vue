import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页铝材（本体铝材）数据列表
 */
export function getXcxjLc(params) {
  return get('/clxcxjLc/getpage', params)
}

/**
 * 根据ID获取铝材（本体铝材）数据
 * @param {Object} params - 查询参数
 * @param {number} params.id - 铝材（本体铝材）ID
 * @returns {Promise} - 返回物料信息Promise
 */
export function getXcxjLcById(params) {
  return get('/clxcxjLc/get', params)
}

export function createXcxjLc(data) {
  return post('/clxcxjLc/save', data)
}

export function updateXcxjLc(data) {
  return put('/clxcxjLc/update', data)
}

/**
 * 删除铝材（本体铝材）数据采集
 * @param {Object} params - 删除参数
 * @param {number} params.id - 铝材（本体铝材）ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteXcxjLc(params) {
  return del('/clxcxjLc/delete', params)
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
  return get('/clxcxjLc/getWoNoList', params);
}

