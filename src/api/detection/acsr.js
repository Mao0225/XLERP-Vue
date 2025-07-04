import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页数据列表
 */
export function getACSR(params) {
  return get('/acsr/getpage', params)
}

/**
 * 根据ID获取数据
 * @param {Object} params - 查询参数
 * @param {number} params.id - 数据ID
 * @returns {Promise} - 返回物料信息Promise
 */
export function getACSRById(params) {
  return get('/acsr/get', params)
}


export function createACSR(data) {
  return post('/acsr/save', data)
}


export function updateACSR(data) {
  return put('/acsr/update', data)
}

/**
 * 删除数据
 * @param {Object} params - 删除参数
 * @param {number} params.id - 数据ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteACSR(params) {
  return del('/acsr/delete', params)
}

/**
 * 上传文件到自定义路径
 * @param {Object} data - 表单数据
 * @returns {Promise} - 返回上传结果Promise
 */
export function uploadFileToCustomPath(data) {
  return post('/acsr/upload/custom', data)
}

/**
 * 获取合同号列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.contractNo - 合同号
 * @returns {Promise} - 返回合同号列表Promise
 */
export function getGridNoList(params) {
  return get('/acsr/getGridNoList', params);
}