import { post, get, put, del } from '@/utils/request'

/**
 * 上传单个文件
 * @param {FormData} data - 表单数据，必须包含文件和可选的folder参数
 * @param {File} data.file - 要上传的文件
 * @param {string} [data.folder] - 存储文件夹名称，默认为"common"
 * @returns {Promise} - 返回上传结果的Promise，包含文件URL
 */
export function uploadFile(data) {
  return post('/api/upload/file', data)
}

/**
 * 上传头像文件
 * @param {FormData} data - 表单数据，必须包含文件
 * @param {File} data.file - 要上传的头像文件
 * @returns {Promise} - 返回上传结果的Promise，包含头像URL
 */
export function uploadAvatar(data) {
  return post('/api/upload/avatar', data)
}

/**
 * 上传文件到自定义路径
 * @param {FormData} data - 表单数据，必须包含文件和路径参数
 * @param {File} data.file - 要上传的文件
 * @param {string} [data.path] - 自定义路径，默认为"custom"
 * @returns {Promise} - 返回上传结果的Promise，包含文件URL
 */
export function uploadToCustomPath(data) {
  return post('/api/upload/custom', data)
}

/**
 * 上传多个文件
 * @param {FormData} data - 表单数据，必须包含多个文件和可选的folder参数
 * @param {File[]} data.files - 要上传的多个文件
 * @param {string} [data.folder] - 存储文件夹名称，默认为"common"
 * @returns {Promise} - 返回上传结果的Promise，包含多个文件URL和总数
 */
export function uploadMultipleFiles(data) {
  return post('/api/upload/multiple', data)
}


//没有实现的

// /**
//  * 获取文件列表（分页）
//  * @param {Object} params - 分页和搜索参数
//  * @param {number} params.page - 页码
//  * @param {number} params.size - 每页大小
//  * @param {string} [params.folder] - 文件夹筛选
//  * @param {string} [params.fileName] - 文件名搜索关键字
//  * @returns {Promise} - 返回文件列表Promise
//  */
// export function getFiles(params) {
//   return get('/api/file/list', params)
// }

// /**
//  * 根据ID获取文件信息
//  * @param {Object} params - 查询参数
//  * @param {number} params.id - 文件ID
//  * @returns {Promise} - 返回文件信息Promise
//  */
// export function getFileById(params) {
//   return get('/api/file/get', params)
// }

// /**
//  * 更新文件信息
//  * @param {Object} data - 文件信息
//  * @param {number} data.id - 文件ID
//  * @param {string} [data.fileName] - 文件名称
//  * @param {string} [data.description] - 文件描述
//  * @returns {Promise} - 返回更新结果Promise
//  */
// export function updateFileInfo(data) {
//   return put('/api/file/update', data)
// }

// /**
//  * 删除文件
//  * @param {Object} params - 删除参数
//  * @param {number} params.id - 文件ID
//  * @returns {Promise} - 返回删除结果Promise
//  */
// export function deleteFile(params) {
//   return del('/api/file/delete', params)
// }

// /**
//  * 批量删除文件
//  * @param {Object} data - 批量删除参数
//  * @param {number[]} data.ids - 文件ID数组
//  * @returns {Promise} - 返回批量删除结果Promise
//  */
// export function batchDeleteFiles(data) {
//   return post('/api/file/batchDelete', data)
// }

// /**
//  * 移动文件到不同文件夹
//  * @param {Object} data - 移动文件参数
//  * @param {number} data.id - 文件ID
//  * @param {string} data.targetFolder - 目标文件夹
//  * @returns {Promise} - 返回移动结果Promise
//  */
// export function moveFile(data) {
//   return put('/api/file/move', data)
// }

// /**
//  * 获取文件统计信息
//  * @returns {Promise} - 返回文件统计信息Promise（总数量、总大小等）
//  */
// export function getFileStatistics() {
//   return get('/api/file/statistics')
// }

// /**
//  * 获取文件预览信息
//  * @param {Object} params - 预览参数
//  * @param {number} params.id - 文件ID
//  * @returns {Promise} - 返回文件预览信息Promise
//  */
// export function getFilePreview(params) {
//   return get('/api/file/preview', params)
// }