<template>
  <div class="plentityid-management">
    <div class="action-bar">
      <el-input v-model="queryParams.purchaserHqCode" placeholder="请输入采购方总部编码" style="width: 180px; margin-right: 10px;" clearable @clear="getPlentityIdList" @keyup.enter="getPlentityIdList" />
      <el-input v-model="queryParams.supplierCode" placeholder="请输入供应商编码" style="width: 180px; margin-right: 10px;" clearable @clear="getPlentityIdList" @keyup.enter="getPlentityIdList" />
      <el-input v-model="queryParams.supplierName" placeholder="请输入供应商名称" style="width: 180px; margin-right: 10px;" clearable @clear="getPlentityIdList" @keyup.enter="getPlentityIdList" />
      <el-input v-model="queryParams.entityCode" placeholder="请输入实物ID" style="width: 180px; margin-right: 10px;" clearable @clear="getPlentityIdList" @keyup.enter="getPlentityIdList" />
      <el-input v-model="queryParams.poItemId" placeholder="请输入采购订单行项目ID" style="width: 150px; margin-right: 10px;" clearable @clear="getPlentityIdList" @keyup.enter="getPlentityIdList" />
      <el-select v-model="queryParams.entityStatus" placeholder="实物状态" style="width: 120px; margin-right: 10px;">
        <el-option v-for="item in entityStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="queryParams.status" placeholder="状态" style="width: 100px; margin-right: 10px;">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="getPlentityIdList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增实物ID</el-button>
    </div>

    <el-table :data="plentityIdList" border v-loading="loading" style="width: 100%">
      <el-table-column label="序号" width="80">
  <template #default="scope">
    {{ (queryParams.pageNumber - 1) * queryParams.pageSize + scope.$index + 1 }}
  </template>
</el-table-column>
      <el-table-column prop="purchaserHqCode" label="采购方总部编码" />
      <el-table-column prop="supplierCode" label="供应商编码" />
      <el-table-column prop="supplierName" label="供应商名称" />
      <el-table-column prop="entityCode" label="实物ID" />
      <el-table-column prop="poItemId" label="采购订单行项目ID" />
      <el-table-column prop="entityStatus" label="实物状态" width="100">
        <template #default="{ row }">
          {{ getEntityStatusLabel(row.entityStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="dataSource" label="数据来源" />
      <el-table-column prop="dataSourceCreateTime" label="数据来源创建时间" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="ownerId" label="数据拥有方" />
      <el-table-column prop="openId" label="数据可见方" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          {{ getStatusLabel(row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="flag" label="标记" />
      <el-table-column label="操作" width="200">
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
      width="800px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购方总部编码" prop="purchaserHqCode">
              <el-input v-model="form.purchaserHqCode" placeholder="请输入采购方总部编码" />
            </el-form-item>
            <el-form-item label="供应商编码" prop="supplierCode">
              <el-input v-model="form.supplierCode" placeholder="请输入供应商编码" />
            </el-form-item>
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="form.supplierName" placeholder="请输入供应商名称" />
            </el-form-item>
            <el-form-item label="实物ID" prop="entityCode">
              <el-input v-model="form.entityCode" placeholder="请输入实物编码" />
            </el-form-item>
            <el-form-item label="采购订单行项目ID" prop="poItemId">
              <el-input v-model.number="form.poItemId" placeholder="请输入采购订单行项目ID" type="number" />
            </el-form-item>
            <el-form-item label="实物状态" prop="entityStatus">
              <el-select v-model="form.entityStatus" placeholder="请选择实物状态">
                <el-option v-for="item in entityStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据来源" prop="dataSource">
              <el-input v-model="form.dataSource" placeholder="请输入数据来源" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据来源创建时间" prop="dataSourceCreateTime">
              <el-input v-model="form.dataSourceCreateTime" placeholder="请输入数据来源创建时间" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="数据拥有方" prop="ownerId">
              <el-input v-model="form.ownerId" placeholder="请输入所有者ID" />
            </el-form-item>
            <el-form-item label="数据可见方" prop="openId">
              <el-input v-model="form.openId" placeholder="请输入OpenID" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="标记" prop="flag">
              <el-input v-model="form.flag" placeholder="请输入标记" />
            </el-form-item>
          </el-col>
        </el-row>
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
// 你需要实现对应的API方法
import { getPlentityIds, getPlentityIdById, createPlentityId, updatePlentityId, deletePlentityId } from '@/api/plmanage/plentityid'

// 实物状态选项
const entityStatusOptions = [
  { value: '正常', label: '正常' },
  { value: '冻结', label: '冻结' },
  { value: '作废', label: '作废' }
]

// 状态选项
const statusOptions = [
  { value: '0', label: '正常' },
  { value: '1', label: '停用' }
]

// 状态label
const getStatusLabel = (status) => {
  const item = statusOptions.find(option => option.value == status)
  return item ? item.label : '未知'
}

// 实物状态label
const getEntityStatusLabel = (status) => {
  const item = entityStatusOptions.find(option => option.value == status)
  return item ? item.label : '未知'
}

// 查询参数
const queryParams = reactive({
  purchaserHqCode: '',
  supplierCode: '',
  supplierName: '',
  entityCode: '',
  poItemId: '',
  entityStatus: '',
  dataSource: '',
  dataSourceCreateTime: '',
  remark: '',
  ownerId: '',
  openId: '',
  status: '',
  flag: '',
  pageNumber: 1,
  pageSize: 10
})

// 数据列表
const plentityIdList = ref([])
const total = ref(0)
const loading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增实物ID' : '编辑实物ID')
const formRef = ref(null)
const form = reactive({
  id: undefined,
  purchaserHqCode: '',
  supplierCode: '',
  supplierName: '',
  entityCode: '',
  poItemId: null,
  entityStatus: '',
  dataSource: '',
  dataSourceCreateTime: '',
  remark: '',
  ownerId: '',
  openId: '',
  status: '',
  flag: ''
})

// 表单验证规则
const rules = {
  purchaserHqCode: [
    { required: true, message: '请输入采购方总部编码', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  supplierCode: [
    { required: true, message: '请输入供应商编码', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  supplierName: [
    { required: true, message: '请输入供应商名称', trigger: 'blur' }, // <--- 必填
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  entityCode: [
    { required: true, message: '请输入实物编码', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  poItemId: [
    { required: true, type: 'number', message: '请输入有效的采购订单行项目ID', trigger: ['blur', 'change'] } // <--- 必填
  ],
  entityStatus: [
    { required: true, message: '请选择实物状态', trigger: 'change' }
  ],
  dataSource: [
    { required: true, message: '请输入数据来源', trigger: 'blur' }, // <--- 必填
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  dataSourceCreateTime: [
    { required: true, message: '请输入数据来源创建时间', trigger: 'blur' }, // <--- 必填
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  remark: [
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  ownerId: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  openId: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  status: [
    { required: false, message: '请选择状态', trigger: 'change' }
  ],
  flag: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ]
}

// 获取列表
const getPlentityIdList = async () => {
  loading.value = true
  try {
    const res = await getPlentityIds(queryParams)
    plentityIdList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取实物ID列表失败', error)
    ElMessage.error('获取实物ID列表失败')
  } finally {
    loading.value = false
  }
}

// 分页
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getPlentityIdList()
}
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getPlentityIdList()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: undefined,
    purchaserHqCode: '',
    supplierCode: '',
    supplierName: '',
    entityCode: '',
    poItemId: null,
    entityStatus: '',
    dataSource: '',
    dataSourceCreateTime: '',
    remark: '',
    ownerId: '',
    openId: '',
    status: '',
    flag: ''
  })
}

// 刷新
const handleRefresh = () => {
  Object.assign(queryParams, {
    purchaserHqCode: '',
    supplierCode: '',
    supplierName: '',
    entityCode: '',
    poItemId: '',
    entityStatus: '',
    dataSource: '',
    dataSourceCreateTime: '',
    remark: '',
    ownerId: '',
    openId: '',
    status: '',
    flag: '',
    pageNumber: 1
  })
  getPlentityIdList()
}

// 新增
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

// 编辑
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  const res = await getPlentityIdById({ id: row.id })
  Object.assign(form, res.data.plentityid)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除实物ID "${row.entityCode}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deletePlentityId({ id: row.id })
      ElMessage.success('删除成功')
      getPlentityIdList()
    } catch (error) {
      console.error('删除失败', error)
      ElMessage.error('删除失败')
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
          await createPlentityId(form)
          ElMessage.success('新增成功')
        } else {
          await updatePlentityId(form)
          ElMessage.success('修改成功')
        }
        dialogVisible.value = false
        getPlentityIdList()
      } catch (error) {
        console.error('保存失败', error)
        ElMessage.error('保存失败')
      }
    }
  })
}

// 页面初始化
onMounted(() => {
  getPlentityIdList()
})
</script>

<style scoped>
.plentityid-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>