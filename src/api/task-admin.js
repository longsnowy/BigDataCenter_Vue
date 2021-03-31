import request from '@/utils/request'

export function getTasks(data,page,num) {
  return request({
    url: '/task/all?page='+page+'&num='+num,
    method: 'post',
    data
  })
}
export function getSelfTasks() {
  return request({
    url: '/task/self',
    method: 'post',
    // data
  })
}
export function createTask(data) {
  return request({
    url: '/task/add',
    method: 'post',
    data
  })
}
export function updateTask(data) {
  return request({
    url: '/task/update',
    method: 'post',
    data
  })
}
export function deleteTaskById(id) {
  return request({
    url: '/task/delete',
    method: 'post',
    params:{
      id:id
    }
  })
}

export function fetchTask(id) {
  return request({
    url: '/task/query',
    method: 'get',
    params: { id }
  })
}
