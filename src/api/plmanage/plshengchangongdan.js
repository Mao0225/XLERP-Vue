import { post, get, put, del } from '@/utils/request'

// ==================== 生产工单相关接口 ====================

/**
 * 获取分页生产工单列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.woNo - 生产工单编码
 * @returns {Promise} - 返回分页数据 Promise
 */
export function getPlshengchangongdanList(params) {
  return get('/plshengchangongdan/getpage', params)
}

/**
 * 获取分页生产订单列表----根据登录人员的部门
 * @param {Object} params - 查询参数
 * @param {number} [params.pageNumber=1] - 页码
 * @param {number} [params.pageSize=10] - 每页大小
 * @param {string} params.woNo - 生产工单号
 * @param {string} [params.depNo] - 部门编号
 * @returns {Promise} - 返回分页数据 Promise
 */
export function getPlshengchangongdanListByDepNo(params) {
  return get('/plshengchangongdan/getpageByDepNo', params)
}

/**
 * 根据 ID 获取生产工单
 * @param {Object} params - 查询参数
 * @param {number} params.id - 生产工单 ID
 * @returns {Promise} - 返回生产工单信息 Promise
 */
export function getPlshengchangongdanById(params) {
  return get('/plshengchangongdan/get', params)
}

/**
 * 创建生产工单
 * @param {Object} data - 生产工单数据
 * @returns {Promise} - 返回创建结果 Promise
 */
export function createPlshengchangongdan(data) {
  return post('/plshengchangongdan/save', data)
}

/**
 * 更新生产工单
 * @param {Object} data - 生产工单数据
 * @returns {Promise} - 返回更新结果 Promise
 */
export function updatePlshengchangongdan(data) {
  return put('/plshengchangongdan/update', data)
}

/**
 * 删除生产工单
 * @param {Object} params - 删除参数
 * @param {number} params.id - 生产工单 ID
 * @returns {Promise} - 返回删除结果 Promise
 */
export function deletePlshengchangongdan(params) {
  return del('/plshengchangongdan/delete', params)
}

/**
 * 批量删除生产工单
 * @param {Array} ids - 生产工单 ID 数组
 * @returns {Promise} - 返回删除结果 Promise
 */
export function batchDeletePlshengchangongdan(ids) {
  const idsString = ids.join(',')
  return del(`/plshengchangongdan/batchdelete?ids=${encodeURIComponent(idsString)}`)
}

// ==================== 生产工单物料相关接口 ====================

/**
 * 获取生产工单关联的物料列表
 * @param {Object} params - 查询参数
 * @param {string} params.woNo - 生产工单号
 * @returns {Promise} - 返回物料列表 Promise
 */
export function getGongdanItemList(params) {
  return get('/plshengchangongdan/item/getList', params)
}

/**
 * 获取生产订单关联的产品列表--根据登录人员部门
 * @param {Object} params - 查询参数
 * @param {string} params.ipoNo - 生产订单号
 * @param {string} params.depNo - 部门编号
 * @returns {Promise} - 返回产品列表 Promise
 */
export function getGongdanItemListByDepNo(params) {
  return get('/plshengchangongdan/item/getListByDepNo', params)
}

/**
 * 保存生产工单物料
 * @param {Object} data - 物料数据
 * @returns {Promise} - 返回保存结果 Promise
 */
export function saveGongdanItem(data) {
  return post('/plshengchangongdan/item/save', data)
}

/**
 * 更新生产工单物料
 * @param {Object} data - 物料数据
 * @returns {Promise} - 返回更新结果 Promise
 */
export function updateGongdanItem(data) {
  return put('/plshengchangongdan/item/update', data)
}

/**
 * 删除生产工单物料
 * @param {Object} params - 删除参数
 * @param {number} params.id - 物料 ID
 * @returns {Promise} - 返回删除结果 Promise
 */
export function deleteGongdanItem(params) {
  return del('/plshengchangongdan/item/delete', params)
}