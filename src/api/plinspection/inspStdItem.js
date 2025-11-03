import { post, put, del } from '@/utils/request'


/**
 * 单个保存检验标准明细项目
 * @param {Object} data - 检验标准明细数据 (PlInspStdItem 实体)
 */
export function saveInspStandardItem(data) {
  return post('/insp_std_item/save', data)
}
/**
 * 更新单条检验标准明细（如标准值范围、单位、备注等）
 * @param {Object} data - 检验标准明细数据 (PlInspStdItem 实体)
 * @param {number} data.id - 明细项ID（必填）
 * @returns {Promise} - 返回更新结果Promise
 */
export function updateInspStandardItem(data) {
  return put('/insp_std_item/update', data)
}

/**
 * 删除检验标准明细项目
 * @param {Object} params - 删除参数
 * @param {number} params.id - 检验标准明细ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteInspStandardItem(params) {
  return del('/insp_std_item/delete', params)
}