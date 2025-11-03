import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页检验标准列表
 * 支持按标准编号、材料、牌号模糊搜索
 * @param {Object} params - 查询参数
 * @param {number} [params.pageNumber=1] - 当前页码
 * @param {number} [params.pageSize=10] - 每页大小
 * @param {string} [params.param] - 搜索关键词（标准编号/材料/牌号）
 * @returns {Promise} - 返回分页数据Promise
 */
export function getInspStandardPage(params) {
  return get('/insp_std/getpage', params)
}

/**
 * 根据ID获取检验标准详情（不含明细）
 * @param {Object} params - 查询参数
 * @param {number} params.id - 检验标准ID
 * @returns {Promise} - 返回检验标准信息Promise
 */
export function getInspStandardById(params) {
  return get('/insp_std/get', params)
}

/**
 * 创建新的检验标准
 * 自动校验 standardNo 唯一性
 * @param {Object} data - 检验标准数据 (PlInspStd 实体)
 * @param {string} data.standardNo - 标准编号（必填）
 * @returns {Promise} - 返回创建结果Promise，成功时包含新ID
 */
export function createInspStandard(data) {
  return post('/insp_std/save', data)
}

/**
 * 更新检验标准信息
 * @param {Object} data - 检验标准数据 (必须包含id)
 * @returns {Promise} - 返回更新结果Promise
 */
export function updateInspStandard(data) {
  return put('/insp_std/update', data)
}

/**
 * 删除检验标准及其所有关联明细
 * @param {Object} params - 删除参数
 * @param {number} params.id - 检验标准ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteInspStandard(params) {
  return del('/insp_std/delete', params)
}

/**
 * 一键套用检验标准到检验单
 * 自动生成 pl_insp_result 空记录（带标准值）
 * @param {Object} data - 套用参数
 * @param {number} data.orderId - 检验单ID
 * @param {number} data.standardId - 检验标准ID
 * @returns {Promise} - 返回套用结果Promise
 */
export function applyInspStandard(data) {
  return post('/insp_std/apply', data)
}



/**
 * 同时保存检验标准和标准明细
 * @param {Object} data - 检验标准数据 (包含标准明细)
 * @param {Object} data.std - 检验标准信息
 * @param {number} data.items - 标准明细信息
 * @returns {Promise} - 返回保存结果Promise
 */
export function createStdAndItem(data) {
  return post('/insp_std/createStdAndItem', data)
}

/**
 * 获取标准以及明细
 * @param {Object} params - 查询参数
 * @param {number} params.id - 检验标准ID
 */
export function getInspStandardAndItem(params) {
  return get('/insp_std/getStdAndItem', params)
}