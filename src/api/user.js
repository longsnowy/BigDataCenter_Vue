import request from '@/utils/request'

export function login(data,token) {
  console.log('api' + token);
  return request({
    url: '/vue-element-admin/user/login',
    //url: '/api/login',
    method: 'post',
    headers: {
      'Access-Token': token,
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
