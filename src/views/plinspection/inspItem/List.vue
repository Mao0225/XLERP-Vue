<!-- src/views/plinspection/inspItem/List.vue -->
<template>
  <div class="inspitem-management">
    <div class="action-bar">
      <el-input v-model="queryParams.inspItemCode" placeholder="项目编码" style="width: 180px; margin-right: 10px;"
        clearable @clear="getList" @keyup.enter="getList" />
      <el-input v-model="queryParams.inspItemName" placeholder="项目名称" style="width: 180px; margin-right: 10px;"
        clearable @clear="getList" @keyup.enter="getList" />
      <el-select v-model="queryParams.category" placeholder="检验类别" clearable filterable style="width: 180px; margin-right: 10px;"
        @change="getList">
        <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="showAddDialog = true">
        新增检验项目
      </el-button>
    </div>

    <el-table :data="list" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="inspItemCode" label="项目编码" width="140" />
      <el-table-column prop="inspItemName" label="项目名称" width="180" />
      <el-table-column prop="dataType" label="输入类型" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.dataType === 'number'" type="success">数字</el-tag>
          <el-tag v-else-if="row.dataType === 'text'" type="info">文本</el-tag>
          <el-tag v-else-if="row.dataType === 'bool'" type="warning">布尔</el-tag>
          <el-tag v-else-if="row.dataType === 'select'" type="primary">下拉</el-tag>
          <el-tag v-else-if="row.dataType === 'date'" type="danger">日期</el-tag>
          <span v-else>{{ row.dataType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="100" />
      <el-table-column prop="category" label="检验类别" width="160" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" width="300" show-overflow-tooltip />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增弹窗 -->
    <AddDialog v-model="showAddDialog" @success="getList" />

    <!-- 编辑弹窗 -->
    <EditDialog
      v-if="editRow"
      v-model="showEditDialog"
      :row="editRow"
      @success="getList"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getInspItemPage, deleteInspItem } from '@/api/plinspection/inspItem'
import AddDialog from './add.vue'
import EditDialog from './edit.vue'
import { Refresh } from '@element-plus/icons-vue'

// 查询参数
const queryParams = reactive({
  inspItemCode: '',
  inspItemName: '',
  category: '',
  pageNumber: 1,
  pageSize: 10
})

const list = ref([])
const total = ref(0)
const loading = ref(false)
const categoryOptions = ref([])

// 弹窗控制
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const editRow = ref(null)

// 获取列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getInspItemPage(queryParams)
    const data = res.data.page || {}
    list.value = data.list || []
    total.value = data.totalRow || 0

    // 动态提取 category 选项
    const cats = [...new Set(list.value.map(i => i.category).filter(Boolean))]
    categoryOptions.value = cats.sort()
  } catch (err) {
    console.error(err)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 分页
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getList()
}
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getList()
}

// 刷新
const handleRefresh = () => {
  Object.assign(queryParams, {
    inspItemCode: '',
    inspItemName: '',
    category: '',
    pageNumber: 1
  })
  getList()
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除 "${row.inspItemName}" 吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteInspItem({ id: row.id })
    ElMessage.success('删除成功')
    getList()
  }).catch(() => {})
}

// 打开编辑
const openEdit = (row) => {
  editRow.value = { ...row }
  showEditDialog.value = true
}

// 监听弹窗关闭时清理
watch(showEditDialog, (val) => {
  if (!val) editRow.value = null
})

onMounted(() => {
  getList()
})
</script>

<style scoped>
.inspitem-management { padding: 20px; }
.action-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>