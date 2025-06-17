<!-- 后台管理-管理页面，聚合帖子、学习活动、商城商品管理 -->
<template>
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
      <el-pagination
        v-model:current-page="forumPage"
        v-model:page-size="forumPageSize"
        :total="forumTotal"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleForumSizeChange"
        @current-change="handleForumPageChange"
        style="margin-top: 16px;"
      />
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
      <el-pagination
        v-model:current-page="learningPage"
        v-model:page-size="learningPageSize"
        :total="learningTotal"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleLearningSizeChange"
        @current-change="handleLearningPageChange"
        style="margin-top: 16px;"
      />
    </el-tab-pane>
    <el-tab-pane label="商城商品管理" name="mall">
      <AdminMallTable />
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { forumApi } from '../../api/forum'
import { learningApi } from '../../api/learning'
import AdminMallTable from '../../components/admin/AdminMallTable.vue'
import { ElMessage } from 'element-plus'
const activeTab = ref('forum')
// 帖子管理分页
const forumList = ref([])
const forumPage = ref(1)
const forumPageSize = ref(10)
const forumTotal = ref(0)
const getForumList = async () => {
  const res = await forumApi.getPosts({ page: forumPage.value, size: forumPageSize.value })
  if (Array.isArray(res)) {
    forumList.value = res
    forumTotal.value = res.length // 若后端返回分页对象需改为 res.total
  } else if (res && Array.isArray(res.records)) {
    forumList.value = res.records
    forumTotal.value = res.total || 0
  } else {
    forumList.value = []
    forumTotal.value = 0
  }
}
const handleForumSizeChange = (size) => { forumPageSize.value = size; forumPage.value = 1; getForumList() }
const handleForumPageChange = (page) => { forumPage.value = page; getForumList() }
const deleteForum = async (id) => { await forumApi.deletePost(id); ElMessage.success('删除成功'); getForumList() }
// 学习活动管理分页
const learningList = ref([])
const learningPage = ref(1)
const learningPageSize = ref(10)
const learningTotal = ref(0)
const getLearningList = async () => {
  const res = await learningApi.getActivities({ page: learningPage.value, size: learningPageSize.value })
  if (Array.isArray(res)) {
    learningList.value = res
    learningTotal.value = res.length // 若后端返回分页对象需改为 res.total
  } else if (res && Array.isArray(res.records)) {
    learningList.value = res.records
    learningTotal.value = res.total || 0
  } else {
    learningList.value = []
    learningTotal.value = 0
  }
}
const handleLearningSizeChange = (size) => { learningPageSize.value = size; learningPage.value = 1; getLearningList() }
const handleLearningPageChange = (page) => { learningPage.value = page; getLearningList() }
const deleteLearning = async (id) => {
  // ⚠️ 后端未实现 deleteActivity
  ElMessage.warning('deleteActivity 接口后端未实现')
}
onMounted(() => { getForumList(); getLearningList() })
</script>
