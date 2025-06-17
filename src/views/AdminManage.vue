<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="帖子管理" name="forum">
        <el-table :data="forumList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="60"/>
          <el-table-column prop="title" label="标题"/>
          <el-table-column prop="author" label="作者"/>
          <el-table-column prop="views" label="浏览量"/>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="danger" size="small" @click="deleteForum(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="学习活动管理" name="learning">
        <el-table :data="learningList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="60"/>
          <el-table-column prop="title" label="标题"/>
          <el-table-column prop="author" label="发布者"/>
          <el-table-column prop="views" label="浏览量"/>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="danger" size="small" @click="deleteLearning(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="商城商品管理" name="mall">
        <el-button type="primary" @click="showAddDialog = true" style="margin-bottom: 10px;">新增商品</el-button>
        <el-table :data="mallList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="60"/>
          <el-table-column prop="name" label="商品名"/>
          <el-table-column prop="price" label="价格"/>
          <el-table-column prop="sales" label="销量"/>
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button size="small" @click="editMall(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteMall(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增/编辑商品对话框 -->
        <el-dialog v-model="showAddDialog" :title="editMallData.id ? '编辑商品' : '新增商品'">
          <el-form :model="editMallData" label-width="80px">
            <el-form-item label="商品名">
              <el-input v-model="editMallData.name"/>
            </el-form-item>
            <el-form-item label="价格">
              <el-input v-model.number="editMallData.price" type="number"/>
            </el-form-item>
            <el-form-item label="销量">
              <el-input v-model.number="editMallData.sales" type="number"/>
            </el-form-item>
            <el-form-item label="图片">
              <el-input v-model="editMallData.imageUrl"/>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="showAddDialog = false">取消</el-button>
            <el-button type="primary" @click="saveMall">保存</el-button>
          </template>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { forumApi } from '../api/forum'
import { learningApi } from '../api/learning'
import { mallApi } from '../api/common'
import { ElMessage } from 'element-plus'

const activeTab = ref('forum')

// 帖子管理
const forumList = ref([])
const getForumList = async () => {
  forumList.value = await forumApi.getPosts()
}
const deleteForum = async (id) => {
  await forumApi.deletePost(id)
  ElMessage.success('删除成功')
  getForumList()
}

// 学习活动管理
const learningList = ref([])
const getLearningList = async () => {
  learningList.value = await learningApi.getActivities()
}
const deleteLearning = async (id) => {
  // 假设有 deleteActivity 方法
  if (learningApi.deleteActivity) {
    await learningApi.deleteActivity(id)
    ElMessage.success('删除成功')
    getLearningList()
  } else {
    ElMessage.warning('未实现删除接口')
  }
}

// 商城商品管理
const mallList = ref([])
const getMallList = async () => {
  mallList.value = await mallApi.getProducts()
}
const deleteMall = async (id) => {
  if (mallApi.deleteProduct) {
    await mallApi.deleteProduct(id)
    ElMessage.success('删除成功')
    getMallList()
  } else {
    ElMessage.warning('未实现删除接口')
  }
}
const showAddDialog = ref(false)
const editMallData = reactive({
  id: null,
  name: '',
  price: 0,
  sales: 0,
  imageUrl: ''
})
const editMall = (row) => {
  Object.assign(editMallData, row)
  showAddDialog.value = true
}
const saveMall = async () => {
  if (editMallData.id && mallApi.updateProduct) {
    await mallApi.updateProduct(editMallData.id, editMallData)
    ElMessage.success('修改成功')
  } else if (mallApi.addProduct) {
    await mallApi.addProduct(editMallData)
    ElMessage.success('新增成功')
  } else {
    ElMessage.warning('未实现商品增改接口')
  }
  showAddDialog.value = false
  getMallList()
  Object.assign(editMallData, { id: null, name: '', price: 0, sales: 0, imageUrl: '' })
}

onMounted(() => {
  getForumList()
  getLearningList()
  getMallList()
})
</script>