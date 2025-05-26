// src/api/menu.js
import { post, get,del,put } from '@/utils/request'

export function getUserMenus(userId) {
  return get('/menu/getMenuTree?userId=' + userId)
}

/**
 * 获取分页菜单列表
 * @param {Object} params - 分页参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页大小
 * @returns {Promise} - 返回菜单列表Promise
 */
export function getMenus(params) {
  return get('/menu/getpage', params)
}

/**
 * 根据ID获取菜单
 * @param {Object} params - 查询参数
 * @param {number} params.id - 菜单ID
 * @returns {Promise} - 返回菜单信息Promise
 */
export function getMenuById(params) {
  return get('/menu/get', params)
}

/**
 * 创建菜单
 * @param {Object} data - 菜单信息
 * @param {string} data.path - 路径
 * @param {string} data.title - 标题
 * @param {string} data.icon - 图标
 * @param {number} data.parentid - 父菜单ID
 * @returns {Promise} - 返回创建结果Promise
 */
export function createMenu(data) {
  return post('/menu/save', data)
}

/**
 * 更新菜单
 * @param {Object} data - 菜单信息
 * @param {number} data.id - 菜单ID
 * @param {string} data.path - 路径
 * @param {string} data.title - 标题
 * @param {string} data.icon - 图标
 * @param {number} data.parentid- 父菜单ID
 * @returns {Promise} - 返回更新结果Promise
 */
export function updateMenu(data) {
  return put('/menu/update', data)
}

/**
 * 删除菜单
 * @param {Object} params - 删除参数
 * @param {number} params.id - 菜单ID
 * @returns {Promise} - 返回删除结果Promise
 */
export function deleteMenu(params) {
  return del('/menu/delete', params)
}



/**
 * 获取用户菜单列表
 * @param {Object} params - 分页参数
 * @param {number} params.userId - 用户Id
 * @returns {Promise} - 返回用户菜单列表Promise
 */
export function getUserMenu(params) {
  return get('/usermenu/getpage', params)
}


export function getMenuTree(params) {
  return get('/menu/getMenuTree', params)
}


/**
 * 为用户添加菜单
 * @param {Object} params - 参数
 * @param {number} params.userId - 用户ID
 * @param {number} params.menuId - 菜单ID
 * @returns {Promise} - 返回操作结果Promise
 */
export function addMenuToUser(params) {
  return post('/usermenu/add', params)
}


/**
 * 从用户移除菜单
 * @param {Object} params - 参数
 * @param {number} params.userId - 用户ID
 * @param {number} params.menuId - 菜单ID
 * @returns {Promise} - 返回操作结果Promise
 */
export function removeMenuFromUser(params) {
  return del('/usermenu/delete', params)
}
