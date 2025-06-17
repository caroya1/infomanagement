<!-- 商城商品管理表格组件，增删改查操作入口，未实现的接口有醒目标注 -->
<template>
  <div>
    <el-select v-model="sortField" placeholder="排序方式" @change="getMallList" style="margin-bottom:10px;">
      <el-option label="默认排序" value="create_time" />
      <el-option label="价格高到低" value="price_desc" />
      <el-option label="价格低到高" value="price_asc" />
      <el-option label="销量高到低" value="sales_desc" />
      <el-option label="销量低到高" value="sales_asc" />
    </el-select>
    <el-button type="primary" @click="showAddDialog = true" style="margin-bottom: 10px; margin-left: 10px;">新增商品</el-button>
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
    <el-pagination
      v-model:current-page="mallPage"
      v-model:page-size="mallPageSize"
      :total="mallTotal"
      :page-sizes="[10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleMallSizeChange"
      @current-change="handleMallPageChange"
      style="margin-top: 16px;"
    />
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
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { mallApi } from '../../api/mall'
import { ElMessage } from 'element-plus'
const mallList = ref([])
const mallPage = ref(1)
const mallPageSize = ref(10)
const mallTotal = ref(0)
const sortField = ref('create_time')
const showAddDialog = ref(false)
const editMallData = reactive({ id: null, name: '', price: 0, sales: 0, imageUrl: '' })
const getMallList = async () => {
  let sort = sortField.value
  let order = 'desc'
  if (sort.endsWith('_desc')) {
    sort = sort.replace('_desc', '')
    order = 'desc'
  } else if (sort.endsWith('_asc')) {
    sort = sort.replace('_asc', '')
    order = 'asc'
  }
  const res = await mallApi.getProducts({
    page: mallPage.value,
    size: mallPageSize.value,
    sort,
    order
  })
  mallList.value = res.records || []
  mallTotal.value = res.total || 0
}
const handleMallSizeChange = (size) => { mallPageSize.value = size; mallPage.value = 1; getMallList() }
const handleMallPageChange = (page) => { mallPage.value = page; getMallList() }
const editMall = (row) => { Object.assign(editMallData, row); showAddDialog.value = true }
const saveMall = async () => {
  try {
    if (editMallData.id) {
      // ⚠️ 后端未实现 updateProduct
      await mallApi.updateProduct(editMallData.id, editMallData)
      ElMessage.success('修改成功')
    } else {
      // ⚠️ 后端未实现 addProduct
      await mallApi.addProduct(editMallData)
      ElMessage.success('新增成功')
    }
    showAddDialog.value = false
    getMallList()
    Object.assign(editMallData, { id: null, name: '', price: 0, sales: 0, imageUrl: '' })
  } catch (e) {
    ElMessage.error(e.message)
  }
}
const deleteMall = async (id) => {
  try {
    // ⚠️ 后端未实现 deleteProduct
    await mallApi.deleteProduct(id)
    ElMessage.success('删除成功')
    getMallList()
  } catch (e) {
    ElMessage.error(e.message)
  }
}
onMounted(getMallList)
</script>
