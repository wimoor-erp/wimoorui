import request from "@/utils/request";

export function getInfo() {
  return request({
    url: '/api/admin/api/v1/users/info',
    method: 'get'
  })
}