<template>
  <div class="department-management">
    <div class="action-bar">
      <el-input v-model="queryParams.departmentName" placeholder="请输入部门名称搜索" style="width: 200px; margin-right: 10px;" clearable
        @clear="getDepartmentList()" @keyup.enter="getDepartmentList()" />
      <el-button type="primary" @click="  getDepartmentList()
">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增部门</el-button>
    </div>

    <el-table :data="departmentList" border v-loading="loading" style="width: 100%">
      <!-- <el-table-column prop="id" label="ID" width="80" /> -->
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="no" label="部门编号" />
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="memo" label="备注" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-model:current-page="queryParams.pageNumber" v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 部门表单对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" @closed="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="部门编号" prop="no">
          <el-input v-model="form.no" placeholder="请输入部门编号" />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="form.memo" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getBasDepartments,
  getBasDepartmentById,
  createBasDepartment,
  updateBasDepartment,
  deleteBasDepartment
} from '@/api/system/department'
import { useTermStore } from '@/store/term'

// 查询参数，调整为后端期望的字段名
const queryParams = reactive({
  departmentName: '',
  pageNumber: 1,
  pageSize: 10,
})

// 部门列表数据
const departmentList = ref([])
const total = ref(0)
const loading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增部门' : '编辑部门')
const formRef = ref(null)
const form = reactive({
  id: undefined,
  no: '',
  name: '',
  memo: '',
  type: '0', // 默认值与后端一致
  flag: 0,
  status: 0,
})

// 表单验证规则
const rules = {
  no: [
    { required: true, message: '请输入部门编号', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  memo: [
    { max: 200, message: '备注长度不能超过 200 个字符', trigger: 'blur' },
  ],
}

// 获取部门列表
const getDepartmentList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      // term: useTermStore().currentTerm?.term, // 如果需要 term 参数
    }
    console.log('请求参数:', params) // 调试：打印请求参数
    const res = await getBasDepartments(params)
    console.log('后端返回数据:', res) // 调试：打印后端返回数据
    if (res.success) {
      departmentList.value = res.data.page.list
      total.value = res.data.page.totalRow // 调整为 totalRow
      console.log('部门列表:', departmentList.value)
      console.log('总记录数:', total.value)
    } else {
      ElMessage.error(res.msg || '获取部门列表失败')
    }
  } catch (error) {
    console.error('获取部门列表失败:', error)
    ElMessage.error('获取部门列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNumber = 1 // 重置到第一页
  console.log('分页大小变更:', queryParams.pageSize) // 调试
  getDepartmentList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  console.log('当前页变更:', queryParams.pageNumber) // 调试
  getDepartmentList()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.id = undefined
  form.no = ''
  form.name = ''
  form.memo = ''
  form.type = '0'
  form.flag = 0
  form.status = 0
}

// 新增部门
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

// 编辑部门
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  try {
    const res = await getBasDepartmentById({ id: row.id })
    console.log('获取部门信息:', res) // 调试
    if (res.success) {
      Object.assign(form, res.data.basDepartment)
      dialogVisible.value = true
    } else {
      ElMessage.error(res.msg || '获取部门信息失败')
    }
  } catch (error) {
    console.error('获取部门信息失败:', error)
    ElMessage.error('获取部门信息失败')
  }
}

// 删除部门
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除部门"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await deleteBasDepartment({ id: row.id })
        if (res.success) {
          ElMessage.success('删除成功')
          getDepartmentList()
        } else {
          ElMessage.error(res.msg || '删除部门失败')
        }
      } catch (error) {
        console.error('删除部门失败:', error)
        ElMessage.error('删除部门失败')
      }
    })
    .catch(() => { })
}

const handleRefresh = () => {
  queryParams.departmentName = ''
  queryParams.pageNumber = 1
  getDepartmentList()
}
// 提交表单
const submitForm = () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const submitForm = { ...form }
        console.log('提交表单数据:', submitForm) // 调试
        if (dialogType.value === 'add') {
          const res = await createBasDepartment(submitForm)
          if (res.success) {
            ElMessage.success('新增成功')
          } else {
            ElMessage.error(res.msg || '新增部门失败')
          }
        } else {
          const res = await updateBasDepartment(submitForm)
          if (res.success) {
            ElMessage.success('修改成功')
          } else {
            ElMessage.error(res.msg || '修改部门失败')
          }
        }
        dialogVisible.value = false
        getDepartmentList()
      } catch (error) {
        console.error('保存部门失败:', error)
        ElMessage.error('保存部门失败')
      }
    }
  })
}

// 页面初始化
onMounted(() => {
  getDepartmentList()
})
</script>

<style scoped>
.department-management {
  padding: 20px;
}

.action-bar {
  display: flex;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>