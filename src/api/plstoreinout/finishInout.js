import { get, post } from '@/utils/request'

// 分页查询产成品出入库记录列表
export function getFinishInoutPage(params) {
  return get('/pl_finish_inout/getpage', params)
}

// 新增出入库记录
export function saveFinishInout(data) {
  return post('/pl_finish_inout/save', data)
}