import { post, get, put, del } from '@/utils/request'

/**
 * 创建检验主单（报检）
 * 自动生成 orderNo，初始状态为“草稿”
 * @param {Object} data - 检验主单数据 (PlInspOrder 实体)
 * @returns {Promise} - 返回创建结果Promise，成功时包含主键ID
 */
export function createInspOrder(data) {
  return post('/insp_order/save', data)
}

/**
 * 更新检验单
 * @param {Object} data - 检验单数据 (PlInspOrder 实体)
 * @returns {Promise} - 返回更新结果Promise
 */
export function updateInspOrder(data) {
  return put('/insp_order/update', data)
}

/**
 * 获取分页检验单列表
 * @param {Object} params - 查询参数
 * @param {number} [params.pageNumber=1] - 当前页码
 * @param {number} [params.pageSize=10] - 每页大小
 * @param {string} [params.param] - 搜索关键词（如订单号、物料等）
 * @returns {Promise} - 返回分页数据Promise
 */
export function getInspOrderPage(params) {
  return get('/insp_order/getpage', params)
}

/**
 * 获取检验单详情（含检验结果、标准对比等）
 * @param {Object} params - 查询参数
 * @param {number} params.id - 检验单ID
 * @returns {Promise} - 返回检验单完整信息Promise
 */
export function getInspOrderById(params) {
  return get('/insp_order/get', params)
}

/**
 * 更新检验单状态
 * @param {Object} params - 操作参数
 * @param {number} params.orderId - 检验单ID
 * @param {string} params.newStatus - 新状态
 * @param {string} [params.remark] - 操作备注
 * @param {string} [params.operator] - 操作人
 * @returns {Promise} - 返回操作结果Promise
 */
export function updateInspOrderStatus(params) {
  return get('/insp_order/updateStatus', params)
}


/**
 * 删除检验单
 * @param {Object} params - 操作参数
 * @param {number} params.id - 检验单ID
 */
export function deleteInspOrder(params) {
  return del('/insp_order/delete', params)
}