<!-- src/views/plinspection/inspStandard/List.vue -->
<template>
  <div class="insp-std-management">
    <div class="action-bar">
      <el-input
        v-model="query.standardNo"
        placeholder="标准编号"
        style="width: 180px; margin-right: 10px;"
        clearable
        @clear="getList"
        @keyup.enter="getList"
      />
      <el-input
        v-model="query.materials"
        placeholder="适用材料"
        style="width: 180px; margin-right: 10px;"
        clearable
        @clear="getList"
        @keyup.enter="getList"
      />
      <el-button type="primary" @click="getList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="showAdd = true">
        新增标准
      </el-button>
    </div>

    <el-table :data="list" border v-loading="loading">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="standardNo" label="标准编号" width="160" />
      <el-table-column prop="materials" label="适用材料" width="180" />
      <el-table-column prop="matNo" label="材料牌号" width="140" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" show-overflow-tooltip />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="query.pageNumber"
        v-model:page-size="query.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="getList"
        @current-change="getList"
      />
    </div>

    <!-- 新增弹窗 -->
    <AddDialog v-model="showAdd" @success="getList" />

    <!-- 编辑弹窗 -->
    <EditDialog
      v-if="editRow"
      v-model="showEdit"
      :row="editRow"
      @success="getList"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getInspStandardPage, deleteInspStandard } from '@/api/plinspection/inspStd'
import AddDialog from './add.vue'
import EditDialog from './edit.vue'
import { Refresh } from '@element-plus/icons-vue'

const query = reactive({
  standardNo: '',
  materials: '',
  pageNumber: 1,
  pageSize: 10
})
const list = ref([])
const total = ref(0)
const loading = ref(false)

const showAdd = ref(false)
const showEdit = ref(false)
const editRow = ref(null)

const getList = async () => {
  loading.value = true
  try {
    const res = await getInspStandardPage(query)
    list.value = res.data.page?.list || []
    total.value = res.data.page?.totalRow || 0
  } catch (err) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => {
  query.standardNo = ''
  query.materials = ''
  query.pageNumber = 1
  getList()
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除标准 "${row.standardNo}" 吗？`, '提示', { type: 'warning' })
    .then(async () => {
      await deleteInspStandard({ id: row.id })
      ElMessage.success('删除成功')
      getList()
    })
    .catch(() => {})
}

const openEdit = (row) => {
  editRow.value = { ...row }
  showEdit.value = true
}

watch(showEdit, (val) => {
  if (!val) editRow.value = null
})

onMounted(getList)
</script>

<style scoped>
.insp-std-management { padding: 20px; }
.action-bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 20px; }
.pagination { margin-top: 20px; text-align: right; }
</style>