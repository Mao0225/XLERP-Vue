<template>
  <div class="upload-task-management">
    <div class="action-bar">
      <el-input v-model="queryParams.search" placeholder="请输入任务ID或描述查询" style="width: 300px; margin-right: 10px;"
        clearable @clear="getTaskList" @keyup.enter="getTaskList" />
      <el-button type="primary" @click="getTaskList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>
    </div>
    
    <el-table :data="filteredTasks" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <!-- 序号 -->

      <el-table-column prop="task_id" label="任务ID" width="150" />
      <el-table-column prop="description" label="描述" width="200" />
      <el-table-column prop="interval" label="间隔(秒)" width="120" />
      <el-table-column prop="upload_url" label="上传接口" width="260" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'running' ? 'success' : 'info'">
            {{ row.status === 'running' ? '运行中' : '已停止' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="last_run" label="上次运行时间" width="220" />
      <el-table-column prop="errors" label="错误状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.errors > 0 ? 'danger' : 'success'">
            {{ row.errors > 0 ? '有错误' : '正常' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #default="{ row }">
          <el-button 
            :type="row.status === 'running' ? 'danger' : 'success'" 
            size="small" 
            @click="handleToggle(row)">
            {{ row.status === 'running' ? '停止' : '启动' }}
          </el-button>
          <el-button type="primary" size="small" @click="openLogDialog(row.task_id)">查看日志</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>


  <!-- 上传日志对话框 -->
    <UploadLogDialog 
      :visible="logDialogVisible" 
      :interfaceName="selectedInterfaceName"
      @update:visible="logDialogVisible = $event"
    />
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listAllTasks, startUploadTask, stopUploadTask } from '@/api/system/upload' // 假设API路径，根据实际调整
import UploadLogDialog from './components/UploadLogDialog.vue'

// 查询参数
const queryParams = reactive({
  search: ''
})


const logDialogVisible = ref(false)
const selectedInterfaceName = ref('user_orders') // 示例：传入接口名称

const openLogDialog = (interfaceName) => {
  // 可动态设置 interfaceName
  selectedInterfaceName.value = interfaceName// 根据需要设置
  logDialogVisible.value = true
}// 任务列表数据
const taskList = ref([])
const loading = ref(false)

// 计算属性：过滤后的任务列表
const filteredTasks = computed(() => {
  if (!queryParams.search) return taskList.value
  const keyword = queryParams.search.toLowerCase()
  return taskList.value.filter(task => 
    task.task_id.toLowerCase().includes(keyword) || 
    task.description.toLowerCase().includes(keyword)
  )
})

// 获取任务列表
const getTaskList = async () => {
  loading.value = true
  try {
    const res = await listAllTasks()
    if (res.success) {
      taskList.value = res.data.tasks || []
    } else {
      ElMessage.error(res.msg || '获取任务列表失败')
    }
  } catch (error) {
    console.error('获取任务列表失败', error)
    ElMessage.error('获取任务列表失败')
  } finally {
    loading.value = false
  }
}

// 处理切换任务状态
const handleToggle = async (row) => {
  const action = row.status === 'running' ? '停止' : '启动'
  const confirmText = `确认${action}任务"${row.task_id}"吗？`
  
  ElMessageBox.confirm(confirmText, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      let res
      if (row.status === 'running') {
        res = await stopUploadTask(row.task_id)
      } else {
        res = await startUploadTask(row.task_id)
      }
      if (res.success) {
        ElMessage.success(`${action}成功`)
        getTaskList()
      } else {
        ElMessage.error(res.msg || `${action}失败`)
      }
    } catch (error) {
      console.error(`${action}任务失败`, error)
      ElMessage.error(`${action}任务失败`)
    }
  }).catch(() => {})
}

// 刷新
const handleRefresh = () => {
  queryParams.search = ''
  getTaskList()
}

// 页面初始化
onMounted(() => {
  getTaskList()
})
</script>

<style scoped>
.upload-task-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
</style>