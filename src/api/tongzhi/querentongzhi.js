import { post, get, put, del } from '@/utils/request'




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

/**
 * 审核通知 
 * @param {Object} params - 确认通知所需参数
 * @param {string} params.noticeid - 通知ID
 * @param {string} params.noticeshenhe - 通知ID
 * @returns {Promise} - 返回确认通知操作结果的Promise
 */
export function shenhenNotice(params) {
  return get('/tongzhi/shenhetongzhi', params)
}
/**
 * 反审核通知 
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
