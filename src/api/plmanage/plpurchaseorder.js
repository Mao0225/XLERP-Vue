import { get, post, put,del } from '@/utils/request'

// 分页查询采购订单列表
export function getPurchaseOrderPage(params) {
  return get('/pl_purchase_order/getpage', params)
}

// 创建采购订单
export function savePurchaseOrder(data) {
  return post('/pl_purchase_order/save', data)
}

// 更新采购订单主要信息
export function updatePurchaseOrder(data) {
  return put('/pl_purchase_order/update', data)
}

// 删除采购订单
export function deletePurchaseOrder(params) {
  return del('/pl_purchase_order/delete', params)
}

// 根据采购订单号获取物料列表
export function getPurchaseOrderMaterialList(params) {
  return get('/pl_purchase_order/getMaterialList', params)
}

//根据备料单id和采购订单号批量设置订单号
export function setPurchaseOrderNo(data) {
  return post('/pl_purchase_order/setPurchaseOrderNo', data)
}


/**
 * 删除采购计划根据采购单号，还有关联的备料单行数据也要清空
 */
export function deletePurchaseOrderByOrderNo(params) {
  return del('/pl_purchase_order/deleteByOrderNo', params)
}

/**
 * 更新采购计划状态
 */
export function updatePurchaseOrderStatus(data) {
  return get('/pl_purchase_order/updateStatus', data)
}