import { post, get, put, del } from '@/utils/request'

/**
 * 获取分页图纸列表
 * @param {Object} params - 分页和搜索参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页大小
 * @param {string} [params.tuzhimingcheng] - 图纸名称搜索关键字
 * @returns {Promise} - 返回图纸列表Promise
 */
export function getTuzhis(params) {
  return get('/bastuzhi/getpage', params)
}

/**
 * 根据ID获取图纸
 * @param {Object} params - 查询参数
 * @param {number} params.id - 图纸ID
 * @returns {Promise} - 返回图纸信息Promise
 */
export function getTuzhiById(params) {
  return get('/bastuzhi/get', params)
}

/**
 * 创建图纸
 * @param {Object} data - 图纸信息
 * @param {string} data.tuzhibianhao - 图纸编号
 * @param {string} data.tuzhimingcheng - 图纸名称
 * @param {string} data.tuzhizuozhe - 图纸作者
 * @param {string} data.chuangzuoriqi - 创作日期
 * @param {string} data.tuzhimiaoshu - 图纸描述
 * @param {string} data.memo - 备注
 * @param {number} data.flag - 预留字段
 * @param {number} data.type - 预留字段
 * @param {string} data.writer - 数据录入者
 * @param {string} data.tuzhiurl - 图纸文件URL
 * @returns {Promise} - 返回创建结果Promise
 */
export function createTuzhi(data) {
  return post('/bastuzhi/save', data)
}

/**
 * 更新图纸
 * @param {Object} data - 图纸信息
 * @param {number} data.id - 图纸ID
 * @param {string} data.tuzhibianhao - 图纸编号
 * @param {string} data.tuzhimingcheng - 图纸名称
 * @param {string} data.tuzhizuozhe - 图纸作者
 * @param {string} data.chuangzuoriqi - 创作日期
 * @param {string} data.tuzhimiaoshu - 图纸描述
 * @param {string} data.memo - 备注
 * @param {number} data.flag - 预留字段
 * @param {number} data.type - 预留字段
 * @param {string} data.writer - 数据录入者
 * @param {string} data.tuzhiurl - 图纸文件URL
 * @returns {Promise} - 返回更新结果Promise
 */
export function updateTuzhi(data) {
  return put('/bastuzhi/update', data)
}

/**
 * 删除图纸
 * @param {Object} params - 删除参数
 * @param {number} params.id - 图纸ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteTuzhi(params) {
  return del('/bastuzhi/delete', params)
}

/**
 * 根据Xls和xlsx文件导入基础物料列表
 * @param {File} itemListFile 文件
 * @return {tuzhiList} 图纸列表
 */
export function importTuzhiList(data) {
  return post('/bastuzhi/importTuzhi', data)
}
 