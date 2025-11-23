<!-- src/components/TuzhiSelectDialog.vue -->
<template>
  <el-dialog
    title="选择图纸"
    v-model="dialogVisible"
    width="90%"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div class="tuzhi-management">
      <!-- 搜索栏 -->
      <div class="action-bar">
        <el-input
          v-model="queryParams.tuzhimingcheng"
          placeholder="请输入图纸名称搜索"
          style="width: 240px; margin-right: 12px;"
          clearable
          @clear="getTuzhiList"
          @keyup.enter="getTuzhiList"
        />
        <el-button type="primary" @click="getTuzhiList">
          <el-icon><Search /></el-icon> 搜索
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon> 刷新
        </el-button>
      </div>

      <!-- 表格 -->
      <el-table
        :data="tuzhiList"
        border
        v-loading="loading"
        height="55vh"
        style="width: 100%"
        @row-dblclick="handleRowDblClick"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="tuzhibianhao" label="图纸编号" width="140" show-overflow-tooltip />
        <el-table-column prop="tuzhimingcheng" label="图纸名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="zicailiaoshuliang" label="子材料数" width="100" align="center" />
        <el-table-column prop="tuzhizuozhe" label="作者" width="100" />
        <el-table-column prop="chuangzuoriqi" label="创作日期" width="120" />
        <el-table-column prop="tuzhimiaoshu" label="描述" min-width="160" show-overflow-tooltip />
        <el-table-column label="文件" width="180">
          <template #default="{ row }">
            <div v-for="(file, i) in parseFiles(row.tuzhiurl)" :key="i" style="margin: 4px 0;">
              <span class="file-link" @click.stop="downloadFile(file.url, file.name)">
                {{ file.name }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleSelect(row)"
            >
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, watch,computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getTuzhis } from '@/api/tuzhi/tuzhi'
import { baseURL } from '@/utils/request'

// ---------- Props ----------
const props = defineProps({
  modelValue: { type: Boolean, default: false } // v-model 支持
})

const emit = defineEmits(['update:modelValue', 'select'])

// 控制弹窗显示（支持 v-model）
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// ---------- 数据 ----------
const loading = ref(false)
const tuzhiList = ref([])
const total = ref(0)

const queryParams = reactive({
  pageNumber: 1,
  pageSize: 20,
  tuzhimingcheng: ''
})

// ---------- 方法 ----------
const getTuzhiList = async () => {
  loading.value = true
  try {
    const res = await getTuzhis(queryParams)
    tuzhiList.value = res.data.page.list || []
    total.value = res.data.page.totalRow || 0
  } catch (err) {
    ElMessage.error('加载图纸列表失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNumber = 1
  getTuzhiList()
}

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getTuzhiList()
}

const handleRefresh = () => {
  queryParams.tuzhimingcheng = ''
  queryParams.pageNumber = 1
  getTuzhiList()
}

// 双击行也直接选择
const handleRowDblClick = (row) => {
  if (row.zicailiaoshuliang && row.zicailiaoshuliang > 0) {
    handleSelect(row)
  }
}

// 选择图纸（核心）
const handleSelect = (row) => {
  ElMessage.success(`已选择：${row.tuzhimingcheng}`)
  emit('select', row)           // 把整行数据传给父组件
  dialogVisible.value = false   // 选择后自动关闭弹窗
}

// 文件下载/预览
const parseFiles = (jsonStr) => {
  try {
    return JSON.parse(jsonStr || '[]')
  } catch {
    return []
  }
}

const downloadFile = (url, filename) => {
  const fullUrl = url.startsWith('http') ? url : baseURL + url
  const ext = filename.split('.').pop().toLowerCase()
  const viewable = ['jpg', 'jpeg', 'png', 'gif', 'pdf']
  if (viewable.includes(ext)) {
    window.open(fullUrl, '_blank')
  } else {
    const a = document.createElement('a')
    a.href = fullUrl
    a.download = filename
    a.click()
  }
}

// 每次打开弹窗都刷新列表（可选）
watch(dialogVisible, (val) => {
  if (val) {
    queryParams.pageNumber = 1
    getTuzhiList()
  }
})

onMounted(() => {
  // 组件首次加载不自动请求，等弹窗打开再请求（上面的 watch 已处理）
})
</script>

<style scoped>
.tuzhi-management { padding: 0 10px 10px; }
.action-bar { margin-bottom: 16px; display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
.pagination-container { margin-top: 16px; text-align: right; }
.file-link { color: #409eff; cursor: pointer; }
.file-link:hover { text-decoration: underline; }
</style>