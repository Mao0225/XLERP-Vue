import { post, get, put, del } from '@/utils/request'

// ==================== 悬垂线夹辅材（clxcxjfc）相关接口 ====================

/**
 * 获取分页悬垂线夹辅材列表
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
export function getClxcxjfcList(params) {
  return get('/clxcxjfc/getpage', params)
}

/**
 * 根据 ID 获取悬垂线夹辅材
 * @param {Object} params - 查询参数
 * @param {number} params.id - 悬垂线夹辅材 ID
 * @returns {Promise} - 返回辅材信息 Promise
 */
export function getClxcxjfcById(params) {
  return get('/clxcxjfc/get', params)
}

/**
 * 创建悬垂线夹辅材
 * @param {Object} data - 辅材数据
 * @returns {Promise} - 返回创建结果 Promise
 */
export function createClxcxjfc(data) {
  return post('/clxcxjfc/save', data)
}

/**
 * 更新悬垂线夹辅材
 * @param {Object} data - 辅材数据
 * @returns {Promise} - 返回更新结果 Promise
 */
export function updateClxcxjfc(data) {
  return put('/clxcxjfc/update', data)
}

/**
 * 删除悬垂线夹辅材
 * @param {Object} params - 删除参数
 * @param {number} params.id - 悬垂线夹辅材 ID
 * @returns {Promise} - 返回删除结果 Promise
 */
export function deleteClxcxjfc(params) {
  return del('/clxcxjfc/delete', params)
}

/**
 * 通过生产工单号获取工单详情（含生产订单号、合同编号）
 * @param {Object} params - 查询参数
 * @param {string} params.woNo - 生产工单号
 * @returns {Promise} - 返回工单详情 Promise
 */
export function getGongdanByWoNo(params) {
  return get('/clxcxjfc/getGongdanByWoNo', params)
}

// 新增：获取单据号
export function getBasNo(basname) {
  return get('/Basno/getNewNoNyName', { basname })
}