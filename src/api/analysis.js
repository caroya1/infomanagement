import request from '@/utils/request'

// 获取用户运营数据
export function getUserStats() {
  return request({
    url: '/api/analysis/users/stats',
    method: 'get'
  })
}

// 获取论坛统计数据
export function getForumStats() {
  return request({
    url: '/api/analysis/forum/stats',
    method: 'get'
  })
}

// 获取热门预约活动
export function getHotReservations() {
  return request({
    url: '/api/analysis/reservations/hot',
    method: 'get'
  })
}
