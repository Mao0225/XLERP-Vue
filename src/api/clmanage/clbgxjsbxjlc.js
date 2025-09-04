import { post, get, put, del } from '@/utils/request'

// ==================== 并沟线夹设备线夹铝材（cl_bgxjsbxj_lc）相关接口 ====================

/**
 * 获取分页并沟线夹设备线夹铝材列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.mafactory - 原材料制造商
 * @param {string} params.matMaterial - 牌号
 * @param {string} params.orderno - 入库单号
 * @param {string} params.matRecheckNo - 来料检验批次号
 * @param {string} params.chemAl - 化学成分分析-Al
 * @param {string} params.chemSi - 化学成分分析-Si
 * @param {string} params.chemFe - 化学成分分析-Fe
 * @param {string} params.chemCu - 化学成分分析-Cu
 * @param {string} params.chemMg - 化学成分分析-Mg
 * @param {string} params.chemMn - 化学成分分析-Mn
 * @param {string} params.chemZn - 化学成分分析-Zn
 * @param {string} params.chemTi - 化学成分分析-Ti
 * @param {string} params.chemCr - 化学成分分析-Cr
 * @param {string} params.tensileStrength - 拉伸强度
 * @param {string} params.elongation - 延伸率
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
export function getClbgxjsbxjlcList(params) {
  return get('/clbgxjsbxjlc/getpage', params)
}

/**
 * 根据 ID 获取并沟线夹设备线夹铝材
 * @param {Object} params - 查询参数
 * @param {number} params.id - 并沟线夹设备线夹铝材 ID
 * @returns {Promise} - 返回铝材信息 Promise
 */
export function getClbgxjsbxjlcById(params) {
  return get('/clbgxjsbxjlc/get', params)
}

/**
 * 创建并沟线夹设备线夹铝材
 * @param {Object} data - 铝材数据
 * @returns {Promise} - 返回创建结果 Promise
 */
export function createClbgxjsbxjlc(data) {
  return post('/clbgxjsbxjlc/save', data)
}

/**
 * 更新并沟线夹设备线夹铝材
 * @param {Object} data - 铝材数据
 * @returns {Promise} - 返回更新结果 Promise
 */
export function updateClbgxjsbxjlc(data) {
  return put('/clbgxjsbxjlc/update', data)
}

/**
 * 删除并沟线夹设备线夹铝材
 * @param {Object} params - 删除参数
 * @param {number} params.id - 铝材 ID
 * @returns {Promise} - 返回删除结果 Promise
 */
export function deleteClbgxjsbxjlc(params) {
  return del('/clbgxjsbxjlc/delete', params)
}

/**
 * 通过生产工单号获取工单详情（含生产订单号、合同编号）
 * @param {Object} params - 查询参数
 * @param {string} params.woNo - 生产工单号
 * @returns {Promise} - 返回工单详情 Promise
 */
export function getGongdanByWoNo(params) {
  return get('/clbgxjsbxjlc/getGongdanByWoNo', params)
}



// 新增：获取单据号
export function getBasNo(basname) {
  return get('/Basno/getNewNoNyName', { basname })
}