<template>
  <div class="profile-container">
    <Navbar />

    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="个人信息" name="info">
        <el-form :model="userInfo" label-width="120px">
          <el-form-item label="用户名">
            <el-input v-model="userInfo.username" disabled />
          </el-form-item>
          <el-form-item label="账户余额">
            <el-input v-model="userInfo.balance" disabled>
              <template #prepend>¥</template>
              <template #append>
                <el-button @click="showRechargeDialog = true">充值</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="userInfo.nickname" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userInfo.phone" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="userInfo.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
              <el-radio label="other">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveUserInfo">保存修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="购物车" name="cart">
        <el-table :data="cartItems" stripe style="width: 100%">
          <el-table-column label="" width="80">
            <template #default="scope">
              <img :src="scope.row.imageUrl" alt="商品图片" class="cart-product-image">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品名称" min-width="200">
            <template #default="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" width="100">
            <template #default="scope">
              <span>¥{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="150">
            <template #default="scope">
              <el-input-number v-model="scope.row.quantity" :min="1" @change="handleQuantityChange(scope.row)"
                size="small">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="小计" width="100">
            <template #default="scope">
              <span>¥{{ scope.row.totalPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button size="mini" type="danger" @click="removeFromCart(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="cart-summary">
          <span>总计: ¥{{ totalPrice }}</span>
          <el-button type="primary" @click="checkout">结算</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="订单管理" name="orders">
        <el-table :data="orders" stripe style="width: 100%">
          <el-table-column prop="orderId" label="订单编号" width="180"></el-table-column>
          <el-table-column prop="createTime" label="下单时间" width="160"></el-table-column>
          <el-table-column label="商品信息" min-width="300">
            <template #default="scope">
              <div v-for="item in scope.row.items" :key="item.productId" class="order-item">
                <img :src="item.imageUrl" alt="商品图片" class="order-product-image">
                <span>{{ item.name }} × {{ item.quantity }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="订单金额" width="100"></el-table-column>
          <el-table-column prop="status" label="订单状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button size="mini" v-if="scope.row.status === 'pending'" @click="cancelOrder(scope.row)">
                取消订单
              </el-button>
              <el-button size="mini" v-if="scope.row.status === 'shipped'" @click="confirmReceipt(scope.row)">
                确认收货
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="我的内容" name="content">
        <el-tabs v-model="contentActiveTab">
          <el-tab-pane label="我的文章" name="articles">
            <el-table :data="articles" stripe>
              <el-table-column prop="title" label="文章标题"></el-table-column>
              <el-table-column prop="createTime" label="创建时间"></el-table-column>
              <el-table-column prop="status" label="状态"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="我的收藏" name="favorites">
            <el-table :data="favorites" stripe>
              <el-table-column label="收藏" width="80">
                <template #default="scope">
                  <el-icon color="yellow" @click="removeFavorite(scope.row.id)">
                    <StarFilled />
                  </el-icon>
                </template>
              </el-table-column>
              <el-table-column prop="title" label="收藏标题"></el-table-column>
              <el-table-column prop="author" label="作者"></el-table-column>
              <el-table-column prop="createTime" label="发布时间"></el-table-column>
              <el-table-column prop="views" label="浏览量"></el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="我的预约" name="reservations">
            <el-table :data="userReservations" stripe>
              <el-table-column prop="title" label="活动标题"></el-table-column>
              <el-table-column prop="author" label="发布者"></el-table-column>
              <el-table-column prop="createTime" label="发布时间"></el-table-column>
              <el-table-column prop="reservedCount" label="已预约人数"></el-table-column>
            </el-table>
          </el-tab-pane>

        </el-tabs>
      </el-tab-pane>

      <el-tab-pane label="退出登录" name="logout">
        <div class="logout-container">
          <p>确定要退出当前账号吗？</p>
          <el-button type="primary" @click="logout">确认退出</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 充值对话框 -->
    <el-dialog v-model="showRechargeDialog" title="账户充值" width="400px">
      <el-form :model="rechargeForm" label-width="100px">
        <el-form-item label="充值金额" required>
          <el-input v-model="rechargeForm.amount" type="number" placeholder="请输入充值金额">
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="支付方式" required>
          <el-radio-group v-model="rechargeForm.paymentMethod">
            <el-radio label="alipay">支付宝</el-radio>
            <el-radio label="wechat">微信支付</el-radio>
            <el-radio label="bank_card">银行卡</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="快捷金额">
          <el-button-group>
            <el-button @click="setQuickAmount(50)">¥50</el-button>
            <el-button @click="setQuickAmount(100)">¥100</el-button>
            <el-button @click="setQuickAmount(200)">¥200</el-button>
            <el-button @click="setQuickAmount(500)">¥500</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showRechargeDialog = false">取消</el-button>
          <el-button type="primary" @click="handleRecharge" :loading="rechargeLoading">
            确认充值
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 充值记录对话框 -->
    <el-dialog v-model="showRechargeHistoryDialog" title="充值记录" width="600px">
      <el-table :data="rechargeHistory" stripe>
        <el-table-column prop="amount" label="充值金额" width="120">
          <template #default="scope">
            <span>¥{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="100">
          <template #default="scope">
            <span>{{ getPaymentMethodText(scope.row.paymentMethod) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">
              {{ scope.row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="transactionId" label="交易号" width="140"></el-table-column>
        <el-table-column prop="createTime" label="充值时间" width="160"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserInfo, logout } from '../api/auth.js';
import { favoriteApi, rechargeApi } from '../api/common.js';
import { cartApi, orderApi } from '../api/cart.js'
import { useRouter } from 'vue-router'
import api from '../api/auth.js'; // 导入api实例用于直接API调用

const router = useRouter();
const activeTab = ref('info');
const contentActiveTab = ref('articles');

// 收藏相关
const favorites = ref([]);

// 用户信息 - 添加余额显示
const userInfo = ref({
  username: 'test_user',
  nickname: '测试用户',
  email: 'test@example.com',
  phone: '13800138000',
  gender: 'other',
  balance: 0 // 添加余额字段
});

const imageUrl = ref('https://picsum.photos/100/100?random=31');

// 购物车相关
const cart = ref([])

// 订单相关
const orders = ref([])

// 添加缺失的响应式数据定义
const articles = ref([]) // 用户文章列表
const userReservations = ref([]) // 用户预约列表

// 充值相关
const showRechargeDialog = ref(false);
const rechargeForm = ref({
  amount: 0,
  paymentMethod: 'alipay'
});
const rechargeLoading = ref(false);
const showRechargeHistoryDialog = ref(false);
const rechargeHistory = ref([]);

// 获取购物车数据
const loadCart = async () => {
  try {
    console.log('[Profile View] 开始获取购物车数据');
    const cartItems = await cartApi.getCart()
    cart.value = cartItems
    console.log('[Profile View] 购物车数据获取成功，共', cartItems.length, '个商品');
  } catch (error) {
    console.error('[Profile View] 获取购物车数据失败:', error);
    cart.value = []
    ElMessage.error('获取购物车数据失败');
  }
}

// 计算购物车商品信息 - 使用后端返回的完整数据
const cartItems = computed(() => {
  if (!Array.isArray(cart.value)) {
    return []
  }

  return cart.value.map(item => ({
    id: item.productId,
    name: item.productName || '未知商品',
    price: item.productPrice || 0,
    imageUrl: item.productImageUrl || 'https://picsum.photos/100/100?random=1',
    quantity: item.quantity || 1,
    totalPrice: item.productPrice ? (item.productPrice * item.quantity) : 0
  }))
})

// 计算购物车总价
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.totalPrice || 0), 0)
})

// 加载收藏 - 修复异步问题
const loadFavorites = async () => {
  try {
    console.log('[Profile View] 开始加载收藏数据');
    const favoriteList = await favoriteApi.getFavorites();
    favorites.value = Array.isArray(favoriteList) ? favoriteList : [];
    console.log('[Profile View] 收藏数据加载成功，共', favorites.value.length, '条');
  } catch (error) {
    console.error('[Profile View] 加载收藏数据失败:', error);
    favorites.value = [];
  }
};

// 添加收藏 - 修复异步问题
const addFavorite = async (item) => {
  try {
    await favoriteApi.addFavorite(item.id, item.type || 'forum');
    await loadFavorites(); // 重新加载收藏列表
    ElMessage.success('已添加到收藏');
  } catch (error) {
    console.error('[Profile View] 添加收藏失败:', error);
    ElMessage.error(error.message || '添加收藏失败');
  }
};

// 移除收藏 - 修复异步问题
const removeFavorite = async (id, postType = 'forum') => {
  try {
    await favoriteApi.removeFavorite(id, postType);
    await loadFavorites(); // 重新加载收藏列表
    ElMessage.success('已从收藏中移除');
  } catch (error) {
    console.error('[Profile View] 移除收藏失败:', error);
    ElMessage.error(error.message || '移除收藏失败');
  }
};

// 头像上传处理
const handleAvatarSuccess = (res, file) => {
  imageUrl.value = URL.createObjectURL(file.raw);
};

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJPG) {
    alert('上传头像图片只能是 JPG/PNG 格式!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    alert('上传头像图片大小不能超过 2MB!');
  }
  return isJPG && isLt2M;
};

// 保存用户信息
const saveUserInfo = () => {
  // 这里应该调用后端API保存用户信息
  alert('个人信息已保存！');
};

// 更新购物车商品数量 - 使用真实API
const handleQuantityChange = async (item) => {
  if (!item || !item.id || !item.quantity || item.quantity < 1) {
    ElMessage.error('数量必须大于0');
    return;
  }

  try {
    console.log('[Profile View] 更新购物车商品数量:', item.name, item.quantity);
    
    // 调用后端API更新数量
    await cartApi.updateCartItem(item.id, item.quantity);
    
    // 重新获取购物车数据以保持同步
    await loadCart();
    
    ElMessage.success('数量更新成功');
  } catch (error) {
    console.error('[Profile View] 更新购物车数量失败:', error);
    ElMessage.error(error.message || '更新数量失败');
    
    // 重新加载购物车以恢复原始数据
    await loadCart();
  }
}

// 从购物车移除商品 - 使用真实API
const removeFromCart = async (item) => {
  if (!item || !item.id) {
    ElMessage.error('商品信息无效');
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要从购物车中移除 ${item.name} 吗？`,
      '确认移除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    console.log('[Profile View] 从购物车移除商品:', item.name);
    
    // 调用后端API移除商品
    await cartApi.removeFromCart(item.id);
    
    // 重新获取购物车数据以保持同步
    await loadCart();
    
    ElMessage.success(`已从购物车中移除 ${item.name}`);
  } catch (error) {
    if (error === 'cancel') {
      console.log('[Profile View] 用户取消移除商品');
    } else {
      console.error('[Profile View] 移除商品失败:', error);
      ElMessage.error(error.message || '移除商品失败');
    }
  }
}

// 结算功能 - 使用真实的后端API
const checkout = async () => {
  if (cartItems.value.length === 0) {
    ElMessage.warning('购物车为空！');
    return;
  }

  try {
    // 显示结算确认对话框，包含余额信息
    const confirmMessage = `
      确定要结算购物车中的 ${cartItems.value.length} 件商品吗？
      订单金额：¥${totalPrice.value.toFixed(2)}
      当前余额：¥${(userInfo.value.balance || 0).toFixed(2)}
    `;

    await ElMessageBox.confirm(
      confirmMessage,
      '确认结算',
      {
        confirmButtonText: '确定结算',
        cancelButtonText: '取消',
        type: 'info',
        dangerouslyUseHTMLString: true
      }
    )

    console.log('[Profile View] 开始购物车结算');

    // 调用后端API进行结算
    const order = await orderApi.checkout({
      shippingAddress: '默认收货地址', // 可以后续添加地址选择功能
      remark: '购物车结算'
    });

    // 重新获取用户信息以更新余额
    await loadUserInfo();

    // 重新获取购物车数据（应该已被清空）
    await loadCart();

    // 重新获取订单列表
    await loadOrders();

    ElMessage.success(`订单创建成功！订单号：${order.orderNumber}`);
    activeTab.value = 'orders';
  } catch (error) {
    if (error === 'cancel') {
      console.log('[Profile View] 用户取消结算');
    } else {
      console.error('[Profile View] 结算失败:', error);
      ElMessage.error(error.message || '结算失败，请重试');
    }
  }
}

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const response = await getUserInfo();
    if (response.success && response.data) {
      userInfo.value = {
        ...userInfo.value,
        ...response.data,
        balance: response.data.balance || 0
      };
      console.log('[Profile View] 用户信息加载成功, 余额:', userInfo.value.balance);
    }
  } catch (error) {
    console.error('[Profile View] 加载用户信息失败:', error);
  }
}

// 加载订单列表
const loadOrders = async () => {
  try {
    console.log('[Profile View] 开始获取订单列表');
    const orderList = await orderApi.getUserOrders();
    
    // 转换订单数据格式以适配前端显示
    orders.value = orderList.map(order => ({
      id: order.id,
      orderId: order.orderNumber,
      orderNumber: order.orderNumber,
      createTime: order.createTime,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      remark: order.remark,
      items: [] // 订单项需要单独加载，这里先设为空数组
    }));
    
    console.log('[Profile View] 订单列表加载成功，共', orders.value.length, '个订单');
  } catch (error) {
    console.error('[Profile View] 获取订单列表失败:', error);
    orders.value = [];
    ElMessage.error('获取订单列表失败');
  }
}

// 加载用户文章 - 调用真实API
const loadArticles = async () => {
  try {
    console.log('[Profile View] 开始获取用户文章列表');
    const response = await api.get('/profile/posts');
    
    if (response.success && response.data) {
      articles.value = Array.isArray(response.data) ? response.data : [];
      console.log('[Profile View] 文章列表加载成功，共', articles.value.length, '篇');
    } else {
      console.error('[Profile View] 获取文章列表失败:', response.message);
      articles.value = [];
    }
  } catch (error) {
    console.error('[Profile View] 获取文章列表失败:', error);
    articles.value = [];
  }
}

// 加载用户预约 - 调用真实API
const loadUserReservations = async () => {
  try {
    console.log('[Profile View] 开始获取用户预约列表');
    const response = await api.get('/profile/reservations');
    
    if (response.success && response.data) {
      userReservations.value = Array.isArray(response.data) ? response.data : [];
      console.log('[Profile View] 预约列表加载成功，共', userReservations.value.length, '个');
    } else {
      console.error('[Profile View] 获取预约列表失败:', response.message);
      userReservations.value = [];
    }
  } catch (error) {
    console.error('[Profile View] 获取预约列表失败:', error);
    userReservations.value = [];
  }
}

// 取消订单
const cancelOrder = async (order) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消订单 ${order.orderNumber} 吗？如果已支付将退还到余额中。`,
      '确认取消订单',
      {
        confirmButtonText: '确定取消',
        cancelButtonText: '取消操作',
        type: 'warning',
      }
    )

    console.log('[Profile View] 取消订单:', order.orderNumber);
    
    // 调用后端API取消订单
    await orderApi.cancelOrder(order.id);
    
    // 重新加载订单列表和用户信息
    await loadOrders();
    await loadUserInfo();
    
    ElMessage.success('订单取消成功！');
  } catch (error) {
    if (error === 'cancel') {
      console.log('[Profile View] 用户取消操作');
    } else {
      console.error('[Profile View] 取消订单失败:', error);
      ElMessage.error(error.message || '取消订单失败');
    }
  }
}

// 确认收货
const confirmReceipt = async (order) => {
  try {
    await ElMessageBox.confirm(
      `确认收到订单 ${order.orderNumber} 的商品了吗？`,
      '确认收货',
      {
        confirmButtonText: '确认收货',
        cancelButtonText: '取消',
        type: 'info',
      }
    )

    // 这里可以调用后端API确认收货
    // await orderApi.confirmReceipt(order.id);
    
    // 暂时直接更新状态
    order.status = 'completed';
    ElMessage.success('确认收货成功！');
  } catch (error) {
    if (error === 'cancel') {
      console.log('[Profile View] 用户取消确认收货');
    } else {
      console.error('[Profile View] 确认收货失败:', error);
      ElMessage.error('确认收货失败');
    }
  }
}

// 订单状态相关
const getStatusText = (status) => {
  const statusMap = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status] || status;
};

const getStatusType = (status) => {
  const typeMap = {
    pending: 'info',
    paid: 'primary',
    shipped: 'warning',
    completed: 'success',
    cancelled: 'danger'
  };
  return typeMap[status] || 'info';
};

// 获取支付方式文本
const getPaymentMethodText = (method) => {
  const methodMap = {
    alipay: '支付宝',
    wechat: '微信支付',
    bank_card: '银行卡'
  };
  return methodMap[method] || method;
};

// 处理充值
const handleRecharge = async () => {
  if (rechargeForm.value.amount <= 0) {
    ElMessage.warning('请输入有效的充值金额');
    return;
  }

  try {
    rechargeLoading.value = true;

    // 调用后端API进行充值
    await rechargeApi.recharge(rechargeForm.value.amount, rechargeForm.value.paymentMethod);

    rechargeLoading.value = false;
    ElMessage.success('充值成功！');
    showRechargeDialog.value = false;

    // 重新加载用户信息
    await loadUserInfo();

    // 重置充值表单
    rechargeForm.value = {
      amount: 0,
      paymentMethod: 'alipay'
    };
  } catch (error) {
    rechargeLoading.value = false;
    console.error('[Profile View] 充值失败:', error);
    ElMessage.error(error.message || '充值失败，请稍后重试');
  }
}

// 设置快捷充值金额
const setQuickAmount = (amount) => {
  rechargeForm.value.amount = amount;
};

// 加载充值记录
const loadRechargeHistory = async () => {
  try {
    console.log('[Profile View] 开始获取充值记录');
    const history = await rechargeApi.getRechargeHistory();
    rechargeHistory.value = Array.isArray(history) ? history : [];
    console.log('[Profile View] 充值记录加载成功，共', rechargeHistory.value.length, '条');
  } catch (error) {
    console.error('[Profile View] 获取充值记录失败:', error);
    rechargeHistory.value = [];
  }
};

// 组件挂载时执行
onMounted(async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      // 加载用户信息（包含余额）
      await loadUserInfo();
    } catch (error) {
      ElMessage.error('获取用户信息请求出错');
      console.error('获取用户信息错误:', error);
      logout();
    }
  } else {
    logout();
  }

  // 加载收藏数据
  loadFavorites();
  
  // 加载购物车数据
  loadCart();
  
  // 加载订单数据
  loadOrders();

  // 加载用户文章
  loadArticles();

  // 加载用户预约
  loadUserReservations();

  // 加载充值记录
  loadRechargeHistory();
});
</script>

<style scoped>
.profile-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.avatar-uploader {
  display: inline-block;
  width: 100px;
  height: 100px;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #c0c4cc;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.order-product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 8px;
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
  border-top: 1px solid #e4e7ed;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #e4e7ed;
}
</style>

