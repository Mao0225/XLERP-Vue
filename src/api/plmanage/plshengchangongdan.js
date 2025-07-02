import { post, get, put, del } from '@/utils/request'

/**

获取分页生产工单列表
*/
export function getPlshengchangongdanList (params) {
return get ('/plshengchangongdan/getpage', params)
}

/**

根据 ID 获取生产工单
@param {Object} params - 查询参数
@param {number} params.id - 生产工单 ID
@returns {Promise} - 返回生产工单信息 Promise
*/
export function getPlshengchangongdanById (params) {
return get ('/plshengchangongdan/get', params)
}

/**

创建生产工单
@param {Object} data - 生产工单数据
@returns {Promise} - 返回创建结果 Promise
*/
export function createPlshengchangongdan (data) {
return post ('/plshengchangongdan/save', data)
}

/**

更新生产工单
@param {Object} data - 生产工单数据
@returns {Promise} - 返回更新结果 Promise
*/
export function updatePlshengchangongdan (data) {
return put ('/plshengchangongdan/update', data)
}

/**

删除生产工单
@param {Object} params - 删除参数
@param {number} params.id - 生产工单 ID
@returns {Promise} - 返回删除结果 Promise
*/
export function deletePlshengchangongdan (params) {
return del ('/plshengchangongdan/delete', params)
}

/**

批量删除生产工单
@param {Array<number>} ids - 生产工单 ID 数组
@returns {Promise} - 返回删除结果 Promise
*/
export function batchDeletePlshengchangongdan (ids) {
const idsString = ids.join (',')
return del (`/plshengchangongdan/batchdelete?ids=${encodeURIComponent(idsString)}`)
}
