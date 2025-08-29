<template>
  <div class="basno-management">
    <div class="action-bar">
      <el-input v-model="queryParams.basname" placeholder="请输入编号简称查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasNoList" @keyup.enter="getBasNoList" />
      <el-input v-model="queryParams.memo" placeholder="请输入备注查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasNoList" @keyup.enter="getBasNoList" />
      <el-button type="primary" @click="getBasNoList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增编号</el-button>
    </div>
    
    <el-table :data="basNoList" border v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="basname" label="编号简称" />
      <el-table-column prop="currentterm" label="当前期次" />
      <el-table-column prop="basnum" label="当前序号" />
      <el-table-column label="当前完整编号" width="200">
        <template #default="{ row }">
          {{ row.basname + row.currentterm + row.basnum.toString().padStart(5, '0') }}
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" width="300" />
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

    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="编号简称" prop="basname">
          <el-input v-model="form.basname" placeholder="请输入编号简称" />
        </el-form-item>
        <el-form-item label="当前期次" prop="currentterm">
          <el-input v-model="form.currentterm" placeholder="请输入当前期次" />
        </el-form-item>
        <el-form-item label="当前序号" prop="basnum">
          <el-input v-model.number="form.basnum" placeholder="请输入当前序号" />
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="form.memo" placeholder="请输入备注信息" type="textarea" :rows="3" />
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
import { getBasNoPage, getBasNoById, createBasNo, updateBasNo, deleteBasNo } from '@/api/system/basno'

// 查询参数
const queryParams = reactive({
  basname: '',
  memo: '',
  pageNumber: 1,
  pageSize: 10
})

// 编号列表数据
const basNoList = ref([])
const total = ref(0)
const loading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增编号' : '编辑编号')
const formRef = ref(null)

const form = reactive({
  id: undefined,
  basname: '',
  currentterm: '',
  basnum: '',
  memo: '',
  type: null,
  flag: null
})

// 表单验证规则
const rules = {
  basname: [
    { required: true, message: '请输入编号简称', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  currentterm: [
    { required: true, message: '请输入当前期次', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位数字的期次', trigger: 'blur' }
  ],
  basnum: [
    { required: true, message: '请输入当前序号', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: 'blur' }
  ],
  memo: [
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ]
}

// 获取编号列表
const getBasNoList = async () => {
  loading.value = true
  try {
    const res = await getBasNoPage(queryParams)
    basNoList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取编号列表失败', error)
    ElMessage.error('获取编号列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getBasNoList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getBasNoList()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: undefined,
    basname: '',
    currentterm: '',
    basnum: '',
    memo: '',
    type: null,
    flag: null
  })
}

// 刷新
const handleRefresh = () => {
  queryParams.basname = ''
  queryParams.memo = ''
  queryParams.pageNumber = 1
  getBasNoList()
}

// 新增编号
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

// 编辑编号
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  try {
    const res = await getBasNoById({ id: row.id })
    Object.assign(form, res.data.Basno)
    dialogVisible.value = true
  } catch (error) {
    console.error('获取编号详情失败', error)
    ElMessage.error('获取编号详情失败')
  }
}

// 删除编号
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除编号"${row.basname}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteBasNo({ id: row.id })
      ElMessage.success('删除成功')
      getBasNoList()
    } catch (error) {
      console.error('删除编号失败', error)
      ElMessage.error('删除编号失败')
    }
  }).catch(() => {})
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await createBasNo(form)
          ElMessage.success('新增成功')
        } else {
          await updateBasNo(form)
          ElMessage.success('修改成功')
        }
        dialogVisible.value = false
        getBasNoList()
      } catch (error) {
        console.error('保存编号失败', error)
        ElMessage.error('保存编号失败')
      }
    }
  })
}

// 页面初始化
onMounted(() => {
  getBasNoList()
})
</script>

<style scoped>
.basno-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>