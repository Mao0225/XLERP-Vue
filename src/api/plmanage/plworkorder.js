import { post, get, put, del } from '@/utils/request'

/**

获取分页生产工单列表
*/
export function getPlWorkOrderList (params) {
return get ('/pl_work_order/getpage', params)
}

/**

根据 ID 获取生产工单
@param {Object} params - 查询参数
@param {number} params.id - 生产工单 ID
@returns {Promise} - 返回生产工单信息 Promise
*/
export function getPlWorkOrderById (params) {
return get ('/pl_work_order/get', params)
}

/**

创建生产工单
@param {Object} data - 生产工单数据
@returns {Promise} - 返回创建结果 Promise
*/
export function createPlWorkOrder (data) {
return post ('/pl_work_order/save', data)
}

/**

更新生产工单
@param {Object} data - 生产工单数据
@returns {Promise} - 返回更新结果 Promise
*/
export function updatePlWorkOrder (data) {
return put ('/pl_work_order/update', data)
}

/**

删除生产工单
@param {Object} params - 删除参数
@param {number} params.id - 生产工单 ID
@returns {Promise} - 返回删除结果 Promise
*/
export function deletePlWorkOrder (params) {
return del ('/pl_work_order/delete', params)
}

/**

批量删除生产工单
@param {Array<number>} ids - 生产工单 ID 数组
@returns {Promise} - 返回删除结果 Promise
*/
export function batchDeletePlWorkOrder (ids) {
const idsString = ids.join (',')
return del (`/pl_work_order/batchdelete?ids=${encodeURIComponent(idsString)}`)
}


/**
 * 获取确认后的生产工单列表
 * @param {Object} params - 查询参数
 */
export function getConfirmOrderList (params) {
return get ('/pl_work_order/getConfirmedList', params)
}
/**
 * 更新状态
 * @param {Object} data - 更新数据
 */
export function updateOrderStatus (data) {
return get ('/pl_work_order/updateStatus', data)
}


/**
 * 根据生产订单号查询关联的工单
 * @param {Object} params - 查询参数
 * @param {string} params.ipoNo - 生产订单号
 */
export function getWorkOrderByIpoNo (params) {
return get ('/pl_work_order/getListByIpoNo', params)
}


/**
 * 传入物料id和生产订单号，生成所有需要生产的工单就是包括半成品，成品
 * @param {Object} params - 获取参数
 * @param {string} params.itemId - 主产品id
 * @param {string} params.amount - 主产品数量
 */
export function generatorWorkOrder (params) {
return get ('/pl_work_order/generateWorkOrder', params)
}


/**
 * 获取工单各个工序的完成情况
 */
export function getWorkOrderComplete (params) {
return get ('/pl_work_order/getWorkOrderComplete', params)
}