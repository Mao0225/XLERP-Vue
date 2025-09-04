import { post, get, put, del } from '@/utils/request'

// ==================== 均压环屏蔽环辅材（cl_jyh_fc）相关接口 ====================

/**
 * 获取分页均压环屏蔽环辅材列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.maQuality - 辅材类型
 * @param {string} params.orderno - 入库单号
 * @param {string} params.matRecheckNo - 来料检验批次号
 * @param {string} params.mafactory - 辅材制造商
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
export function getCljyhfcList(params) {
  return get('/cljyhfc/getpage', params)
}

/**
 * 根据 ID 获取均压环屏蔽环辅材
 * @param {Object} params - 查询参数
 * @param {number} params.id - 均压环屏蔽环辅材 ID
 * @returns {Promise} - 返回辅材信息 Promise
 */
export function getCljyhfcById(params) {
  return get('/cljyhfc/get', params)
}

/**
 * 创建均压环屏蔽环辅材
 * @param {Object} data - 辅材数据
 * @returns {Promise} - 返回创建结果 Promise
 */
export function createCljyhfc(data) {
  return post('/cljyhfc/save', data)
}

/**
 * 更新均压环屏蔽环辅材
 * @param {Object} data - 辅材数据
 * @returns {Promise} - 返回更新结果 Promise
 */
export function updateCljyhfc(data) {
  return put('/cljyhfc/update', data)
}

/**
 * 删除均压环屏蔽环辅材
 * @param {Object} params - 删除参数
 * @param {number} params.id - 均压环屏蔽环辅材 ID
 * @returns {Promise} - 返回删除结果 Promise
 */
export function deleteCljyhfc(params) {
  return del('/cljyhfc/delete', params)
}

/**
 * 通过生产工单号获取工单详情（含生产订单号、合同编号）
 * @param {Object} params - 查询参数
 * @param {string} params.woNo - 生产工单号
 * @returns {Promise} - 返回工单详情 Promise
 */
export function getGongdanByWoNo(params) {
  return get('/cljyhfc/getGongdanByWoNo', params)
}


// 新增：获取单据号
export function getBasNo(basname) {
  return get('/Basno/getNewNoNyName', { basname })
}