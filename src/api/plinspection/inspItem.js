import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页检验项列表
 * @param {Object} params - 查询参数
 * @param {number} [params.pageNumber=1] - 当前页码
 * @param {number} [params.pageSize=10] - 每页大小
 * @param {string} [params.param] - 搜索关键词
 * @returns {Promise} - 返回分页数据Promise
 */
export function getInspItemPage(params) {
  return get('/insp_item/getpage', params)
}



/**
 * 获取所有检验项列表
 * @returns {Promise} - 获取所有检验项列表Promise

 */
export function getInspItemList() {
  return get('/insp_item/getList')
}

/**
 * 根据ID获取检验项详情
 * @param {Object} params - 查询参数
 * @param {number} params.id - 检验项ID
 * @returns {Promise} - 返回检验项信息Promise
 */
export function getInspItemById(params) {
  return get('/insp_item/get', params)
}

/**
 * 创建检验项
 * @param {Object} data - 检验项数据 (PlInspItem 实体)
 * @returns {Promise} - 返回创建结果Promise
 */
export function createInspItem(data) {
  return post('/insp_item/save', data)
}

/**
 * 更新检验项
 * @param {Object} data - 检验项数据 (包含ID)
 * @returns {Promise} - 返回更新结果Promise
 */
export function updateInspItem(data) {
  return put('/insp_item/update', data)
}

/**
 * 删除检验项
 * @param {Object} params - 删除参数
 * @param {number} params.id - 检验项ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteInspItem(params) {
  return del('/insp_item/delete', params)
}