import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页铝材（铝管、铝合金管）数据列表
 */
export function getJxjjLc(params) {
  return get('/cljxjjLc/getpage', params)
}

/**
 * 根据ID获取铝材（铝管、铝合金管）数据
 * @param {Object} params - 查询参数
 * @param {number} params.id - 铝材（铝管、铝合金管）ID
 * @returns {Promise} - 返回物料信息Promise
 */
export function getJxjjLcById(params) {
  return get('/cljxjjLc/get', params)
}

export function createJxjjLc(data) {
  return post('/cljxjjLc/save', data)
}

export function updateJxjjLc(data) {
  return put('/cljxjjLc/update', data)
}

/**
 * 删除铝材（铝管、铝合金管）数据
 * @param {Object} params - 删除参数
 * @param {number} params.id - 铝材（铝管、铝合金管）ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteJxjjLc(params) {
  return del('/cljxjjLc/delete', params)
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
  return get('/cljxjjLc/getWoNoList', params);
}