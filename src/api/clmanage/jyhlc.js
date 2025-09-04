import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页铝材（主体铝管）数据列表
 */
export function getJyhLc(params) {
  return get('/cljyhLc/getpage', params)
}

/**
 * 根据ID获取铝材（主体铝管）数据
 * @param {Object} params - 查询参数
 * @param {number} params.id - 铝材（主体铝管）ID
 * @returns {Promise} - 返回物料信息Promise
 */
export function getJyhLcById(params) {
  return get('/cljyhLc/get', params)
}

export function createJyhLc(data) {
  return post('/cljyhLc/save', data)
}

export function updateJyhLc(data) {
  return put('/cljyhLc/update', data)
}

/**
 * 删除铝材（主体铝管）数据
 * @param {Object} params - 删除参数
 * @param {number} params.id - 铝材（主体铝管）ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteJyhLc(params) {
  return del('/cljyhLc/delete', params)
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
  return get('/cljyhLc/getWoNoList', params);
}


// 新增：获取单据号
export function getBasNo(basname) {
  return get('/Basno/getNewNoNyName', { basname })
}
