import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页实物列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.purchaserHqCode - 采购商总部编码
 * @param {string} params.supplierCode - 供应商编码
 * @param {string} params.supplierName - 供应商名称
 * @param {string} params.entityCode - 实物编码
 * @param {string} params.poItemId - PO项ID
 * @param {string} params.entityStatus - 实物状态
 * @param {string} params.dataSource - 数据来源
 * @param {string} params.dataSourceCreateTime - 数据源创建时间
 * @param {string} params.remark - 备注
 * @param {string} params.ownerId - 所有者ID
 * @param {string} params.openId - 开放ID
 * @param {string} params.status - 状态
 * @param {string} params.flag - 标志
 * @returns {Promise} - 返回分页数据Promise
 */
export function getPlentityIds(params) {
  return get('/plentityid/getpage', params)
}

/**
 * 根据ID获取实物详情
 * @param {Object} params - 查询参数
 * @param {number} params.id - 实物ID
 * @returns {Promise} - 返回实物信息Promise
 */
export function getPlentityIdById(params) {
  return get('/plentityid/get', params)
}

/**
 * 创建实物
 * @param {Object} data - 实物数据
 * @returns {Promise} - 返回创建结果Promise
 */
export function createPlentityId(data) {
  return post('/plentityid/save', data)
}

/**
 * 更新实物
 * @param {Object} data - 实物数据
 * @returns {Promise} - 返回更新结果Promise
 */
export function updatePlentityId(data) {
  return put('/plentityid/update', data)
}

/**
 * 删除实物
 * @param {Object} params - 删除参数
 * @param {number} params.id - 实物ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deletePlentityId(params) {
  return del('/plentityid/delete', params)
}