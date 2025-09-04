import { post, get, put, del } from '@/utils/request'

// ==================== 间隔棒辅材（cl_jgb_fc）相关接口 ====================

/**
 * 获取分页间隔棒辅材列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.maQuality - 辅材类型
 * @param {string} params.matRecheckNo - 来料检验批次号
 * @param {string} params.orderno - 入库单号
 * @param {string} params.mafactory - 原材料制造商
 * @param {string} params.sampleNumber - 样品编号
 * @param {string} params.testResult - 检测结果
 * @param {string} params.leavefactoryDate - 原材料出厂检测日期
 * @param {string} params.detectionTime - 原材料入厂检测日期
 * @param {string} params.certificate - 质量证明书
 * @param {string} params.contractNo - 合同编号
 * @param {string} params.woNo - 生产工单号
 * @param {string} params.ipoNo - 生产订单号
 * @param {string} params.writer - 录入人
 * @param {string} params.writeTime - 录入时间
 * @param {string} params.flag - 标志
 * @param {string} params.status - 状态
 * @param {string} params.memo - 备注
 * @param {string} params.type - 类型
 * @returns {Promise} - 返回分页数据 Promise
 */
export function getCljgbfcList(params) {
  return get('/cljgbfc/getpage', params)
}

/**
 * 根据 ID 获取间隔棒辅材
 * @param {Object} params - 查询参数
 * @param {number} params.id - 间隔棒辅材 ID
 * @returns {Promise} - 返回辅材信息 Promise
 */
export function getCljgbfcById(params) {
  return get('/cljgbfc/get', params)
}

/**
 * 创建间隔棒辅材
 * @param {Object} data - 辅材数据
 * @returns {Promise} - 返回创建结果 Promise
 */
export function createCljgbfc(data) {
  return post('/cljgbfc/save', data)
}

/**
 * 更新间隔棒辅材
 * @param {Object} data - 辅材数据
 * @returns {Promise} - 返回更新结果 Promise
 */
export function updateCljgbfc(data) {
  return put('/cljgbfc/update', data)
}

/**
 * 删除间隔棒辅材
 * @param {Object} params - 删除参数
 * @param {number} params.id - 间隔棒辅材 ID
 * @returns {Promise} - 返回删除结果 Promise
 */
export function deleteCljgbfc(params) {
  return del('/cljgbfc/delete', params)
}

/**
 * 通过生产工单号获取工单详情（含生产订单号、合同编号）
 * @param {Object} params - 查询参数
 * @param {string} params.woNo - 生产工单号
 * @returns {Promise} - 返回工单详情 Promise
 */
export function getGongdanByWoNo(params) {
  return get('/cljgbfc/getGongdanByWoNo', params)
}

// 新增：获取单据号
export function getBasNo(basname) {
  return get('/Basno/getNewNoNyName', { basname })
}