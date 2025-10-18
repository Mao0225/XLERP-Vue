import { uploadPost, uploadGet,get } from '@/utils/request'

/**
 * 启动自动上传任务
 * @param {Object} data - 请求参数
 * @param {string} data.task_id - 任务 ID（如 user_orders）
 * @returns {Promise<Object>} - 返回任务状态与间隔信息
 */
export function startUploadTask(task_id) {
  return uploadPost(`/v1/tasks/${task_id}/start`)
}

/**
 * 停止自动上传任务
 * @param {string} task_id - 任务 ID
 * @returns {Promise<Object>} - 返回停止结果
 */
export function stopUploadTask(task_id) {
  return uploadPost(`/v1/tasks/${task_id}/stop`)
}

/**
 * 查看任务运行状态
 * @param {string} task_id - 任务 ID
 * @returns {Promise<Object>} - 返回任务状态详情
 */
export function getTaskStatus(task_id) {
  return uploadGet(`/v1/tasks/${task_id}/status`)
}

/**
 * 列出所有任务及对应状态
 * @returns {Promise<Object>} - 返回所有任务的列表、状态和统计信息
 */
export function listAllTasks() {
  return uploadGet('/v1/tasks/ListAllTask')
}

/**
 * 获取对应任务分页列表
 * @param {Object} params - 分页参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页大小
 * @param {string} params.interfaceName - 后端接口名称
 * @returns {Promise} - 返回期间列表Promise
 */
export function getUploadLogPage(params) {
  return get('/uploadLog/getpage', params)
}