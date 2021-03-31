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

export function updatePerson(data,status) {
  return request({
    url: "/person/update?status=" + data.status,
    method: 'post',
    data
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/users/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/users/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/users/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/users/update',
    method: 'post',
    data
  })
}
