import { post, get, put, del } from '@/utils/request'

// ==================== 耐张线夹铝包钢线（cl_nzxj_lbgx）相关接口 ====================

/**
 * 获取分页耐张线夹铝包钢线列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.matRecheckNo - 来料检验批次号
 * @param {string} params.orderno - 入库单号
 * @param {string} params.size - 尺寸
 * @param {string} params.singleWireStrength - 力学性能-单丝强度
 * @param {string} params.mafactory - 原材料制造商
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
export function getClnzxjlbgxList(params) {
  return get('/clnzxjlbgx/getpage', params)
}

/**
 * 根据 ID 获取耐张线夹铝包钢线
 * @param {Object} params - 查询参数
 * @param {number} params.id - 数据主键 ID
 * @returns {Promise} - 返回铝包钢线数据 Promise
 */
export function getClnzxjlbgxById(params) {
  return get('/clnzxjlbgx/get', params)
}

/**
 * 创建耐张线夹铝包钢线
 * @param {Object} data - 铝包钢线数据
 * @returns {Promise} - 返回创建结果 Promise
 */
export function createClnzxjlbgx(data) {
  return post('/clnzxjlbgx/save', data)
}

/**
 * 更新耐张线夹铝包钢线
 * @param {Object} data - 铝包钢线数据
 * @returns {Promise} - 返回更新结果 Promise
 */
export function updateClnzxjlbgx(data) {
  return put('/clnzxjlbgx/update', data)
}

/**
 * 删除耐张线夹铝包钢线
 * @param {Object} params - 删除参数
 * @param {number} params.id - 数据主键 ID
 * @returns {Promise} - 返回删除结果 Promise
 */
export function deleteClnzxjlbgx(params) {
  return del('/clnzxjlbgx/delete', params)
}

/**
 * 通过生产工单号获取工单详情（含生产订单号、合同编号）
 * @param {Object} params - 查询参数
 * @param {string} params.woNo - 生产工单号
 * @returns {Promise} - 返回工单详情 Promise
 */
export function getGongdanByWoNo(params) {
  return get('/clnzxjlbgx/getGongdanByWoNo', params)
}


// 新增：获取单据号
export function getBasNo(basname) {
  return get('/Basno/getNewNoNyName', { basname })
}