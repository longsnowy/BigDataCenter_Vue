import request from '@/utils/request'

export function getOldSaying() {
  return request({
    url: 'http://api.tianapi.com/txapi/lzmy/index?key=c52eeada6a66d2f154689e906dcc90d6',
    method: 'get'
  })
}
