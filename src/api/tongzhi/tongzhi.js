import { post, get, put, del } from '@/utils/request'


// 更新单个合同产品的通知状态
//id，status
export function updateNoticeStatusById(data) {
  return get('/tongzhi/updateStatus', data)
}

//根据通知编号noticeid来更新这一批产品的通知状态
//noticeid，status
export function updateNoticeStatusByNoticeId(data) {
  return get('/tongzhi/updateBatchStatus', data)
}