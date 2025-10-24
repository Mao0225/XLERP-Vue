import { post, get, put, del } from '@/utils/request'

/**

获取分页生产订单列表
*/
export function getPlProductionOrderList (params) {
return get ('/pl_production_order/getpage', params)
}

/**

根据 ID 获取生产订单
@param {Object} params - 查询参数
@param {number} params.id - 生产订单 ID
@returns {Promise} - 返回生产订单信息 Promise
*/
export function getPlProductionOrderById (params) {
return get ('/pl_production_order/get', params)
}

/**

创建生产订单
@param {Object} data - 生产订单数据
@returns {Promise} - 返回创建结果 Promise
*/
export function createPlProductionOrder (data) {
return post ('/pl_production_order/save', data)
}

/**

更新生产订单
@param {Object} data - 生产订单数据
@returns {Promise} - 返回更新结果 Promise
*/
export function updatePlProductionOrder (data) {
return put ('/pl_production_order/update', data)
}

/**

删除生产订单
@param {Object} params - 删除参数
@param {number} params.id - 生产订单 ID
@returns {Promise} - 返回删除结果 Promise
*/
export function deletePlProductionOrder (params) {
return del ('/pl_production_order/delete', params)
}

/**

批量删除生产订单
@param {Array<number>} ids - 生产订单 ID 数组
@returns {Promise} - 返回删除结果 Promise
*/
export function batchDeletePlProductionOrder (ids) {
const idsString = ids.join (',')
return del (`/pl_production_order/batchdelete?ids=${encodeURIComponent(idsString)}`)
}

/**
 * 获取确认后的生产订单列表
 * @param {Object} params - 查询参数
 */
export function getConfirmOrderList (params) {
return get ('/pl_production_order/getConfirmedList', params)
}
/**
 * 更新订单状态
 * @param {Object} data - 更新数据
 */
export function updateOrderStatus (data) {
return get ('/pl_production_order/updateStatus', data)
}

/**
 * 根据排产计划号获取关联的订单列表
 * @param {Object} params - 查询参数
 * @param {string} params.scheduleCode - 排产计划号
 */
export function getOrderListByScheduleCode (params) {
return get ('/pl_production_order/getListByScheduleCode', params)
}


/**
 * 获取生产订单ipoBatchNo批次号分组列表
 * @param {Object} params - 查询参数
 */
export function getBatchNoList (params) {
return get ('/pl_production_order/getBatchNoList', params)
}


/**
 * 获取生产订单的物料列表通过合同号或者批次号或者排产计划号筛选
 * @param {Object} params - 获取参数
 */
export function getListAll (params) {
return get ('/pl_production_order/getListAll', params)
}