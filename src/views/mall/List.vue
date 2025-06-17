<template>
  <div class="mall-container">
    <Navbar />
    
    <el-row class="mall-header">
      <el-col :span="24">
        <el-input 
          v-model="searchText" 
          placeholder="搜索商品" 
          prefix-icon="el-icon-search"
          @keyup.enter="searchProduct">
          <template #append>
            <el-button @click="searchProduct">搜索</el-button>
          </template>
        </el-input>
        
        <el-radio-group v-model="sortType" size="small" style="margin-top: 10px; display: inline-block;">
          <el-radio-button label="default">默认排序</el-radio-button>
          <el-radio-button label="price-asc">价格从低到高</el-radio-button>
          <el-radio-button label="price-desc">价格从高到低</el-radio-button>
          <el-radio-button label="sales">销量优先</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    
    <el-row class="mall-content" :gutter="20">
      <el-col :span="6" v-for="product in filteredProducts" :key="product.id">
        <el-card 
          class="product-card" 
          :body-style="{ padding: '0px' }">
          <div class="product-image-container">
            <img :src="product.imageUrl" alt="商品图片" class="product-image">
          </div>
          <div class="product-info" style="padding: 14px;">
            <h3 class="product-title">{{ product.name }}</h3>
            <div class="product-price">
              <span class="current-price">¥{{ product.price }}</span>
              <span class="original-price" v-if="product.originalPrice > product.price">¥{{ product.originalPrice }}</span>
            </div>
            <div class="product-sales">销量: {{ product.sales }}</div>
            <el-button 
              type="primary" 
              size="small" 
              @click="addToCart(product)"
              :disabled="isProductInCart(product.id)">
              {{ isProductInCart(product.id) ? '已加入购物车' : '加入购物车' }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[8, 16, 24]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="products.length">
    </el-pagination>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '../../components/common/Navbar.vue'
import { ElMessage } from 'element-plus'
import { productApi, cartApi } from '../../api/cart.js'

const searchText = ref('')
const sortType = ref('default')
const currentPage = ref(1)
const pageSize = ref(8)

// 修改为从后端获取数据
const products = ref([])
const cart = ref([])
const loading = ref(false)

// 获取商品列表
const fetchProducts = async () => {
  try {
    loading.value = true
    console.log('[Mall View] 开始获取商品列表');
    const data = await productApi.getProducts()
    
    if (Array.isArray(data)) {
      products.value = data
      console.log('[Mall View] 商品列表获取成功，共', data.length, '个商品');
    } else {
      console.error('[Mall View] 商品数据格式异常:', data);
      products.value = []
      ElMessage.error('商品数据格式异常');
    }
  } catch (error) {
    console.error('[Mall View] 获取商品列表失败:', error);
    ElMessage.error('获取商品列表失败');
  } finally {
    loading.value = false
  }
}

// 获取购物车数据
const fetchCart = async () => {
  try {
    console.log('[Mall View] 开始获取购物车');
    const cartItems = await cartApi.getCart()
    cart.value = cartItems
    console.log('[Mall View] 购物车获取成功，共', cartItems.length, '个商品');
  } catch (error) {
    console.error('[Mall View] 获取购物车失败:', error);
    cart.value = []
  }
}

// 计算属性：过滤和排序后的商品
const filteredProducts = computed(() => {
  if (!Array.isArray(products.value)) {
    return []
  }

  let result = [...products.value]
  
  // 搜索过滤
  if (searchText.value) {
    result = result.filter(product => {
      const name = product.name || '';
      const description = product.description || '';
      const searchTerm = searchText.value.toLowerCase();
      
      return name.toLowerCase().includes(searchTerm) || 
             description.toLowerCase().includes(searchTerm);
    })
  }
  
  // 排序
  switch (sortType.value) {
    case 'price-asc':
      result.sort((a, b) => (a.price || 0) - (b.price || 0))
      break
    case 'price-desc':
      result.sort((a, b) => (b.price || 0) - (a.price || 0))
      break
    case 'sales':
      result.sort((a, b) => (b.sales || 0) - (a.sales || 0))
      break
    default:
      // 默认排序（按ID降序）
      result.sort((a, b) => (b.id || 0) - (a.id || 0))
  }
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 搜索商品
const searchProduct = () => {
  currentPage.value = 1
}

// 检查商品是否已在购物车中
const isProductInCart = (productId) => {
  if (!Array.isArray(cart.value) || !productId) {
    return false
  }
  return cart.value.some(item => item.productId === productId)
}

// 添加商品到购物车 - 使用真实API
const addToCart = async (product) => {
  if (!product || !product.id) {
    ElMessage.error('商品信息无效');
    return;
  }

  try {
    console.log('[Mall View] 添加商品到购物车:', product.name);
    
    // 调用后端API添加到购物车
    await cartApi.addToCart(product.id, 1);
    
    // 重新获取购物车数据以保持同步
    await fetchCart();
    
    ElMessage.success(`已将 ${product.name} 添加到购物车`);
  } catch (error) {
    console.error('[Mall View] 添加到购物车失败:', error);
    ElMessage.error(error.message || '添加到购物车失败');
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchProducts()
  fetchCart()
})
</script>

<style scoped>
.mall-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.mall-header {
  margin-bottom: 20px;
}

.mall-content {
  min-height: 500px;
}

.product-card {
  width: 100%;
  max-width: 285px;
  margin-bottom: 20px;
}

.product-image-container {
  height: 200px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.product-price {
  margin-bottom: 5px;
}

.current-price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: 600;
  margin-right: 10px;
}

.original-price {
  color: #909399;
  text-decoration: line-through;
  font-size: 14px;
}

.product-sales {
  color: #909399;
  font-size: 14px;
  text-align: left;
  margin-bottom: 10px;
}
</style>