import { post, get, put, del } from '@/utils/request'

/**
 * 原材料出入库主表接口
 */

/**
 * 获取分页列表
 * @param {Object} params - 查询参数
 */
export function getPlMatInoutList(params) {
  return get('/pl_mat_inout/getpage', params)
}

/**
 * 根据 ID 获取单条记录
 * @param {Object} params - 查询参数
 * @param {number} params.id - 主表 ID
 */
export function getPlMatInoutById(params) {
  return get('/pl_mat_inout/get', params)
}

/**
 * 创建记录
 * @param {Object} data - 主表数据
 */
export function createPlMatInout(data) {
  return post('/pl_mat_inout/save', data)
}

/**
 * 更新记录
 * @param {Object} data - 主表数据
 */
export function updatePlMatInout(data) {
  return put('/pl_mat_inout/update', data)
}

/**
 * 删除记录
 * @param {Object} params - 删除参数
 * @param {number} params.id - 主表 ID
 */
export function deletePlMatInout(params) {
  return del('/pl_mat_inout/delete', params)
}

/**
 * 更新状态
 * @param {Object} data - 更新数据
 */
export function updatePlMatInoutStatus(data) {
  return get('/pl_mat_inout/updateStatus', data)
}

/**
 * 原材料出入库明细表接口
 */

/**
 * 获取分页列表
 * @param {Object} params - 查询参数
 */
export function getPlMatInoutItemList(params) {
  return get('/pl_mat_inout/item/getpage', params)
}

/**
 * 根据 ID 获取明细记录
 * @param {Object} params - 查询参数
 * @param {number} params.id - 明细 ID
 */
export function getPlMatInoutItemById(params) {
  return get('/pl_mat_inout/item/get', params)
}

/**
 * 增加明细记录
 * @param {Object} data - 明细数据
 */
export function createPlMatInoutItem(data) {
  return post('/pl_mat_inout/item/save', data)
}

/**
 * 更新明细记录
 * @param {Object} data - 明细数据
 */
export function updatePlMatInoutItem(data) {
  return put('/pl_mat_inout/item/update', data)
}

/**
 * 删除明细记录
 * @param {Object} params - 删除参数
 * @param {number} params.id - 明细 ID
 */
export function deletePlMatInoutItem(params) {
  return del('/pl_mat_inout/item/delete', params)
}
