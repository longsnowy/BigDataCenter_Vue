import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/person/list',
    method: 'get',
    params: query
  })
}
export function getUsers(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}
export function createPerson(data) {
  return request({
    url: '/person/add',
    method: 'post',
    params:data
  })
}
export function deletePerson(id) {
  return request({
    url: '/person/delete',
    method: 'post',
    params:{
      id:id
    }
  })
}
export function addPerson(data,status) {
  return request({
    url: "/person/add?status=" + status,
    method: 'post',
    data
  })
}
export function getPerformanceById(Id) {
  return request({
    url: '/performance',
    method: 'post',
    params: { Id }
  })
}

export function updatePerson(data) {
  return request({
    url: "/person/update",
    method: 'post',
    data
  })
}

export function updatUser(data) {
  return request({
    url: "/user/revise",
    method: 'post',
    data
  })
}

