import { post, get, put, del } from '@/utils/request'

// ==================== 接续金具钢材（cl_jxjj_gc）相关接口 ====================

/**
 * 获取分页接续金具钢材列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.mafactory - 原材料制造商
 * @param {string} params.batch - 炉批号
 * @param {string} params.matMaterial - 牌号
 * @param {string} params.orderno - 入库单号
 * @param {string} params.matRecheckNo - 来料检验批次号
 * @param {string} params.chemC - 化学成分分析-C
 * @param {string} params.chemSi - 化学成分分析-Si
 * @param {string} params.chemMn - 化学成分分析-Mn
 * @param {string} params.chemP - 化学成分分析-P
 * @param {string} params.chemS - 化学成分分析-S
 * @param {string} params.chemCr - 化学成分分析-Cr
 * @param {string} params.chemNi - 化学成分分析-Ni
 * @param {string} params.chemMo - 化学成分分析-Mo
 * @param {string} params.matSpec - 规格
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
export function getCljxjjgcList(params) {
  return get('/cljxjjgc/getpage', params)
}

/**
 * 根据 ID 获取接续金具钢材
 * @param {Object} params - 查询参数
 * @param {number} params.id - 接续金具钢材 ID
 * @returns {Promise} - 返回钢材信息 Promise
 */
export function getCljxjjgcById(params) {
  return get('/cljxjjgc/get', params)
}

/**
 * 创建接续金具钢材
 * @param {Object} data - 钢材数据
 * @returns {Promise} - 返回创建结果 Promise
 */
export function createCljxjjgc(data) {
  return post('/cljxjjgc/save', data)
}

/**
 * 更新接续金具钢材
 * @param {Object} data - 钢材数据
 * @returns {Promise} - 返回更新结果 Promise
 */
export function updateCljxjjgc(data) {
  return put('/cljxjjgc/update', data)
}

/**
 * 删除接续金具钢材
 * @param {Object} params - 删除参数
 * @param {number} params.id - 钢材 ID
 * @returns {Promise} - 返回删除结果 Promise
 */
export function deleteCljxjjgc(params) {
  return del('/cljxjjgc/delete', params)
}

/**
 * 通过生产工单号获取工单详情（含生产订单号、合同编号）
 * @param {Object} params - 查询参数
 * @param {string} params.woNo - 生产工单号
 * @returns {Promise} - 返回工单详情 Promise
 */
export function getGongdanByWoNo(params) {
  return get('/cljxjjgc/getGongdanByWoNo', params)
}


// 新增：获取单据号
export function getBasNo(basname) {
  return get('/Basno/getNewNoNyName', { basname })
}