import { get, post, put, del } from '@/utils/request'

/**
 * 获取分页期间列表
 * @param {Object} params - 分页参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页大小
 * @param {string} params.term - 期间名称（可选）
 * @returns {Promise} - 返回期间列表Promise
 */
export function getTerms(params) {
  return get('/term/getpage', params)
}

/**
 * 获取所有期间列表
 * @returns {Promise} - 返回所有期间列表Promise
 */
export function getAllTerms() {
  return get('/term/getall')
}

/**
 * 根据ID获取期间
 * @param {Object} params - 查询参数
 * @param {number} params.id - 期间ID
 * @returns {Promise} - 返回期间信息Promise
 */
export function getTermById(params) {
  return get('/term/get', params)
}

/**
 * 创建期间
 * @param {Object} data - 期间信息
 * @param {string} data.term - 期间名称
 * @param {number} data.iscurrent - 是否当前期间 (0否, 1是, 2上一期间, 3下一期间)
 * @param {string} data.begindate - 开始时间 (格式: YYYY-MM-DD HH:mm:ss)
 * @param {string} data.enddate - 结束时间 (格式: YYYY-MM-DD HH:mm:ss)
 * @param {number} data.flag - 标志位
 * @param {number} data.type - 期间类型
 * @param {number} data.status - 状态 (0正常, -1删除)
 * @returns {Promise} - 返回创建结果Promise
 */
export function createTerm(data) {
  return post('/term/save', data)
}

/**
 * 更新期间
 * @param {Object} data - 期间信息
 * @param {number} data.id - 期间ID
 * @param {string} data.term - 期间名称
 * @param {number} data.iscurrent - 是否当前期间 (0否, 1是, 2上一期间, 3下一期间)
 * @param {string} data.begindate - 开始时间 (格式: YYYY-MM-DD HH:mm:ss)
 * @param {string} data.enddate - 结束时间 (格式: YYYY-MM-DD HH:mm:ss)
 * @param {number} data.flag - 标志位
 * @param {number} data.type - 期间类型
 * @param {number} data.status - 状态 (0正常, -1删除)
 * @returns {Promise} - 返回更新结果Promise
 */
export function updateTerm(data) {
  return put('/term/update', data)
}

/**
 * 删除期间
 * @param {Object} params - 删除参数
 * @param {number} params.id - 期间ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteTerm(params) {
  return del('/term/delete', params)
}

/**
 * 获取期间选项列表
 * @returns {Promise} - 返回包含期间ID和名称的选项列表Promise
 */
export function getTermOptions() {
  return get('/term/getoption')
}
