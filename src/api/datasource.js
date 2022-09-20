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

export function getTableData(id,num,size) {
  return request({
    url: '/getTableDetails/' + id + '/' + num + '/' + size,
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

export function changeDic(data) {
  return request({
    url: '/changeDic',
    method: 'post',
    data
  })
}

export function deleteField(id,field) {
  return request({
    url: '/deleteField/' + id + '/' + field,
    method: 'post'
  })
}

export function addField(addTemp) {
  return request({
    url: '/addField/' + addTemp.id + '/' + addTemp.field + '/' + addTemp.type + '/' + addTemp.comment,
    method: 'post'
  })
}

export function tableTree() {
  return request({
    url: '/tableTree',
    method: 'get'
  })
}

export function nullSearch(id,field) {
  return request({
    url: '/getNull/' + id + '/' + field,
    method: 'get'
  })
}

export function nullUpdate(id,field,value,rowid) {
  return request({
    url: '/nullUpdate/' + id + '/' + field + '/' + value + '/' + rowid,
    method: 'get'
  })
}

export function jsonUpdate(id,field) {
  return request({
    url: '/jsonUpdate/' + id + '/' + field,
    method: 'get'
  })
}

export function deleteByNum(id,field,value,type) {
  return request({
    url: '/deleteByNum/' + id + '/' + field + '/' + value + '/' + type,
    method: 'get'
  })
}

export function deleteRepe(id) {
  return request({
    url: '/deleteRepe/' + id,
    method: 'get'
  })
}


