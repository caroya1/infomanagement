<template>
  <div>
    <el-card>
      <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 16px;">
        <el-input v-model="searchText" placeholder="搜索用户名/昵称/邮箱" style="width: 220px;" @keyup.enter="getUserList" />
        <el-select v-model="sortField" placeholder="排序方式" style="width: 160px;" @change="getUserList">
          <el-option label="ID升序" value="id_asc" />
          <el-option label="ID降序" value="id_desc" />
          <el-option label="余额升序" value="balance_asc" />
          <el-option label="余额降序" value="balance_desc" />
          <el-option label="账号升序" value="username_asc" />
          <el-option label="账号降序" value="username_desc" />
        </el-select>
        <el-button type="primary" @click="getUserList">查询</el-button>
      </div>
      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="60"/>
        <el-table-column prop="username" label="账号"/>
        <el-table-column prop="nickname" label="昵称"/>
        <el-table-column prop="email" label="邮箱"/>
        <el-table-column prop="userType" label="类型"/>
        <el-table-column prop="balance" label="余额"/>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-popconfirm title="确定删除该用户吗？" @confirm="deleteUser(scope.row.id)">
              <el-button type="danger" size="small">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        style="margin-top: 16px;"
      />
      <div style="margin-top: 24px;">
        <el-descriptions title="用户统计" :column="3" border>
          <el-descriptions-item label="用户总数">{{ stats.totalUsers }}</el-descriptions-item>
          <el-descriptions-item label="总余额">{{ stats.totalBalance }}</el-descriptions-item>
          <el-descriptions-item label="平均余额">{{ stats.avgBalance }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div v-if="apiNotImplemented" style="margin-top: 16px; color: red;">
        <el-alert title="部分功能未实现" type="warning" description="当前用户相关的某些API未实现，部分功能可能无法使用。" />
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { userApi } from '../../api/user'
import { ElMessage } from 'element-plus'
const userList = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchText = ref('')
const sortField = ref('id_desc')
const stats = ref({ totalUsers: 0, totalBalance: 0, avgBalance: 0 })
const apiNotImplemented = ref(false)
const getUserList = async () => {
  let sort = sortField.value.split('_')[0]
  let order = sortField.value.endsWith('desc') ? 'desc' : 'asc'
  const res = await userApi.getUsers({
    page: page.value,
    size: pageSize.value,
    search: searchText.value,
    sort,
    order
  })
  if (res.notImplemented) {
    apiNotImplemented.value = true
    userList.value = []
    total.value = 0
    return
  } else {
    apiNotImplemented.value = false
  }
  userList.value = res.records || []
  total.value = res.total || 0
}
const handleSizeChange = (size) => { pageSize.value = size; page.value = 1; getUserList() }
const handlePageChange = (p) => { page.value = p; getUserList() }
const deleteUser = async (id) => {
  try {
    await userApi.deleteUser(id)
    ElMessage.success('删除成功')
    getUserList()
    getStats()
  } catch (e) {
    if (e.message && e.message.includes('未实现')) {
      ElMessage.error('删除用户接口后端未实现')
    } else {
      ElMessage.error('删除失败')
    }
  }
}
const getStats = async () => {
  const s = await userApi.getUserStats()
  if (s.notImplemented) {
    stats.value = { totalUsers: '接口未实现', totalBalance: '接口未实现', avgBalance: '接口未实现' }
  } else {
    stats.value = s
  }
}
onMounted(() => { getUserList(); getStats() })
</script>
