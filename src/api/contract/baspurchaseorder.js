import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页采购订单列表
 */
export function getBasPurchaseOrders(params) {
  return get('/baspurchaseorder/getpage', params)
}

/**
 * 根据ID获取采购订单信息
 */
export function getBasPurchaseOrderById(params) {
  return get('/baspurchaseorder/get', params)
}

/**
 * 创建采购订单
 */
export function createBasPurchaseOrder(data) {
  return post('/baspurchaseorder/save', data)
}

/**
 * 更新采购订单
 */
export function updateBasPurchaseOrder(data) {
  return put('/baspurchaseorder/update', data)
}

/**
 * 删除采购订单
 */
export function deleteBasPurchaseOrder(params) {
  return del('/baspurchaseorder/delete', params)
}