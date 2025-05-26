import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页物料列表
 */
export function getBasItems(params) {
  return get('/basitem/getpage', params)
}

/**
 * 根据ID获取物料
 * @param {Object} params - 查询参数
 * @param {number} params.id - 物料ID
 * @returns {Promise} - 返回物料信息Promise
 */
export function getBasItemById(params) {
  return get('/basitem/get', params)
}


export function createBasItem(data) {
  return post('/basitem/save', data)
}


export function updateBasItem(data) {
  return put('/basitem/update', data)
}

/**
 * 删除物料
 * @param {Object} params - 删除参数
 * @param {number} params.id - 物料ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteBasItem(params) {
  return del('/basitem/delete', params)
}