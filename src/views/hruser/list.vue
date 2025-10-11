<template>
  <div class="hruser-management">
    <div class="action-bar">
      <!-- <el-input v-model="queryParams.no" placeholder="请输入人员编号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getHruserList" @keyup.enter="getHruserList" /> -->
      <el-input v-model="queryParams.name" placeholder="请输入人员姓名查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getHruserList" @keyup.enter="getHruserList" />
      <!-- <el-select v-model="queryParams.workstatus" placeholder="选择工作状态" style="width: 200px; margin-right: 10px;">
        <el-option v-for="item in workStatusOptions" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>
      <el-select v-model="queryParams.sex" placeholder="选择性别" style="width: 200px; margin-right: 10px;">
        <el-option v-for="item in sexOptions" :key="item" :label="item" :value="item" />
      </el-select> -->

      <el-button type="primary" @click="getHruserList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增人员</el-button>
    </div>
    
    <el-table :data="hruserList" border v-loading="loading" table-layout="auto">
      <!-- 序号 -->
<el-table-column label="序号" width="80">
    <template #default="{ $index }">
      {{ startIndex + $index }}
    </template>
  </el-table-column>      
  <el-table-column prop="name" label="人员姓名" width="120" />
      <el-table-column prop="sex" label="性别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="department" label="部门名称" />
      <el-table-column prop="duty" label="职务" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
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

    <!-- 引入添加表单组件 -->
    <AddForm :newCode="newCode" :visible="showAddDialog" @update:visible="showAddDialog = $event" @success="handleSuccessAdd" 
      :sexOptions="sexOptions" :workStatusOptions="workStatusOptions" :polityOptions="polityOptions" 
      :schoolageOptions="schoolageOptions" :degreeOptions="degreeOptions" :learningFormatOptions="learningFormatOptions" />

    <!-- 引入编辑表单组件 -->
    <EditForm :visible="showEditDialog" :initial-data="selectedHruser" @update:visible="showEditDialog = $event"
      @success="handleSuccessEdit" :sexOptions="sexOptions" :workStatusOptions="workStatusOptions" 
      :polityOptions="polityOptions" :schoolageOptions="schoolageOptions" :degreeOptions="degreeOptions" 
      :learningFormatOptions="learningFormatOptions" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getHruserList as getHrusers, deleteHruser } from '@/api/hruser/hruser'
import AddForm from './AddForm.vue'
import EditForm from './EditForm.vue'
import { Refresh } from '@element-plus/icons-vue'

// 选项配置
const sexOptions = ['男', '女']

const workStatusOptions = [
  { id: 10, value: '在职' },
  { id: 20, value: '退休' },
  { id: 30, value: '买断' }
]

// 添加计算起始序号
const startIndex = computed(() => (queryParams.pageNumber - 1) * queryParams.pageSize + 1)
const polityOptions = [
  '中共党员', '中共预备党员', '共青团员', '民革党员', '民盟盟员', 
  '民建会员', '民进会员', '农工党党员', '致公党党员', '九三学社社员', 
  '台盟盟员', '无党派人士', '群众'
]

const schoolageOptions = [
  '博士研究生', '硕士研究生', '大学本科', '大学专科', 
  '中等职业', '普通高中', '初中', '小学', '其他'
]

const degreeOptions = [
  '博士', '硕士', '学士', '无'
]

const learningFormatOptions = [
  '普通全日制', '成人教育', '自学考试', '网络教育', '其他'
]

// 查询参数
const queryParams = reactive({
  no: '',
  name: '',
  workstatus: '',
  sex: '',
  pageNumber: 1,
  pageSize: 10
})

// 人员列表数据
const hruserList = ref([])
const total = ref(0)
const loading = ref(false)

// 对话框控制
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const selectedHruser = ref(null)
const newCode = ref('HR' + Date.now().toString().slice(-6)) // 简单生成新编号，可替换为API获取

// 计算年龄函数
const calculateAgeFromBirthdate = (birthdate) => {
  if (!birthdate) return null
  const birthDate = new Date(birthdate)
  const today = new Date('2025-10-11') // 当前日期
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age > 0 ? age : null
}

// 获取人员列表
const getHruserList = async () => {
  loading.value = true
  try {
    const res = await getHrusers(queryParams)
    hruserList.value = res.data.page.list.map(item => ({
      ...item,
      age: calculateAgeFromBirthdate(item.birthdate)
    }))
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取人员列表失败', error)
    ElMessage.error('获取人员列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getHruserList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getHruserList()
}

// 刷新
const handleRefresh = () => {
  queryParams.no = ''
  queryParams.name = ''
  queryParams.workstatus = ''
  queryParams.sex = ''
  queryParams.pageNumber = 1
  getHruserList()
}

// 新增人员
const handleAdd = () => {
  newCode.value = 'HR' + Date.now().toString().slice(-6) // 更新新编号
  showAddDialog.value = true
}

// 编辑人员
const handleEdit = (row) => {
  selectedHruser.value = row
  showEditDialog.value = true
}

// 删除人员
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除人员"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteHruser({ id: row.id })
      ElMessage.success('删除成功')
      getHruserList()
    } catch (error) {
      console.error('删除人员失败', error)
      ElMessage.error('删除人员失败')
    }
  }).catch(() => {})
}

// 成功回调
const handleSuccessAdd = () => {
  showAddDialog.value = false
  getHruserList()
}

const handleSuccessEdit = () => {
  showEditDialog.value = false
  getHruserList()
}

// 组件挂载时获取数据
onMounted(() => {
  getHruserList()
})
</script>

<style scoped>
.hruser-management {
  padding: 20px;
}

.action-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-container {
  display: flex;
  justify-content: left;
  margin-top: 20px;
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-table th {
  background-color: #f8f9fa;
  color: #606266;
  font-weight: 600;
}

.el-table td {
  padding: 12px 0;
}

.el-button + .el-button {
  margin-left: 8px;
}

.el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
}

.el-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.el-button--danger {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.el-button--danger:hover {
  background-color: #f78989;
  border-color: #f78989;
}

@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-bar .el-input,
  .action-bar .el-select {
    width: 100% !important;
    margin-right: 0 !important;
    margin-bottom: 10px;
  }
}

.el-table tr {
  transition: background-color 0.3s;
}

.el-table tr:hover {
  background-color: #fafafa;
}

.el-button {
  transition: all 0.3s;
}
</style>