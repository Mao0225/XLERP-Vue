import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页通知列表
 * @param {Object} params - 分页及查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.noticeid - 通知ID
 * @param {string} params.noticename - 通知名称
 * @returns {Promise} - 返回通知列表Promise
 */
export function getQuerenTongzhi(params) {
  return get('/tongzhi/gettongzhipage', params)
}

/**
 * 获取分页通知列表
 * @param {Object} params - 分页及查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.noticeid - 通知ID
 * @param {string} params.noticename - 通知名称
 * @returns {Promise} - 返回通知列表Promise
 */
export function getJiaoYanTongZhi(params) {
  return get('/tongzhi/gettongzhipage', params)
}
/**
 * 确认通知
 * @param {Object} params - 确认通知所需参数
 * @param {string} params.noticeid - 通知ID
 * @returns {Promise} - 返回确认通知操作结果的Promise
 */
export function confirmNotice(params) {
  return get('/tongzhi/querentongzhi', params)
}
/**
 * 确认通知
 * @param {Object} params - 确认通知所需参数
 * @param {string} params.noticeid - 通知ID
 * @returns {Promise} - 返回确认通知操作结果的Promise
 */
export function fanConfirmNotice(params) {
  return get('/tongzhi/fanquerentongzhi', params)
}

export function verifyNotice(params) {
  return get('/tongzhi/jiaoyantongzhi', params)
}
/**
 * 确认通知
 * @param {Object} params - 确认通知所需参数
 * @param {string} params.noticeid - 通知ID
 * @returns {Promise} - 返回确认通知操作结果的Promise
 */
export function unverifyNotice(params) {
  return get('/tongzhi/fanjiaoyantongzhi', params)
}

export function shenhenNotice(params) {
  return get('/tongzhi/shenhetongzhi', params)
}
/**
 * 确认通知 
 * @param {Object} params - 确认通知所需参数
 * @param {string} params.noticeid - 通知ID
 * @returns {Promise} - 返回确认通知操作结果的Promise
 */
export function fanshenheyanmNotice(params) {
  return get('/tongzhi/fanshenhetongzhi', params)
}


/**
 * 根据通知ID获取通知详情
 * @param {Object} params - 查询参数
 * @param {string} params.noticeid - 通知ID
 * @returns {Promise} - 返回通知详情的Promise
 */
export function getTongzhiById(params) {
  return get('/tongzhi/gettongzhibyid', params)
}

/**
 * 修改单条通知信息
 * @param {Object} params - 修改通知信息所需参数
 * @returns {Promise} - 返回修改通知信息操作结果的Promise
 */
export function updateNoticeItem(params) {
  return put('/tongzhi/updateitem', params)
}