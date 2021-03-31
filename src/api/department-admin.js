import request from '@/utils/request'

export function getDepartments() {
  return request({
    url: '/department/all',
    method: 'get'
    // params: query
  })
}
export function createDepartment(data) {
  return request({
    url: '/department/add',
    method: 'post',
    data
  })
}
export function deleteDepartment(id) {
  return request({
    url: '/person/delete',
    method: 'post',
    params:{
      id:id
    }
  })
}
