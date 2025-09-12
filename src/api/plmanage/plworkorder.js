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