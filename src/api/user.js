import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function login(data,token) {
  // console.log('api' + token);
  return request({
    //url: '/vue-element-admin/user/login',
    url: '/login',
    method: 'post',
    headers: {
      'Access-Token': token,
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function getCode() {
  return request({
    url: '/getcode',
    method: 'get',
    responseType: 'blob'
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function sign() {
  return request({
    url: '/sign/add',
    method: 'post'
  })
}

export function signedList(data,pageOps) {
  return request({
    url: '/sign/all?page=' + pageOps.page + '&num=' + pageOps.num,
    method: 'post',
    data
  })
}

export function getSelf() {
  return request({
    url: '/user/self',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/loginout',
    method: 'post'
  })
}
