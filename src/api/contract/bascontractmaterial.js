import { get, post, put,del} from '@/utils/request'

// 根据合同编号获取备料列表
export function getContractMaterialList(params) {
  return get('/bas_contract_material/getMaterialList', params)
}
//分页查询
export function getContractMaterialPage(params) {
  return get('/bas_contract_material/getpage', params)
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