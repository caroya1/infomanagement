import api from './auth.js'

export const mallApi = {
  // 获取商品列表
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params })
      // 返回完整分页对象，兼容 records/total
      if (response.data && response.data.records) {
        return response.data
      } else if (Array.isArray(response.data)) {
        return { records: response.data, total: response.data.length }
      } else {
        return { records: [], total: 0 }
      }
    } catch (error) {
      console.error('获取商品列表失败:', error)
      return { records: [], total: 0 }
    }
  },

  // 获取商品详情
  async getProductById(id) {
    try {
      const response = await api.get(`/mall/products/${id}`)
      return response.data || null
    } catch (error) {
      console.error('获取商品详情失败:', error)
      return null
    }
  },

  // 新增商品（后端未实现！）
  // 请求: POST /mall/products
  // 参数: { name, price, sales, imageUrl }
  // 返回: { success: true, data: { ... } }
  async addProduct(product) {
    // TODO: 后端未实现此接口
    throw new Error('addProduct 接口后端未实现')
  },

  // 更新商品（后端未实现！）
  // 请求: PUT /mall/products/{id}
  // 参数: { name, price, sales, imageUrl }
  // 返回: { success: true, data: { ... } }
  async updateProduct(id, product) {
    // TODO: 后端未实现此接口
    throw new Error('updateProduct 接口后端未实现')
  },

  // 删除商品（后端未实现！）
  // 请求: DELETE /mall/products/{id}
  // 返回: { success: true }
  async deleteProduct(id) {
    // TODO: 后端未实现此接口
    throw new Error('deleteProduct 接口后端未实现')
  }
}
