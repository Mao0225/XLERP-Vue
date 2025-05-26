import { post, get } from '@/utils/request'

/**
 * 获取分页部门列表
 */
export function getBasOrgs(params) {
  return get('/basorg/getpage', params)
}

/**
 * 根据ID获取部门
 */
export function getBasOrgById(params) {
  return get('/basorg/get', params)
}

/**
 * 创建部门
 */
export function createBasOrg(data) {
  return get('/basorg/save', data)
}

/**
 * 更新部门
 */
export function updateBasOrg(data) {
  return get('/basorg/update', data)
}

/**
 * 删除部门
 */
export function deleteBasOrg(params) {
  return get('/basorg/delete', params)
}