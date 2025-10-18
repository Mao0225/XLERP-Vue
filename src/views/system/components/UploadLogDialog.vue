<template>
  <el-dialog
    v-model="dialogVisible"
    title="上传记录日志"
    width="1400px"
    :before-close="handleClose"
    destroy-on-close
  >
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-form :model="filters" inline>
        <el-form-item label="接口名称：">
          <el-input 
            v-model="filters.interfaceName" 
            placeholder="请输入接口名称" 
            clearable 
            style="width: 200px;"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <el-table 
      :data="tableData" 
      v-loading="loading"
      height="400"
      stripe
      border
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column 
        prop="uploadStatus" 
        label="上传状态" 
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type="row.uploadStatus === 0 ? 'success' : 'danger'">
            {{ row.uploadStatus === 0 ? '成功' : '失败' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column 
        prop="interfaceName" 
        label="接口名称" 
        width="150" 
        show-overflow-tooltip
      />
      <el-table-column 
        prop="interfaceDescribe" 
        label="接口描述" 
        width="150" 
        show-overflow-tooltip
      />
      <el-table-column 
        prop="uploadStartTime" 
        label="上传开始时间" 
        width="160" 
        show-overflow-tooltip
      />
      <el-table-column 
        prop="uploadFinishTime" 
        label="上传结束时间" 
        width="160" 
        show-overflow-tooltip
      />
      <el-table-column 
        prop="result" 
        label="结果" 
        width="300" 
        show-overflow-tooltip
      />
      <el-table-column 
        prop="uploadUrl" 
        label="上传URL" 
        width="250" 
        show-overflow-tooltip
      />
      <el-table-column 
        label="上传内容" 
        width="100"
        fixed="right"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            link
            @click="openContentDialog(row)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>

    <!-- 内容详情弹窗 -->
    <el-dialog
      v-model="contentDialogVisible"
      :title="contentDialogTitle"
      width="80%"
      top="5vh"
    >
      <div class="content-detail">
        <!-- Headers 部分 -->
        <div v-if="parsedHeaders" class="detail-section">
          <h4>Headers</h4>
          <table class="key-value-table">
            <tbody>
              <tr v-for="(value, key) in parsedHeaders" :key="key">
                <td class="key-cell">{{ key }}</td>
                <td class="value-cell">{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Body 部分 -->
        <div v-if="parsedBody && parsedBody.length > 0" class="detail-section">
          <h4>Body ({{ parsedBody.length }} 条记录)</h4>
          <div class="body-items">
            <div v-for="(item, index) in parsedBody" :key="index" class="body-item">
              <div class="body-item-header">
                记录 {{ index + 1 }} 
                <span class="checksum">checksum: {{ item.checksum }}</span>
              </div>
              <table class="key-value-table">
                <tbody>
                  <tr v-for="(value, key) in item.data" :key="key">
                    <td class="key-cell">{{ key }}</td>
                    <td class="value-cell">{{ value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 结果部分 -->
        <div v-if="resultContent" class="detail-section">
          <h4>Result</h4>
          <pre class="result-content">{{ resultContent }}</pre>
        </div>

        <!-- 原始内容（备用显示） -->
        <div v-if="!parsedHeaders && !parsedBody && formattedContent" class="detail-section">
          <h4>原始内容</h4>
          <pre class="raw-content" v-html="formattedContent"></pre>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="contentDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getUploadLogPage } from '@/api/system/upload'

// Props 定义
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  interfaceName: {
    type: String,
    default: ''
  }
})

// Emits 定义
const emits = defineEmits(['update:visible'])

// 响应式数据：对话框可见性
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emits('update:visible', val)
})

const loading = ref(false)
const tableData = ref([])

// 搜索条件
const filters = reactive({
  interfaceName: props.interfaceName || ''
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 内容详情弹窗
const contentDialogVisible = ref(false)
const currentRow = ref(null)
const formattedContent = ref('')
const parsedHeaders = ref(null)
const parsedBody = ref(null)
const resultContent = ref('')
const contentDialogTitle = computed(() => `内容详情 - ${currentRow.value?.interfaceName || ''}`)

// 获取数据
const fetchData = async () => {
  try {
    loading.value = true
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.size,
      interfaceName: filters.interfaceName || props.interfaceName
    }

    // 过滤空值参数
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    )

    const res = await getUploadLogPage(filteredParams)

    if (res.code === 200 && res.success) {
      tableData.value = res.data.page.list.map(item => ({
        ...item,
        uploadStartTime: item.uploadStartTime || '',
        uploadFinishTime: item.uploadFinishTime || ''
      }))
      
      pagination.total = res.data.page.totalRow
    } else {
      throw new Error(res.msg || '获取数据失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '获取数据失败')
    tableData.value = []
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

// 处理重置
const handleReset = () => {
  Object.assign(filters, {
    interfaceName: props.interfaceName || ''
  })
  pagination.current = 1
  fetchData()
}

// 处理分页
const handleSizeChange = (val) => {
  pagination.size = val
  pagination.current = 1
  fetchData()
}

const handleCurrentChange = (val) => {
  pagination.current = val
  fetchData()
}

// 打开内容详情弹窗
const openContentDialog = (row) => {
  currentRow.value = row
  parseAndFormatContent(row.content, row.result)
  contentDialogVisible.value = true
}

// 解析并格式化内容
const parseAndFormatContent = (content, result) => {
  if (!content) {
    formattedContent.value = ''
    parsedHeaders.value = null
    parsedBody.value = null
    resultContent.value = result || ''
    return
  }

  try {
    // 提取 headers - 改进正则表达式以匹配单引号
    const headersMatch = content.match(/headers:\s*(\{[^}]*\})/s)
    if (headersMatch) {
      let headersStr = headersMatch[1]
      // 将单引号替换为双引号以便JSON解析
      headersStr = headersStr.replace(/'/g, '"')
      parsedHeaders.value = JSON.parse(headersStr)
    } else {
      parsedHeaders.value = null
    }

    // 提取 body - 改进正则表达式
    const bodyMatch = content.match(/body:\s*(\[[^\]]*\])/s)
    if (bodyMatch) {
      let bodyStr = bodyMatch[1]
      // 将单引号替换为双引号以便JSON解析
      bodyStr = bodyStr.replace(/'/g, '"')
      parsedBody.value = JSON.parse(bodyStr)
    } else {
      parsedBody.value = null
    }

    // 原始格式化内容（作为 fallback）
    formattedContent.value = content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
  } catch (error) {
    console.error('解析内容失败:', error)
    formattedContent.value = content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
    parsedHeaders.value = null
    parsedBody.value = null
  }

  resultContent.value = result || ''
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
}

// 监听对话框显示状态
watch(dialogVisible, (newVal) => {
  if (newVal) {
    filters.interfaceName = props.interfaceName || ''
    fetchData()
  } else {
    Object.assign(filters, { interfaceName: '' })
    pagination.current = 1
    tableData.value = []
  }
})
</script>

<style scoped>
.search-section {
  margin-bottom: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-section .el-form-item {
  margin-bottom: 0;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-table .el-table__row:hover > td) {
  background-color: #f5f7fa;
}

/* 内容详情弹窗样式 */
.content-detail {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.detail-section h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

/* 表格样式 */
.key-value-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  font-size: 13px;
}

.key-value-table tr {
  border-bottom: 1px solid #e5e7eb;
}

.key-value-table tr:last-child {
  border-bottom: none;
}

.key-value-table tr:hover {
  background: #f9fafb;
}

.key-cell {
  padding: 8px 12px;
  color: #6b7280;
  font-weight: 500;
  width: 30%;
  background: #fafafa;
}

.value-cell {
  padding: 8px 12px;
  color: #111827;
  word-break: break-all;
}

/* Body 项目样式 */
.body-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.body-item {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.body-item-header {
  padding: 10px 12px;
  background: #f3f4f6;
  font-weight: 500;
  color: #374151;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checksum {
  color: #6b7280;
  font-size: 12px;
  font-family: 'Courier New', monospace;
}

/* 结果和原始内容样式 */
.result-content,
.raw-content {
  background: #fff;
  padding: 12px;
  margin: 0;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #374151;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-section .el-form {
    display: block;
  }
  
  .search-section .el-form-item {
    display: block;
    margin-bottom: 12px;
  }
  
  .search-section .el-form-item:last-child {
    margin-bottom: 0;
  }
  
  .search-section .el-input {
    width: 100% !important;
  }

  .content-detail {
    font-size: 12px;
  }

  .key-value-table th,
  .key-cell,
  .value-cell {
    padding: 8px 12px;
  }
}

/* 滚动条样式 */
.content-detail::-webkit-scrollbar {
  width: 8px;
}

.content-detail::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.content-detail::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.content-detail::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>