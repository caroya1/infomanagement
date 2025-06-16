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
import { ref, computed } from 'vue'
import Navbar from '../components/Navbar.vue'

const searchText = ref('')
const sortType = ref('default')
const currentPage = ref(1)
const pageSize = ref(8)

const products = ref([
  {
    id: 1,
    name: '高级智能手表',
    description: '具有心率监测、睡眠分析等多种功能的智能手表',
    price: 1299,
    originalPrice: 1599,
    sales: 2345,
    imageUrl: 'https://picsum.photos/400/400?random=21'
  },
  {
    id: 2,
    name: '无线蓝牙耳机',
    description: '主动降噪，高清通话，长时间续航的无线耳机',
    price: 799,
    originalPrice: 999,
    sales: 1876,
    imageUrl: 'https://picsum.photos/400/400?random=22'
  },
  {
    id: 3,
    name: '超薄笔记本电脑',
    description: '14英寸轻薄本，高性能处理器，长续航',
    price: 5699,
    originalPrice: 6299,
    sales: 987,
    imageUrl: 'https://picsum.photos/400/400?random=23'
  },
  {
    id: 4,
    name: '4K高清电视',
    description: '55英寸4K智能电视，HDR，AI语音控制',
    price: 3499,
    originalPrice: 3999,
    sales: 1234,
    imageUrl: 'https://picsum.photos/400/400?random=24'
  },
  {
    id: 5,
    name: '机械键盘',
    description: 'RGB背光，青轴机械键盘，全键无冲',
    price: 399,
    originalPrice: 499,
    sales: 3456,
    imageUrl: 'https://picsum.photos/400/400?random=25'
  },
  {
    id: 6,
    name: '游戏鼠标',
    description: '可编程按键，高精度传感器，RGB灯光',
    price: 199,
    originalPrice: 249,
    sales: 4567,
    imageUrl: 'https://picsum.photos/400/400?random=26'
  },
  {
    id: 7,
    name: '便携充电宝',
    description: '20000mAh大容量，双向快充',
    price: 149,
    originalPrice: 199,
    sales: 5678,
    imageUrl: 'https://picsum.photos/400/400?random=27'
  },
  {
    id: 8,
    name: '智能音箱',
    description: '支持语音助手，智能家居控制',
    price: 249,
    originalPrice: 299,
    sales: 2345,
    imageUrl: 'https://picsum.photos/400/400?random=28'
  }
])

// 购物车数据
const cart = ref([
  // 示例购物车数据
  {
    productId: 1,
    quantity: 1
  }
])

// 计算属性：过滤和排序后的商品
const filteredProducts = computed(() => {
  let result = [...products.value]
  
  // 搜索过滤
  if (searchText.value) {
    result = result.filter(product => 
      product.name.toLowerCase().includes(searchText.value.toLowerCase()) || 
      product.description.toLowerCase().includes(searchText.value.toLowerCase())
    )
  }
  
  // 排序
  switch (sortType.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'sales':
      result.sort((a, b) => b.sales - a.sales)
      break
    default:
      // 默认排序（按ID降序）
      result.sort((a, b) => b.id - a.id)
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
  return cart.value.some(item => item.productId === productId)
}

// 添加商品到购物车
const addToCart = (product) => {
  if (isProductInCart(product.id)) {
    // 如果商品已在购物车中，可以增加数量
    const cartItem = cart.value.find(item => item.productId === product.id)
    cartItem.quantity += 1
  } else {
    // 如果商品不在购物车中，添加新项
    cart.value.push({
      productId: product.id,
      quantity: 1
    })
  }
  
  // 提示用户
  alert('商品已添加到购物车！')
}
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