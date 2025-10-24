//排产计划页面接口
import { post, get, put, del } from '@/utils/request'

/**

获取分页排产计划列表
*/
export function getPlSchedulePlanList (params) {
return get ('/pl_schedule_plan/getpage', params)
}

/**

根据 ID 获取排产计划
@param {Object} params - 查询参数
@param {number} params.id - 排产计划 ID
@returns {Promise} - 返回排产计划信息 Promise
*/
export function getPlSchedulePlanById (params) {
return get ('/pl_schedule_plan/get', params)
}

/**

创建排产计划
@param {Object} data - 排产计划数据
@returns {Promise} - 返回创建结果 Promise
*/
export function createPlSchedulePlan (data) {
return post ('/pl_schedule_plan/save', data)
}

/**

更新排产计划
@param {Object} data - 排产计划数据
@returns {Promise} - 返回更新结果 Promise
*/
export function updatePlSchedulePlan (data) {
return put ('/pl_schedule_plan/update', data)
}

/**

删除排产计划
@param {Object} params - 删除参数
@param {number} params.id - 排产计划 ID
@returns {Promise} - 返回删除结果 Promise
*/
export function deletePlSchedulePlan (params) {
return del ('/pl_schedule_plan/delete', params)
}

/**

批量删除排产计划
@param {Array<number>} ids - 排产计划 ID 数组
@returns {Promise} - 返回删除结果 Promise
*/
export function batchDeletePlSchedulePlan (ids) {
const idsString = ids.join (',')
return del (`/pl_schedule_plan/batchdelete?ids=${encodeURIComponent(idsString)}`)
}

/**
 * 更新排产计划状态
 * 
 */
export function updatePlanStatus (data) {
return get('/pl_schedule_plan/updateStatus', data)
}


/**
 * 更具合同号获取排产计划物料列表
 */
export function getPlSchedulePlanItemList (params) {
return get('/pl_schedule_plan/getContractItemList', params)
}