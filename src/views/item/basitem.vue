<template>
  <div class="basitem-management">
        <div class="action-bar">
      <el-input v-model="queryParams.itemNo" placeholder="请输入物料编号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasItemList" @keyup.enter="getBasItemList" />
      <el-input v-model="queryParams.itemName" placeholder="请输入物料名称查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasItemList" @keyup.enter="getBasItemList" />
      <el-select v-model="queryParams.inclass"  placeholder="选择物料所属分类" style="width: 200px; margin-right: 10px;" >
          <el-option  v-for="item in inclassOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="queryParams.type" placeholder="选择物料类型" style="width: 200px; margin-right: 10px;">
      <el-option v-for="item in typeLabelOptions" :key="item.id" :label="item.value" :value="item.id" />
    </el-select>

      <el-button type="primary" @click="getBasItemList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增物料</el-button>
    </div>
    
    <el-table :data="basItemList" border v-loading="loading" style="width: 100%">
      <!-- 序号 -->
       <el-table-column type="index" label="序号" width="80" />
      <!-- <el-table-column prop="id" label="ID" width="80" /> -->
      <el-table-column prop="no" label="物料编号" />
            <el-table-column prop="spec" label="规格型号" />
      <el-table-column prop="name" label="物料名称" />
      <el-table-column prop="unit" label="计量单位" />
      <el-table-column prop="planned_price" label="计划价格" />
      <el-table-column prop="type" label="物料类型" width="120">
        <template #default="{ row }">
          {{ getFlagLabel(row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="inclass" label="所属分类" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          {{ row.status === 0 ? '正常' : '停用' }}
        </template>
      </el-table-column>
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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物料编号" prop="no">
              <el-input v-model="form.no" placeholder="请输入物料编号" />
            </el-form-item>
            <el-form-item label="物料名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入物料名称" />
            </el-form-item>
            <el-form-item label="计量单位" prop="unit">
              <el-select v-model="form.unit" placeholder="请选择或输入单位" allow-create filterable>
                <el-option v-for="item in unitOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="物料类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择物料类型">
                   <el-option v-for="item in typeLabelOptions" :key="item.id" :label="item.value" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="所属分类" prop="inclass">
              <el-select v-model="form.inclass" placeholder="请选择或输入分类" allow-create filterable>
                <el-option v-for="item in inclassOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item label="规格型号" prop="spec">
              <el-input v-model="form.spec" placeholder="请输入规格型号" />
            </el-form-item>
            <el-form-item label="物料描述" prop="description">
              <el-input v-model="form.description" placeholder="请输入物料描述" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颜色" prop="color">
              <el-input v-model="form.color" placeholder="请输入颜色" />
            </el-form-item>
            <el-form-item label="重量" prop="weight">
              <el-input v-model.number="form.weight" placeholder="请输入重量" type="number" />
            </el-form-item>
            <el-form-item label="计划价格" prop="planned_price">
              <el-input v-model.number="form.planned_price" placeholder="请输入计划价格" type="number" />
            </el-form-item>
            <el-form-item label="平均价格" prop="avg_price">
              <el-input v-model.number="form.avg_price" placeholder="请输入平均价格" type="number" />
            </el-form-item>
            <el-form-item label="存放位置" prop="location">
              <el-input v-model="form.location" placeholder="请输入存放位置" />
            </el-form-item>
            <el-form-item label="技术参数" prop="tech_memo">
              <el-input v-model="form.tech_memo" placeholder="请输入技术参数" />
            </el-form-item>
            <el-form-item label="备注信息" prop="memo">
              <el-input v-model="form.memo" placeholder="请输入备注信息" />
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
import { getBasItems, getBasItemById, createBasItem, updateBasItem, deleteBasItem } from '@/api/item/basitem'

// 单位选项
const unitOptions = [
  '件', '套', '个', '块', '根', '袋', '箱', '捆', '托', '纸箱'
]

// 分类选项
const inclassOptions = [
  '标件', '标准件', '锻件', '铝件', '玛铁件', '耐火', '燃料', 
  '铜铝件', '油二', '油一', '铸件'
]

// 物料类型映射
const typeLabelOptions = [
  { id: 10, value: '原料' },
  { id: 20, value: '成品' },
  { id: 30, value: '半成品' },
  { id: 40, value: '废料' },
  { id: 100, value: '其它' }
]

// 获取物料类型标签
const getFlagLabel = (type) => {
  const item = typeLabelOptions.find(option => option.id === type)
  return item ? item.value : '未知'
}

// 查询参数
const queryParams = reactive({
  itemNo: '',
  itemName: '',
  type: '',
  inclass: '',
  pageNumber: 1,
  pageSize: 10
})

// 物料列表数据
const basItemList = ref([])
const total = ref(0)
const loading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增物料' : '编辑物料')
const formRef = ref(null)
const form = reactive({
  id: undefined,
  no: '',
  name: '',
  unit: '',
  spec: '',
  description: '',
  color: '',
  memo: '',
  type: 10,
  weight: 0.00,
  keeper_rule: '',
  planned_price: 0.00,
  avg_price: 0.00,
  location: '',
  tech_memo: '',
  status: 0,
  inclass: '',
  isdelete: 0
})

// 表单验证规则
const rules = {
  no: [
    { required: true, message: '请输入物料编号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入物料名称', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  unit: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  spec: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  description: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  color: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  memo: [
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择物料类型', trigger: 'change' },
    { type: 'number', message: '请选择有效的物料类型', trigger: ['blur', 'change'] }
  ],
  weight: [
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change'] }
  ],
  planned_price: [
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change'] }
  ],
  avg_price: [
    { type: 'number', message: '请输入有效的数字', trigger: ['blur', 'change'] }
  ],
  location: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  tech_memo: [
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  inclass: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ]
}

// 获取物料列表
const getBasItemList = async () => {
  loading.value = true
  try {
    const res = await getBasItems(queryParams)
    basItemList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取物料列表失败', error)
    ElMessage.error('获取物料列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getBasItemList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getBasItemList()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: undefined,
    no: '',
    name: '',
    unit: '',
    spec: '',
    description: '',
    color: '',
    memo: '',
    type: 10,
    weight: 0.00,
    keeper_rule: '',
    planned_price: 0.00,
    avg_price: 0.00,
    location: '',
    tech_memo: '',
    status: 0,
    inclass: '',
    isdelete: 0
  })
}

//刷新
const handleRefresh = () => {
  queryParams.itemNo = ''
  queryParams.itemName = ''
  queryParams.type = ''
  queryParams.inclass = ''
  queryParams.pageNumber = 1
  getBasItemList()
}



// 新增物料
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

// 编辑物料
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  const res = await getBasItemById({ id: row.id })
  Object.assign(form, res.data.basItem)
  dialogVisible.value = true
}

// 删除物料
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除物料"${row.no}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteBasItem({ id: row.id })
      ElMessage.success('删除成功')
      getBasItemList()
    } catch (error) {
      console.error('删除物料失败', error)
      ElMessage.error('删除物料失败')
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
          await createBasItem(form)
          ElMessage.success('新增成功')
        } else {
          await updateBasItem(form)
          ElMessage.success('修改成功')
        }
        dialogVisible.value = false
        getBasItemList()
      } catch (error) {
        console.error('保存物料失败', error)
        ElMessage.error('保存物料失败')
      }
    }
  })
}

// 页面初始化
onMounted(() => {
  getBasItemList()
})
</script>

<style scoped>
.basitem-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>