<template>
  <div class="forum-container">
    <Navbar />

    <el-row class="forum-header">
      <el-col :span="24">
        <el-input v-model="searchText" placeholder="搜索帖子" prefix-icon="el-icon-search" @keyup.enter="searchPost">
          <template #append>
            <el-button @click="searchPost">搜索</el-button>
          </template>
        </el-input>

        <el-button type="primary" @click="openCreatePostDialog">
          发布新帖
        </el-button>
      </el-col>
    </el-row>

    <el-row class="forum-content">
      <el-col :span="24">
        <el-table :data="posts" stripe style="width: 100%">
          <el-table-column label="收藏" width="80">
            <template #default="scope">
              <el-icon :class="{ 'scale-animation': scope.row.isAnimating }"
                :color="isFavorite(scope.row.id) ? 'green' : 'gray'" @click="toggleFavorite(scope.row)">
                <StarFilled v-if="isFavorite(scope.row.id)" />
                <Star v-else />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="帖子标题" min-width="300">
            <template #default="scope">
              <span @click="goToPostDetail(scope.row)">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="author" label="作者" width="120"></el-table-column>
          <el-table-column prop="createTime" label="发布时间" width="160"></el-table-column>
          <el-table-column prop="views" label="浏览量" width="80"></el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="totalPosts">
        </el-pagination>
      </el-col>
    </el-row>

    <!-- 发布帖子对话框 -->
    <el-dialog v-model="showCreateDialog" title="发布新帖" :before-close="handleClose">
      <el-form :model="newPost" :rules="postRules" ref="postFormRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="newPost.title" placeholder="请输入帖子标题" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="newPost.content" rows="8" placeholder="请输入帖子内容" maxlength="5000"
            show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitPost">发布</el-button>
          <el-button @click="handleCloseDialog">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Navbar from '../../components/common/Navbar.vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { forumApi } from '../../api/forum.js'
import { favoriteApi } from '../../api/common.js'
import { Star, StarFilled } from '@element-plus/icons-vue'

const router = useRouter()
// 修复数据初始化，确保数组数据的正确处理
const searchText = ref('')
const currentUser = 'test_user'

const originalPosts = ref([])
const posts = ref([])
// 添加收藏状态管理
const favoriteStatus = ref(new Map())

const currentPage = ref(1)
const pageSize = ref(10)
const totalPosts = ref(0)

const showCreateDialog = ref(false)
const postFormRef = ref(null)
const isSubmitting = ref(false)

// 表单数据
const newPost = reactive({
  title: '',
  content: ''
})

// 表单验证规则
const postRules = reactive({
  title: [
    { required: true, message: '请输入帖子标题', trigger: 'blur' },
    { min: 3, max: 100, message: '标题长度在3 - 100个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入帖子内容', trigger: 'blur' },
    { min: 10, message: '内容至少10个字符', trigger: 'blur' }
  ]
})

// 初始化加载帖子数据
const fetchPosts = async () => {
  try {
    console.log('[Forum View] 开始获取帖子数据');
    const data = await forumApi.getPosts()

    console.log('[Forum View] 获取到的数据:', {
      isArray: Array.isArray(data),
      length: data ? data.length : 0,
      type: typeof data
    });

    // 确保数据是数组
    if (Array.isArray(data)) {
      originalPosts.value = data
      posts.value = data
      totalPosts.value = data.length
      console.log('[Forum View] 帖子数据设置成功，共', data.length, '条');

      // 批量加载收藏状态
      await loadFavoriteStatus(data)
    } else {
      console.error('[Forum View] 获取的数据不是数组:', data);
      // 设置为空数组以防止错误
      originalPosts.value = []
      posts.value = []
      totalPosts.value = 0

      ElMessage({
        message: '帖子数据格式异常，请联系管理员',
        type: 'error',
        duration: 3000
      })
    }
  } catch (error) {
    console.error('[Forum View] 获取帖子列表异常:', error)

    // 出错时设置为空数组
    originalPosts.value = []
    posts.value = []
    totalPosts.value = 0

    ElMessage({
      message: '加载帖子列表失败，请重试',
      type: 'error',
      duration: 3000
    })
  }
}

// 修复批量加载收藏状态，添加防护措施
const loadFavoriteStatus = async (posts) => {
  try {
    // 确保posts是数组
    if (!Array.isArray(posts)) {
      console.warn('[Forum View] loadFavoriteStatus: posts不是数组');
      return;
    }

    console.log('[Forum View] 开始加载收藏状态，帖子数:', posts.length);
    const statusPromises = posts.map(async (post) => {
      if (post && post.id) {
        try {
          const status = await favoriteApi.isFavorite(post.id)
          favoriteStatus.value.set(post.id, status)
        } catch (error) {
          console.warn('[Forum View] 加载帖子收藏状态失败:', post.id, error);
          favoriteStatus.value.set(post.id, false)
        }
      }
    })
    await Promise.all(statusPromises)
    console.log('[Forum View] 收藏状态加载完成');
  } catch (error) {
    console.error('[Forum View] 加载收藏状态异常:', error)
  }
}

// 打开创建帖子对话框
const openCreatePostDialog = () => {
  showCreateDialog.value = true
}

// 提交表单 - 修复API调用和错误处理
const submitPost = async () => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true

    // 验证表单
    const valid = await new Promise((resolve) => {
      postFormRef.value.validate((valid) => {
        resolve(valid)
      })
    })

    if (!valid) {
      ElMessage.error('请检查表单输入')
      return
    }

    // 准备提交数据 - 移除author字段，让后端从token获取用户信息
    const postData = {
      title: newPost.title.trim(),
      content: newPost.content.trim()
    }

    console.log('[Forum View] 开始发布帖子:', postData)

    // 提交到API
    const response = await forumApi.createPost(postData)
    
    console.log('[Forum View] 帖子发布响应:', response)

    // 检查响应是否成功
    if (!response) {
      throw new Error('发布失败，请重试')
    }

    // 重新加载帖子列表以获取最新数据
    await fetchPosts()

    // 关闭对话框
    showCreateDialog.value = false

    // 显示成功提示
    ElMessage.success('帖子发布成功！')

    // 重置表单
    resetForm()

    // 如果有返回的帖子ID，跳转到详情页
    if (response.id) {
      setTimeout(() => {
        router.push(`/forum/detail/${response.id}`)
      }, 1000)
    }

  } catch (error) {
    console.error('[Forum View] 发布帖子失败:', error)
    ElMessage.error(error.message || '发布失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  newPost.title = ''
  newPost.content = ''
  postFormRef.value?.resetFields()
}

// 关闭对话框 - 修复取消按钮功能
const handleClose = (done) => {
  // 如果正在提交，询问用户是否确认关闭
  if (isSubmitting.value) {
    ElMessageBox.confirm('正在发布中，确定要取消吗？', '确认关闭', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      resetForm()
      done()
    }).catch(() => {
      // 用户取消关闭操作
    })
  } else {
    resetForm()
    done()
  }
}

const handleCloseDialog = () => {
  // 如果正在提交，询问用户是否确认关闭
  if (isSubmitting.value) {
    ElMessageBox.confirm('正在发布中，确定要取消吗？', '确认关闭', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      showCreateDialog.value = false
      resetForm()
    }).catch(() => {
      // 用户取消关闭操作
    })
  } else {
    showCreateDialog.value = false
    resetForm()
  }
}

const goToPostDetail = async (post) => {
  try {
    await forumApi.updateViews(post.id, post.views)
    router.push(`/forum/detail/${post.id}`)
  } catch (error) {
    console.error('更新浏览量失败', error)
    router.push(`/forum/detail/${post.id}`)
  }
}

// 修复搜索功能，添加防护措施
const searchPost = () => {
  // 确保originalPosts.value是数组
  if (!Array.isArray(originalPosts.value)) {
    console.warn('[Forum View] searchPost: originalPosts不是数组');
    posts.value = []
    totalPosts.value = 0
    return;
  }

  if (!searchText.value) {
    posts.value = [...originalPosts.value]
  } else {
    const filteredPosts = originalPosts.value.filter(post => {
      // 添加属性存在检查
      if (!post) return false;

      const title = post.title || '';
      const content = post.content || '';
      const author = post.author || '';

      return title.includes(searchText.value) ||
        content.includes(searchText.value) ||
        author.includes(searchText.value);
    })
    posts.value = filteredPosts
  }
  totalPosts.value = posts.value.length
  currentPage.value = 1
}

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 切换收藏状态
const toggleFavorite = async (post) => {
  // 检查参数有效性
  if (!post || !post.id) {
    ElMessage.error('无效的帖子信息')
    return
  }

  // 立即更新UI状态
  const isCurrentlyFavorite = favoriteStatus.value.get(post.id) || false

  // 添加动画状态
  post.isAnimating = true

  try {
    if (isCurrentlyFavorite) {
      // 取消收藏
      await favoriteApi.removeFavorite(post.id)
      favoriteStatus.value.set(post.id, false)
      ElMessage.success('已取消收藏')
    } else {
      // 添加收藏
      await favoriteApi.addFavorite(post.id, 'forum')
      favoriteStatus.value.set(post.id, true)
      ElMessage.success('已添加到收藏')
    }

    // 等待动画完成后重置状态
    await new Promise(resolve => setTimeout(resolve, 300))
    post.isAnimating = false
  } catch (error) {
    console.error('收藏操作失败:', error)
    ElMessage.error('操作失败，请重试')
    post.isAnimating = false
  }
}

// 检查帖子是否已收藏 - 修改为同步函数
const isFavorite = (postId) => {
  if (!postId) return false
  return favoriteStatus.value.get(postId) || false
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.forum-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.forum-header {
  margin-bottom: 20px;
}

.forum-content {
  min-height: 500px;
}
</style>