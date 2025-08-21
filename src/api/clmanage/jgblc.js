import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页铝材（框体、线夹和十字轴部分铝材）数据列表
 */
export function getJgbLc(params) {
  return get('/cljgbLc/getpage', params)
}

/**
 * 根据ID获取铝材（框体、线夹和十字轴部分铝材）数据
 * @param {Object} params - 查询参数
 * @param {number} params.id - 铝材（框体、线夹和十字轴部分铝材）ID
 * @returns {Promise} - 返回物料信息Promise
 */
export function getJgbLcById(params) {
  return get('/cljgbLc/get', params)
}

export function createJgbLc(data) {
  return post('/cljgbLc/save', data)
}

export function updateJgbLc(data) {
  return put('/cljgbLc/update', data)
}

/**
 * 删除铝材（框体、线夹和十字轴部分铝材）数据
 * @param {Object} params - 删除参数
 * @param {number} params.id - 铝材（框体、线夹和十字轴部分铝材）ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteJgbLc(params) {
  return del('/cljgbLc/delete', params)
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
  return get('/cljgbLc/getWoNoList', params);
}