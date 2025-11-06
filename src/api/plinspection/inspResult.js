import { post, get, put, del } from '@/utils/request'

/**
 * 保存检验数据单条
 * @param {Object} data - 检验项数据 (PlInspItem 实体)
 * @returns {Promise} - 返回创建结果Promise
 */
export function saveInspResult(data) {
  return post('/insp_result/save', data)
}

/**
 * 更新检验数据单条
 * @param {Object} data - 检验项数据 (PlInspItem 实体)
 * @returns {Promise} - 返回更新结果Promise
 */
export function updateInspResult(data) {
  return put('/insp_result/update', data)
}


/**
 * 根据orderId获取检验项
 * @param {Object} params - 查询参数
 * @param {number} params.orderId - 检验单ID
 */
export function getInspResultByOrderId(params) {
  return get('/insp_result/getResultByOrderId', params)
}


/**
 * 删除检验记录
 * @param {Object} params - 删除参数
 */
export function deleteInspResult(params) {
  return del('/insp_result/delete', params)
}