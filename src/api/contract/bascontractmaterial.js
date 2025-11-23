import { get, post, put,del} from '@/utils/request'

// 根据合同编号获取备料列表
export function getContractMaterialList(params) {
  return get('/bas_contract_material/getMaterialList', params)
}
//分页查询--用于采购计划选择关联
export function getContractMaterialPage(params) {
  return get('/bas_contract_material/getpage', params)
}

//分页查询--用于检验单选择的时候应该是返回已经关联过采购计划的，也就是purchaseOrderNo不为空的
export function getContractMaterialPageForInsp(params) {
  return get('/bas_contract_material/getpageForInsp', params)
}

// 新增备料记录
export function saveContractMaterial(data) {
  return post('/bas_contract_material/save', data)
}
// 新增备料记录
export function batchSaveContractMaterial(data) {
  return post('/bas_contract_material/batchSave', data)
}
// 更新备料记录
export function updateContractMaterial(data) {
  return put('/bas_contract_material/update', data)
}

// 删除备料记录
export function deleteContractMaterial(params) {
  return del('/bas_contract_material/delete', params)
}

//根据合同号删除备料记录
export function deleteMaterialByContractNo(params) {
  return del('/bas_contract_material/deleteByContractNo', params)
}

//一键生成备料记录
export function generateContractMaterialList(data) {
  return get('/bas_contract_material/generateMaterialList', data)
}

//获取单个备料记录通过id--用于检验单关联
export function getContractMaterial(params) {
  return get('/bas_contract_material/getById', params)
}

