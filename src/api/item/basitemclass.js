import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页物料分类列表
 */
export function getBasItemClassList(params) {
  return get('/bas_item_class/getList', params)
}


/**
 * 获取树形物料分类列表
 */
export function getBasItemClassTreeList(params) {
  return get('/bas_item_class/getTreeList', params)
}

/**
 * 新增物料分类
 */
export function createBasItemClass(data) {
  return post('/bas_item_class/save', data)
}

/**
 * 更新物料分类
 */
export function updateBasItemClass(data) {
  return put('/bas_item_class/update', data)
}

/**
 * 删除物料分类
 */
export function deleteBasItemClass(params) {
  return del('/bas_item_class/delete', params)
}
