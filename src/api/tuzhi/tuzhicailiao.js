import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页图纸材料列表
 * @param {Object} params - 分页和搜索参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {number} params.tuzhiid - 图纸ID
 * @returns {Promise} - 返回图纸材料列表Promise
 */
export function getTuzhicailiaos(params) {
  return get('/tuzhicailiao/getpage', params)
}

/**
 * 根据ID获取图纸材料
 * @param {Object} params - 查询参数
 * @param {number} params.id - 图纸材料ID
 * @returns {Promise} - 返回图纸材料信息Promise
 */
export function getTuzhicailiaoById(params) {
  return get('/tuzhicailiao/get', params)
}

/**
 * 创建图纸材料
 * @param {Object} data - 图纸材料信息
 * @param {number} data.tuzhiid - 图纸ID
 * @param {number} data.basitemid - 关联的basitem表里的id字段
 * @param {string} data.shuliang - 所需材料的数量
 * @param {number} data.flag - 预留字段
 * @param {number} data.type - 预留字段
 * @param {string} data.memo - 备注
 * @param {string} data.writetime - 数据写入时间
 * @param {string} data.writer - 数据录入者
 * @returns {Promise} - 返回创建结果Promise
 */
export function createTuzhicailiao(data) {
  return post('/tuzhicailiao/save', data)
}

/**
 * 更新图纸材料
 * @param {Object} data - 图纸材料信息
 * @param {number} data.id - 图纸材料ID
 * @param {number} data.tuzhiid - 图纸ID
 * @param {number} data.basitemid - 关联的basitem表里的id字段
 * @param {string} data.shuliang - 所需材料的数量
 * @param {number} data.flag - 预留字段
 * @param {number} data.type - 预留字段
 * @param {string} data.memo - 备注
 * @param {string} data.writetime - 数据写入时间
 * @param {string} data.writer - 数据录入者
 * @returns {Promise} - 返回更新结果Promise
 */
export function updateTuzhicailiao(data) {
  return put('/tuzhicailiao/update', data)
}

/**
 * 删除图纸材料
 * @param {Object} params - 删除参数
 * @param {number} params.id - 图纸材料ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteTuzhicailiao(params) {
  return del('/tuzhicailiao/delete', params)
}

/**
 * 获取原材料分页列表
 * @param {Object} params - 分页和搜索参数
 * @param {number} params.pageNumber - 页码
 * @param {number} params.pageSize - 每页大小
 * @param {string} params.itemno - 物料编号搜索关键字
 * @param {string} params.name - 物料名称搜索关键字
 * @returns {Promise} - 返回原材料列表Promise
 */
export function getYuancailiaoPage(params) {
  return get('/basitem/getyuancailiaopage', params)
}