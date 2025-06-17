import api from './auth.js'

export const userApi = {
  // 查询用户列表，支持分页、排序、搜索
  async getUsers(params = {}) {
    try {
      const response = await api.get('/user/userinfo', { params })
      if (response.status === 403) {
        console.warn('getUsers 接口后端未实现或无权限')
        return { records: [], total: 0, notImplemented: true }
      }
      if (response.data && response.data.records) {
        return response.data
      } else if (Array.isArray(response.data)) {
        return { records: response.data, total: response.data.length }
      } else {
        return { records: [], total: 0 }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.warn('getUsers 接口后端未实现或无权限')
        return { records: [], total: 0, notImplemented: true }
      }
      console.error('获取用户列表失败:', error)
      return { records: [], total: 0 }
    }
  },

  // 删除用户
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/user/users/${userId}`)
      if (response.status === 403) {
        console.warn('deleteUser 接口后端未实现或无权限')
        throw new Error('deleteUser 接口后端未实现')
      }
      return response.success
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.warn('deleteUser 接口后端未实现或无权限')
        throw new Error('deleteUser 接口后端未实现')
      }
      console.error('删除用户失败:', error)
      throw error
    }
  },

  // 用户统计信息（如总数、余额统计等，需后端支持）
  async getUserStats() {
    try {
      const response = await api.get('/user/users/stats')
      if (response.status === 403) {
        console.warn('getUserStats 接口后端未实现或无权限')
        return { notImplemented: true }
      }
      return response.data || {}
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.warn('getUserStats 接口后端未实现或无权限')
        return { notImplemented: true }
      }
      console.error('获取用户统计失败:', error)
      return {}
    }
  }
}
