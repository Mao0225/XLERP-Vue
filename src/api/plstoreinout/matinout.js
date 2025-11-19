import { post, get, put, del } from '@/utils/request'

/**
 * 原材料出入库主表接口
 */

/**
 * 获取分页列表
 * @param {Object} params - 查询参数
 */
export function getPlMatInoutList(params) {
  return get('/pl_mat_inout/getpage', params)
}



/**
 * 创建记录
 * @param {Object} data - 主表数据
 */
export function createPlMatInout(data) {
  return post('/pl_mat_inout/save', data)
}
