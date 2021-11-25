import request from '@/utils/request'

export function getDataSources(data) {
  return request({
    url: '/query/1/1000',
    method: 'post',
    data
  })
}

export function deleteDataSource(id) {
  return request({
    url: '/delete/' + id,
    method: 'get'
  })
}

export function getTableData(id) {
  return request({
    url: '/getTableDetails/' + id,
    method: 'get'
  })
}

export function getDictionary(id) {
  return request({
    url: '/getDictionary/' + id,
    method: 'get'
  })
}

export function getFileUrl(id) {
  return request({
    url: '/getfileurl/' + id,
    method: 'get'
  })
}

export function addOneData(data, id) {
  return request({
    url: '/addonedatabydic/' + id,
    method: 'post',
    data
  })
}

export function addFromExcel(data, id) {
  return request({
    url: '/addonedatabydic/' + id,
    method: 'post',
    data
  })
}

export function updateDic(id, field, type, comment) {
  return request({
    url: '/updateDic/' + id + '/' + field + '/' + type + '/' + comment,
    method: 'get',
  })
}



