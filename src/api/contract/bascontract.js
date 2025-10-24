import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页合同列表
 */
export function getContractList(params) {
  return get('/bascontract/getContractList', params)
}

/**
 * 根据合同编号获取单个合同信息
 */
export function getContractInfoByNo(params) {
  return get('/bascontract/getContractByNo', params)
}

/**
 * 根据合同编号获取合同信息和物料明细
 */
export function getContractByNo(params) {
  return get('/bascontract/getContractInfoByNo', params)
}



/**
 * 创建合同
 */
export function createBasContract(data) {
  return post('/bascontract/save', data)
}

/**
 * 更新合同
 */
export function updateBasContract(data) {
  return put('/bascontract/update', data)
}

/**
 * 删除合同
 */
export function deleteBasContract(params) {
  return del('/bascontract/delete', params)
}



/**
 * 获取合同关联物料
 * @param {number} itemId 物料ID
 */
export function getBasContractItem(param) {
  return get('/bascontract/getitem', param)
}

/**
 * 创建合同关联物料
 * @param {object} data 物料数据
 */
export function createBasContractItem(data) {
  return post('/bascontract/saveitem', data)
}

/**
 * 更新合同关联物料
 * @param {object} data 物料数据
 */
export function updateBasContractItem(data) {
  return put('/bascontract/updateitem', data)
}

/**
 * 删除合同关联物料
 * @param {number} itemId 物料ID
 */
export function deleteBasContractItem(param) {
  return del('/bascontract/deleteitem', param)
}


/**
 * 更新合同状态
 * @param {number} contractId 合同ID
 * @param {number} status 合同状态ID
 */
export function updateBasContractStatus(data) {
  return put('/bascontract/updateStatusById', data)
}



/**
 * 根据Xls和xlsx文件导入合同物料列表
 * @param {File} itemListFile 文件
 * @return {itemList} 物料列表
 */
export function importContractItem(data) {
  return post('/bascontract/importContractItem', data)
}

/**
 * 获取确认状态的合同列表分页查询
 */
export function getConfirmContract(params) {
  return get('/bascontract/getConfirmedList',params)
}

/**
 * 获取合同物料列表<分页查询>根据合同编号，分页查询
 */
export function getContractItemPage(params) {
  return get('/bascontract/getContractItemPage',params)
}


/**
 * 获取合同<完整>物料列表查询根据合同编号
 */
export function getContractItemList(params) {
  return get('/bascontract/getContractItemList',params)
}


/**
 * 获取合同物料总金额和总重
 */
export function getContractItemTotal(params) {
  return get('/bascontract/getContractItemSummary',params)
}