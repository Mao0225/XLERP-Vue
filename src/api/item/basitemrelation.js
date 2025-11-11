import { get, post, put, del } from '@/utils/request'

// 获取物料树结构
export function getMaterialTree(params) {
  return get('/bas_item_relation/tree', params)
}

// 新增物料关系
export function addBasItemRelation(data) {
  return post('/bas_item_relation/add', data)
}

// 更新物料关系
export function updateBasItemRelation(data) {
  return put('/bas_item_relation/update', data)
}

// 删除物料关系
export function deleteBasItemRelation(params) {
  return del('/bas_item_relation/delete', params)
}