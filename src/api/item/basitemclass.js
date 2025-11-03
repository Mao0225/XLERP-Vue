import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页物料分类列表
 */
export function getBasItemClasses(params) {
  return get('/basitemclass/getpage', params)
}

/**
 * 根据ID获取物料分类
 */
export function getBasItemClassById(params) {
  return get('/basitemclass/get', params)
}

/**
 * 新增物料分类
 */
export function createBasItemClass(data) {
  return post('/basitemclass/save', data)
}

/**
 * 更新物料分类
 */
export function updateBasItemClass(data) {
  return put('/basitemclass/update', data)
}

/**
 * 删除物料分类
 */
export function deleteBasItemClass(params) {
  return del('/basitemclass/delete', params)
}

/**
 * 获取分类树形结构
 */
export function getClassTree() {
  return get('/basitemclass/tree')
}

/**
 * 获取父级分类选项
 */
export function getParentOptions(params) {
  return get('/basitemclass/parentoptions', params)
}

/**
 * 根据父级ID获取子分类
 */
export function getChildrenByParentId(params) {
  return get('/basitemclass/children', params)
}

/**
 * 获取子分类分页列表
 */
export function getChildrenPage(params) {
  return get('/basitemclass/childrenpage', params)
}

/**
 * 查看物料分类详情
 */
export function getBasItemClassDetail(params) {
  return get('/basitemclass/detail', params)
}

/**
 * 获取分类详情及父级信息
 */
export function getDetailWithParent(params) {
  return get('/basitemclass/detailwithparent', params)
}

/**
 * 获取分类层级信息
 */
export function getHierarchyDetail(params) {
  return get('/basitemclass/hierarchydetail', params)
}

/**
 * 获取子分类列表（不分页，用于瀑布流展示）
 */
export function getChildrenList(params) {
  return get('/basitemclass/childrenlist', params)
}

/**
 * 搜索分类
 */
export function searchClasses(params) {
  return get('/basitemclass/search', params)
}

/**
 * 获取一级分类列表（不分页，用于瀑布流展示）
 */
export function getLevel1Classes() {
  return get('/basitemclass/level1')
}

/**
 * 获取二级分类列表（不分页，用于瀑布流展示）
 */
export function getLevel2Classes() {
  return get('/basitemclass/level2')
}

/**
 * 获取三级分类列表（不分页，用于瀑布流展示）
 */
export function getLevel3Classes() {
  return get('/basitemclass/level3')
}
