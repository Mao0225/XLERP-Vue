import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页物料列表
 */
export function getBasItems(params) {
  return get('/basitem/getpage', params)
}

/**
 * 根据ID获取物料
 * @param {Object} params - 查询参数
 * @param {number} params.id - 物料ID
 * @returns {Promise} - 返回物料信息Promise
 */
export function getBasItemById(params) {
  return get('/basitem/get', params)
}


export function createBasItem(data) {
  return post('/basitem/save', data)
}


export function updateBasItem(data) {
  return put('/basitem/update', data)
}

/**
 * 删除物料
 * @param {Object} params - 删除参数
 * @param {number} params.id - 物料ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteBasItem(params) {
  return del('/basitem/delete', params)
}



/**
 * 根据Xls和xlsx文件导入基础物料列表
 * @param {File} itemListFile 文件
 * @return {itemList} 物料列表
 */
export function importItemList(data) {
  return post('/basitem/importItem', data)
}

/**
 * 获取物料的材料树形结构
 * @param {Object} params - 查询参数
 * @param {number} params.id - 物料ID
 * @returns {Promise} - 返回材料树Promise
 */
export function getMaterialTree(params) {
  return get('/basitem/material/tree', params)
}

/**
 * 获取物料的材料平铺列表
 * @param {Object} params - 查询参数
 * @param {number} params.id - 物料ID
 * @returns {Promise} - 返回材料列表Promise
 */
export function getMaterialList(params) {
  return get('/basitem/material/list', params)
}

/**
 * 获取物料的子物料列表
 * @param {Object} params - 查询参数
 * @param {number} params.id - 物料ID
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @returns {Promise} - 返回子物料列表Promise
 */
export function getChildMaterials(params) {
  return get('/basitem/material/childList', params)
}

/**
 * 添加子物料关系（发送JSON格式数据）
 * @param {Object} data - 包含parentItemId, childItemId, quantity, memo的对象
 * @returns {Promise}
 */
export function addMaterialRelation(data) {
  // 1. 发送前最后一次验证参数
  console.log('准备发送的子物料参数:', data)
  if (!data.parentItemId || !data.childItemId) {
    console.error('参数缺失！parentItemId:', data.parentItemId, 'childItemId:', data.childItemId)
    return Promise.reject(new Error('父物料ID或子物料ID不能为空'))
  }

  // 2. 使用已导入的post方法（关键修复）
  return post('/basitem/material/addRelation', data)
    .then(response => {
      if (response.success) {
        return response.data
      } else {
        return Promise.reject(new Error(response.msg || '添加子物料失败'))
      }
    }).catch(error => {
      console.error('添加子物料接口调用失败:', error)
      return Promise.reject(error)
    })
}

/**
 * 移除子物料关系
 * @param {Object} params - 删除参数
 * @param {number} params.relationId - 关系ID
 * @returns {Promise} - 返回移除结果Promise
 */
export function removeMaterialRelation(params) {
  return del('/basitem/material/removeRelation', params)
}

/**
 * 获取所有物料分页列表（用于选择子物料）
 * @param {Object} params - 分页和搜索参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.itemNo - 物料编号搜索关键字
 * @param {string} params.itemName - 物料名称搜索关键字
 * @returns {Promise} - 返回物料列表Promise
 */
export function getAllMaterialsPage(params) {
  return get('/basitem/getpage', params)
}