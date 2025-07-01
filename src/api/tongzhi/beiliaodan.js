import { post, get, put, del } from '@/utils/request'

/**
 * 获取备料计划分页数据
 * @param {Object} params - 查询参数
 * @param {string} params.noticeid - 通知编号
 * @param {string} params.noticedrawno - 图纸编号
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 */
export function getBeiliaojihuaPage(params) {
  return get('/beiliaojihua/getbeiliaojihuapage', params)
}

/**
 * 更新备料计划
 * @param {object} data - 备料计划数据
 */
export function saveBeiliaojihua(data) {
  return put('/beiliaojihua/update', data)
}    