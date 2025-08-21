import { post, get, put, del } from '@/utils/request'

// ==================== 耐张线夹钢材（clnzxjgc）相关接口 ====================


export function getClnzxjgcList(params) {
  return get('/clnzxjgc/getpage', params)
}

/**
 * 根据 ID 获取耐张线夹钢材
 * @param {Object} params - 查询参数
 * @param {number} params.id - 耐张线夹钢材 ID
 * @returns {Promise} - 返回钢材信息 Promise
 */
export function getClnzxjgcById(params) {
  return get('/clnzxjgc/get', params)
}

/**
 * 创建耐张线夹钢材
 * @param {Object} data - 钢材数据
 * @returns {Promise} - 返回创建结果 Promise
 */
export function createClnzxjgc(data) {
  return post('/clnzxjgc/save', data)
}

/**
 * 更新耐张线夹钢材
 * @param {Object} data - 钢材数据
 * @returns {Promise} - 返回更新结果 Promise
 */
export function updateClnzxjgc(data) {
  return put('/clnzxjgc/update', data)
}

/**
 * 删除耐张线夹钢材
 * @param {Object} params - 删除参数
 * @param {number} params.id - 钢材 ID
 * @returns {Promise} - 返回删除结果 Promise
 */
export function deleteClnzxjgc(params) {
  return del('/clnzxjgc/delete', params)
}

/**
 * 通过生产工单号获取工单详情（含生产订单号、合同编号）
 * @param {Object} params - 查询参数
 * @param {string} params.woNo - 生产工单号
 * @returns {Promise} - 返回工单详情 Promise
 */
export function getGongdanByWoNo(params) {
  return get('/clnzxjgc/getGongdanByWoNo', params)
}