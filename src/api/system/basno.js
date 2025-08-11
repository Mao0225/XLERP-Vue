import { post, get, put, del } from '@/utils/request'

/**
 * 获取编号分页列表
 * @param {Object} params - 分页参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise} - 返回编号列表Promise
 */
export function getBasNoPage(params) {
  return get('/Basno/getpage', params)
}

/**
 * 根据ID获取编号信息
 * @param {Object} params - 查询参数
 * @param {number} params.id - 编号ID
 * @returns {Promise} - 返回编号信息Promise
 */
export function getBasNoById(params) {
  return get('/Basno/get', params)
}

/**
 * 根据简称获取新编号
 * @param {string} basname - 编号简称
 * @returns {Promise} - 返回完整编号Promise
 */
export function getNewNoNyName(basname) {
  return get(`/Basno/getNewNoNyName?basname=${basname}`)
}

/**
 * 创建编号
 * @param {Object} data - 编号信息
 * @returns {Promise} - 返回创建结果Promise
 */
export function createBasNo(data) {
  return post('/Basno/save', data)
}

/**
 * 更新编号
 * @param {Object} data - 编号信息

 * @returns {Promise} - 返回更新结果Promise
 */
export function updateBasNo(data) {
  return put('/Basno/update', data)
}

/**
 * 删除编号
 * @param {Object} params - 删除参数
 * @param {number} params.id - 编号ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteBasNo(params) {
  return del('/Basno/delete', params)
}