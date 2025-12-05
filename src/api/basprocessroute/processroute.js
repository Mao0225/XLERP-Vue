import { get, post, put, del } from '@/utils/request'

// 获取工艺路线详情
export function getProcessRoute(params) {
  return get('/processRoute/get', params)
}

// 新增工艺路线
export function saveProcessRoute(data) {
  return post('/processRoute/save', data)
}

// 更新工艺路线
export function updateProcessRoute(data) {
  return put('/processRoute/update', data)
}

// 删除工艺路线
export function deleteProcessRoute(params) {
  return del('/processRoute/delete', params)
}

// 根据产品 ID 查询工艺路线列表
export function getProcessRoutesByItemId(params) {
  return get('/processRoute/getByItemId', params)
}