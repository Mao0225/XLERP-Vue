import { post, get, put, del } from '@/utils/request'

/**

获取分页排产计划列表
*/
export function getPlpaichanjihuaList (params) {
return get ('/plpaichanjihua/getpage', params)
}

/**

获取分页排产计划列表--根据登录用户部门编号
*/
export function getPlpaichanjihuaListByDepNo (params) {
return get ('/plpaichanjihua/getpageByDepNo', params)
}

/**

根据 ID 获取排产计划
@param {Object} params - 查询参数
@param {number} params.id - 排产计划 ID
@returns {Promise} - 返回排产计划信息 Promise
*/
export function getPlpaichanjihuaById (params) {
return get ('/plpaichanjihua/get', params)
}

/**
获取图纸信息根据图纸ID
@param {Object} params - 查询参数
@param {number} params.tuzhiId - 图纸ID
*/
export function getTuzhiInfo (params) {
return get ('/plpaichanjihua/getTuzhiInfo', params)
}


/**
创建排产计划
@param {Object} data - 排产计划数据
@returns {Promise} - 返回创建结果 Promise
*/
export function createPlpaichanjihua (data) {
return post ('/plpaichanjihua/save', data)
}

/**

更新排产计划
@param {Object} data - 排产计划数据
@returns {Promise} - 返回更新结果 Promise
*/
export function updatePlpaichanjihua (data) {
return put ('/plpaichanjihua/update', data)
}

/**

删除排产计划
@param {Object} params - 删除参数
@param {number} params.id - 排产计划 ID
@returns {Promise} - 返回删除结果 Promise
*/
export function deletePlpaichanjihua (params) {
return del ('/plpaichanjihua/delete', params)
}

/**

批量删除排产计划
@param {Array<number>} ids - 排产计划 ID 数组
@returns {Promise} - 返回删除结果 Promise
*/
export function batchDeletePlpaichanjihua (ids) {
const idsString = ids.join (',')
return del (`/plpaichanjihua/batchdelete?ids=${encodeURIComponent(idsString)}`)
}


/**

获取排产计划对应的产品的备料计划
@param {String}gdItemId - 工单物料ID
@returns {Promise} - 获取结果 Promise
*/
export function getPlpaichanjihuaBeleiPlan (gdItemId) {
return get ('/plpaichanjihua/getbeiliaojihuapage', { gdItemId })
}