import { get, post, put, del } from '@/utils/request'

// 创建生产工单检验单（报检）
export function createInspWorkOrder(data) {
  return post('/insp_work_order/save', data)
}

// 更新检验单
export function updateInspWorkOrder(data) {
  return put('/insp_work_order/update', data)
}

// 分页查询检验单列表
export function getInspWorkOrderPage(params) {
  return get('/insp_work_order/getpage', params)
}

// 删除检验单
export function deleteInspWorkOrder(params) {
  return del('/insp_work_order/delete', params)
}

// 获取检验单详情
export function getInspWorkOrderById(params) {
  return get('/insp_work_order/get', params)
}

// 更新检验单状态（含操作人和备注）
export function updateInspWorkOrderStatus(params) {
  return get('/insp_work_order/updateStatus', params)
}