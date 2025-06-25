import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页合同列表
 */
export function getContractList(params) {
  return get('/tongzhi/getpage', params)
}

/**
 * 根据合同编号获取合同信息和物料明细
 */
export function getContractInfoByNo(params) {
  return get('/bascontract/getContractInfoByNo', params)
}
 


/**
 * 获取合同关联物料
 * @param {number} itemId 物料ID
 */
export function getBasContractItem(param) {
  return get('/bascontract/getitem', param)
}
  

/**
 * 获取分页图纸列表,这个功能是在制定通知的时候，选择图纸列表的界面。
 * @param {Object} params - 分页和搜索参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页大小
 * @param {string} [params.tuzhimingcheng] - 图纸名称搜索关键字
 * @returns {Promise} - 返回图纸列表Promise
 */
export function getTuzhis(params) {
  return get('/tongzhi/getpage', params)
}

 

export function getDrawingList(params) {
  return get('/tongzhi/gettuzhilist', params)
}

/**
 * 更新合同关联物料
 * @param {object} data 物料数据
 */
export function updatetuzhiItem(data) {
  return put('/tongzhi/updateitem', data)
}