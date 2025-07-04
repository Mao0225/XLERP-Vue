import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页机械加劲原材料力学试验数据
 * @param {Object} params
 * @returns {Promise}
 */
export function getBgxjlcs(params) {
  return get('/bgxjlc/getpage', params)
}

/**
 * 根据ID获取机械加劲原材料力学试验详情
 * @param {Object} params
 * @returns {Promise}
 */
export function getBgxjlcById(params) {
  return get('/bgxjlc/get', params)
}

/**
 * 创建机械加劲原材料力学试验数据
 * @param {Object} data
 * @returns {Promise}
 */
export function createBgxjlc(data) {
  return post('/bgxjlc/save', data)
}

/**
 * 更新机械加劲原材料力学试验数据
 * @param {Object} data
 * @returns {Promise}
 */
export function updateBgxjlc(data) {
  return put('/bgxjlc/update', data)
}

/**
 * 删除机械加劲原材料力学试验数据
 * @param {Object} params
 * @returns {Promise}
 */
export function deleteBgxjlc(params) {
  return del('/bgxjlc/delete', params)
}