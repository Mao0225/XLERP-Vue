import { post, get, put, del } from '@/utils/request'

/**

获取分页生产订单列表
*/
export function getPlshengchandingdanList (params) {
return get ('/plshengchandingdan/getpage', params)
}

/**

根据 ID 获取生产订单
@param {Object} params - 查询参数
@param {number} params.id - 生产订单 ID
@returns {Promise} - 返回生产订单信息 Promise
*/
export function getPlshengchandingdanById (params) {
return get ('/plshengchandingdan/get', params)
}

/**

创建生产订单
@param {Object} data - 生产订单数据
@returns {Promise} - 返回创建结果 Promise
*/
export function createPlshengchandingdan (data) {
return post ('/plshengchandingdan/save', data)
}

/**

更新生产订单
@param {Object} data - 生产订单数据
@returns {Promise} - 返回更新结果 Promise
*/
export function updatePlshengchandingdan (data) {
return put ('/plshengchandingdan/update', data)
}

/**

删除生产订单
@param {Object} params - 删除参数
@param {number} params.id - 生产订单 ID
@returns {Promise} - 返回删除结果 Promise
*/
export function deletePlshengchandingdan (params) {
return del ('/plshengchandingdan/delete', params)
}

/**

批量删除生产订单
@param {Array<number>} ids - 生产订单 ID 数组
@returns {Promise} - 返回删除结果 Promise
*/
export function batchDeletePlshengchandingdan (ids) {
const idsString = ids.join (',')
return del(`/plshengchandingdan/batchdelete?ids=${encodeURIComponent(idsString)}`)
}