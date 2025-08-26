import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页生产订单列表
 * @param {Object} params - 查询参数
 * @param {number} [params.pageNumber=1] - 页码
 * @param {number} [params.pageSize=10] - 每页大小
 * @param {string} [params.ipoNo] - 生产订单号
 * @returns {Promise} - 返回分页数据 Promise
 */
export function getPlshengchandingdanList(params) {
  return get('/plshengchandingdan/getpage', params)
}



/**
 * 获取分页生产订单列表----根据登录人员的部门
 * @param {Object} params - 查询参数
 * @param {number} [params.pageNumber=1] - 页码
 * @param {number} [params.pageSize=10] - 每页大小
 * @param {string} [params.ipoNo] - 生产订单号
 * @param {string} [params.depNo] - 部门ID
 * @returns {Promise} - 返回分页数据 Promise
 */
export function getPlshengchandingdanListByDepNo(params) {
  return get('/plshengchandingdan/getpageByDepNo', params)
}

/**
 * 根据 ID 获取生产订单
 * @param {Object} params - 查询参数
 * @param {number} params.id - 生产订单 ID
 * @returns {Promise} - 返回生产订单信息 Promise
 */
export function getPlshengchandingdanById(params) {
  return get('/plshengchandingdan/get', params)
}

/**
 * 创建生产订单
 * @param {Object} data - 生产订单数据
 * @returns {Promise} - 返回创建结果 Promise
 */
export function createPlshengchandingdan(data) {
  return post('/plshengchandingdan/save', data)
}

/**
 * 更新生产订单
 * @param {Object} data - 生产订单数据
 * @returns {Promise} - 返回更新结果 Promise
 */
export function updatePlshengchandingdan(data) {
  return put('/plshengchandingdan/update', data)
}

/**
 * 删除生产订单
 * @param {Object} params - 删除参数
 * @param {number} params.id - 生产订单 ID
 * @returns {Promise} - 返回删除结果 Promise
 */
export function deletePlshengchandingdan(params) {
  return del('/plshengchandingdan/delete', params)
}

/**
 * 批量删除生产订单
 * @param {Array<number>} ids - 生产订单 ID 数组
 * @returns {Promise} - 返回删除结果 Promise
 */
export function batchDeletePlshengchandingdan(ids) {
  const idsString = ids.join(',')
  return del(`/plshengchandingdan/batchdelete?ids=${encodeURIComponent(idsString)}`)
}

/**
 * 获取生产订单关联的产品列表
 * @param {Object} params - 查询参数
 * @param {string} params.ipoNo - 生产订单号
 * @returns {Promise} - 返回产品列表 Promise
 */
export function getDingdanItemList(params) {
  return get('/plshengchandingdan/item/getList', params)
}


/**
 * 获取生产订单关联的产品列表--根据登录人员部门
 * @param {Object} params - 查询参数
 * @param {string} params.ipoNo - 生产订单号
 * @param {string} params.depNo - 部门编号
 * @returns {Promise} - 返回产品列表 Promise
 */
export function getDingdanItemListByDepNo(params) {
  return get('/plshengchandingdan/item/getListByDepNo', params)
}

/**
 * 保存生产订单关联的产品
 * @param {Object} data - 产品数据
 * @returns {Promise} - 返回保存结果 Promise
 */
export function saveDingdanItem(data) {
  return post('/plshengchandingdan/item/save', data)
}

/**
 * 更新生产订单关联的产品
 * @param {Object} data - 产品数据
 * @returns {Promise} - 返回更新结果 Promise
 */
export function updateDingdanItem(data) {
  return put('/plshengchandingdan/item/update', data)
}

/**
 * 删除生产订单关联的产品
 * @param {Object} params - 删除参数
 * @param {number} params.id - 产品 ID
 * @returns {Promise} - 返回删除结果 Promise
 */
export function deleteDingdanItem(params) {
  return del('/plshengchandingdan/item/delete', params)
}


/**
 * 获取合同物料分解订单和工单详情
 * @param {Object} params - 获取参数
 * @param {string} params.conItemId - 合同物料ID
 * @returns {Promise} - 获取结果 Promise
 */
export function getItemCountDetail(params) {
  return get('/plshengchandingdan/getItemCount', params)
}


