import request from '@/utils/request'

/**
 * 1. 分页查询橡胶检验数据
 * @param {Object} params - 查询参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} [params.mafactoryname] - 供应商名称
 * @param {string} [params.matRecheckNo] - 来料检验批次号
 * @param {string} [params.contractno] - 合同编号
 * @param {string} [params.material] - 材质
 * @param {string} [params.mattype] - 规格
 * @param {string} [params.status] - 状态
 * @param {string} [params.inNo] - 检验单号
 * @returns {Promise<Object>} - 响应结果
 */
export function getXjPage(params) {
  return request({
    url: '/cl_xj/getpage',
    method: 'get',
    params
  })
}

/**
 * 2. 根据ID查询橡胶检验记录
 * @param {number} id - 记录ID
 * @returns {Promise<Object>} - 响应结果
 */
export function getXjById(id) {
  return request({
    url: '/cl_xj/get',
    method: 'get',
    params: { id }
  })
}

/**
 * 3. 新增橡胶检验记录
 * @param {Object} data - 新增数据
 * @returns {Promise<Object>} - 响应结果
 */
export function createXj(data) {
  return request({
    url: '/cl_xj/save',
    method: 'post',
    data
  })
}

/**
 * 4. 更新橡胶检验记录
 * @param {Object} data - 更新数据
 * @returns {Promise<Object>} - 响应结果
 */
export function updateXj(data) {
  return request({
    url: '/cl_xj/update',
    method: 'put',
    data
  })
}

/**
 * 5. 删除橡胶检验记录
 * @param {number} id - 记录ID
 * @returns {Promise<Object>} - 响应结果
 */
export function deleteXj(id) {
  return request({
    url: '/cl_xj/delete',
    method: 'delete',
    params: { id }
  })
}

/**
 * 6. 批量删除橡胶检验记录
 * @param {Array<number>} ids - 记录ID数组
 * @returns {Promise<Object>} - 响应结果
 */
export function batchDeleteXj(ids) {
  return request({
    url: '/cl_xj/batchdelete',
    method: 'delete',
    params: { ids: ids.join(',') }
  })
}

/**
 * 7. 更新橡胶检验记录状态
 * @param {Object} params - 参数
 * @param {number} params.id - 记录ID
 * @param {string} params.status - 状态
 * @param {string} params.updatePerson - 更新人
 * @returns {Promise<Object>} - 响应结果
 */
export function updateXjStatus(params) {
  return request({
    url: '/cl_xj/updateStatus',
    method: 'get',
    params
  })
}