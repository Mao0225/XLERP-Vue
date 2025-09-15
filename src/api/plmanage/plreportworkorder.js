import { post, get, put, del } from '@/utils/request'

/**

获取分页报工单列表
*/
export function getPlReportWorkOrderList (params) {
return get ('/pl_report_work_order/getpage', params)
}

/**

根据 ID 获取报工单
@param {Object} params - 查询参数
@param {number} params.id - 报工单 ID
@returns {Promise} - 返回报工单信息 Promise
*/
export function getPlReportWorkOrderById (params) {
return get ('/pl_report_work_order/get', params)
}

/**

创建报工单
@param {Object} data - 报工单数据
@returns {Promise} - 返回创建结果 Promise
*/
export function createPlReportWorkOrder (data) {
return post ('/pl_report_work_order/save', data)
}

/**

更新报工单
@param {Object} data - 报工单数据
@returns {Promise} - 返回更新结果 Promise
*/
export function updatePlReportWorkOrder (data) {
return put ('/pl_report_work_order/update', data)
}

/**

删除报工单
@param {Object} params - 删除参数
@param {number} params.id - 报工单 ID
@returns {Promise} - 返回删除结果 Promise
*/
export function deletePlReportWorkOrder (params) {
return del ('/pl_report_work_order/delete', params)
}

/**

批量删除报工单
@param {Array<number>} ids - 报工单 ID 数组
@returns {Promise} - 返回删除结果 Promise
*/
export function batchDeletePlReportWorkOrder (ids) {
const idsString = ids.join (',')
return del (`/pl_report_work_order/batchdelete?ids=${encodeURIComponent(idsString)}`)
}


/**
 * 更新状态
 * @param {Object} data - 更新数据
 */
export function updateStatus (data) {
return get ('/pl_report_work_order/updateStatus', data)
}