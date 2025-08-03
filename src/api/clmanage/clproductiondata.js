import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页生产数据列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.productname - 产品名称
 * @param {string} params.productmodel - 产品型号
 * @param {string} params.productionbatch - 生产批号
 * @param {string} params.processingmethod - 加工方式
 * @param {number} params.processingquantity - 加工件数
 * @param {string} params.productioncompletiontime - 生产完成时间
 * @param {string} params.schedulingplanno - 排产计划编号
 * @param {string} params.contractNo - 生产合同编号
 * @param {string} params.woNo - 生产工单编号
 * @param {string} params.ipoNo - 生产订单编号
 * @param {string} params.writer - 记录人
 * @param {string} params.writeTime - 记录时间
 * @param {number} params.isdelete - 是否删除
 * @param {string} params.status - 状态
 * @param {string} params.flag - 标志
 * @param {string} params.type - 类型
 * @param {string} params.memo - 备注
 * @returns {Promise} - 返回分页数据Promise
 */
export function getClProductionDataIds(params) {
  return get('/clproductiondata/getpage', params)
}

/**
 * 根据ID获取生产数据详情
 * @param {Object} params - 查询参数
 * @param {number} params.id - 生产数据ID
 * @returns {Promise} - 返回生产数据信息Promise
 */
export function getClProductionDataIdById(params) {
  return get('/clproductiondata/get', params)
}

/**
 * 创建生产数据
 * @param {Object} data - 生产数据
 * @returns {Promise} - 返回创建结果Promise
 */
export function createClProductionData(data) {
  return post('/clproductiondata/save', data)
}

/**
 * 更新生产数据
 * @param {Object} data - 生产数据
 * @returns {Promise} - 返回更新结果Promise
 */
export function updateClProductionData(data) {
  return put('/clproductiondata/update', data)
}

/**
 * 删除生产数据
 * @param {Object} params - 删除参数
 * @param {number} params.id - 生产数据ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteClProductionData(params) {
  return del('/clproductiondata/delete', params)
}