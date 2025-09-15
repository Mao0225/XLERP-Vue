import request from '@/utils/request'

// 分页查询橡胶检验记录
export function getXjPage(query) {
  return request({
    url: '/cl_xj/getpage',
    method: 'get',
    params: query
  })
}

// 根据ID查询橡胶检验记录
export function getXjById(id) {
  return request({
    url: '/cl_xj/get',
    method: 'get',
    params: { id }
  })
}

// 新增橡胶检验记录
export function createXj(data) {
  return request({
    url: '/cl_xj/save',
    method: 'post',
    data
  })
}

// 更新橡胶检验记录
export function updateXj(data) {
  return request({
    url: '/cl_xj/update',
    method: 'put',
    data
  })
}

// 删除橡胶检验记录
export function deleteXj(id) {
  return request({
    url: '/cl_xj/delete',
    method: 'delete',
    params: { id }
  })
}

// 批量删除橡胶检验记录
export function batchDeleteXj(ids) {
  return request({
    url: '/cl_xj/batchdelete',
    method: 'delete',
    params: { ids }
  })
}