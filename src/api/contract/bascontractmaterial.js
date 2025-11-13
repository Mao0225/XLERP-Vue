import { get, post, put } from '@/utils/request'

// 根据合同编号获取备料列表
export function getContractMaterialList(params) {
  return get('/bas_contract_material/getMaterialList', params)
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