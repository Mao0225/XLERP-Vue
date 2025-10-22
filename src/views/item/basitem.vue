<!-- basitem.vue -->
<template>
  <div class="basitem-management">
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-input v-model="queryParams.itemNo" placeholder="请输入物料编号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasItemList" @keyup.enter="getBasItemList" />
      <el-input v-model="queryParams.itemName" placeholder="请输入物料名称查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasItemList" @keyup.enter="getBasItemList" />
      <el-select v-model="queryParams.inclass" placeholder="选择物料所属分类" style="width: 200px; margin-right: 10px;">
        <el-option v-for="item in filteredInclassOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="queryParams.type" placeholder="选择物料类型" style="width: 200px; margin-right: 10px;" @change="handleTypeChange">
        <el-option v-for="item in typeLabelOptions" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>

      <el-button type="primary" @click="getBasItemList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增物料</el-button>
      <el-button type="primary" @click="importItem" >导入物料</el-button>
      <el-button type="info" @click="downloadExsl">下载模板</el-button>
    </div>

    <!-- 物料列表 -->
    <el-table :data="basItemList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="no" label="物料编号" />
      <el-table-column prop="spec" label="规格型号" />
      <el-table-column prop="name" label="物料名称" />
      <el-table-column prop="unit" label="计量单位" />
      <el-table-column prop="planned_price" label="计划价格" />
      <el-table-column prop="grade" label="等级" />
      <el-table-column prop="drawing_standard_no" label="图号/标准号" />
      <el-table-column prop="material_version" label="物料版本" />
      <el-table-column prop="auxiliary_attribute" label="辅助属性" />
      <el-table-column prop="material_attribute" label="物料属性" />
      <el-table-column prop="type" label="物料类型" width="120" >
        <template #default="{ row }">
          {{ getFlagLabel(row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="inclass" label="所属分类" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="handleMaterialManage(row)">材料管理</el-button>
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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

    <!-- 导入结果弹窗 -->
    <ImportResultDialog 
      v-model="importResultVisible" 
      :import-data="importResultData"
      @confirm="handleImportResultConfirm"
    />

    <!-- 物料表单组件 -->
    <BasItemForm
      v-model:visible="formDialogVisible"
      :dialog-type="dialogType"
      :edit-item-id="editItemId"
      :type-label-options="typeLabelOptions"
      :unit-options="unitOptions"
      :raw-material-inclass-options="rawMaterialInclassOptions"
      @refresh="getBasItemList"
    />

    <!-- 材料管理组件 -->
    <MaterialManagement
      v-model:visible="materialDialogVisible"
      :current-item="currentMaterialItem"
      :type-label-options="typeLabelOptions"
      @refresh="getBasItemList"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBasItems, deleteBasItem, importItemList } from '@/api/item/basitem'
import ImportResultDialog from './components/ImportResultDialog.vue'
import { baseURL } from '@/utils/request'

// 导入组件
import BasItemForm from './basitemform.vue'
import MaterialManagement from './materialmanagement.vue'

// 常量定义
const unitOptions = [
  '件', '套', '个', '块', '根', '袋', '箱', '捆', '托', '纸箱'
]

const typeLabelOptions = [
  { id: 10, value: '原材料' },
  { id: 20, value: '成品' },
  { id: 30, value:'半成品'},
  { id: 40, value: '低值易耗品' },
  { id: 50, value: '其他' },
]

const rawMaterialInclassOptions = [
  '钢材', '铝锭', '铝型材', '其它有色金属', '导线'
]

// 响应式数据
const queryParams = reactive({
  itemNo: '',
  itemName: '',
  type: '',
  inclass: '',
  pageNumber: 1,
  pageSize: 10
})

const basItemList = ref([])
const total = ref(0)
const loading = ref(false)

// 表单相关
const formDialogVisible = ref(false)
const dialogType = ref('add')
const editItemId = ref(null)

// 材料管理相关
const materialDialogVisible = ref(false)
const currentMaterialItem = ref({})

// 导入相关
const importResultVisible = ref(false)
const importResultData = ref({})

// 计算属性
const filteredInclassOptions = computed(() => {
  const selectedType = typeLabelOptions.find(option => option.id === queryParams.type)
  if (selectedType && selectedType.id === 10) {
    return rawMaterialInclassOptions
  }
  return selectedType ? [selectedType.value] : []
})

// 方法
const getFlagLabel = (type) => {
  const item = typeLabelOptions.find(option => option.id === type)
  return item ? item.value : '未知'
}

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

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getBasItemList()
}

const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getBasItemList()
}

const handleTypeChange = () => {
  const selectedType = typeLabelOptions.find(option => option.id === queryParams.type)
  if (selectedType && selectedType.id !== 10) {
    queryParams.inclass = selectedType.value
  } else {
    queryParams.inclass = ''
  }
}

const handleRefresh = () => {
  queryParams.itemNo = ''
  queryParams.itemName = ''
  queryParams.type = ''
  queryParams.inclass = ''
  queryParams.pageNumber = 1
  getBasItemList()
}

const handleAdd = () => {
  dialogType.value = 'add'
  editItemId.value = null
  formDialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  editItemId.value = row.id
  formDialogVisible.value = true
}

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

const handleMaterialManage = (row) => {
  currentMaterialItem.value = row
  materialDialogVisible.value = true
}

// 导入相关方法
const importItem = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xls,.xlsx'
  input.style.display = 'none'

  input.addEventListener('change', async (event) => {
    const file = event.target.files[0]
    if (!file) {
      ElMessage.error('未选择文件')
      return
    }

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/)) {
      ElMessage.error('请选择 Excel 文件 (.xls 或 .xlsx)')
      return
    }

    const formData = new FormData()
    formData.append('itemListFile', file)

    try {
      const res = await importItemList(formData)
      if (res.code === 200 && res.data) {
        showImportResultDialog(res.data)
        ElMessage.success(`文件导入完成，总计 ${res.data.totalRows} 条，成功 ${res.data.successCount} 条`)
      } else {
        ElMessage.error('导入失败：' + (res.msg || '未知错误'))
      }
    } catch (error) {
      console.error('导入错误', error)
      ElMessage.error('导入物料失败')
    } finally {
      document.body.removeChild(input)
    }
  })

  document.body.appendChild(input)
  input.click()
}

const showImportResultDialog = (data) => {
  importResultData.value = data
  importResultVisible.value = true
}

const handleImportResultConfirm = () => {
  getBasItemList()
}

const downloadExsl = () => {
  try {
    const url = `${baseURL}/xlsxTemplates/基础物料信息导入示例.xlsx`
    window.open(url, '_blank')
  } catch (error) {
    console.error('下载模板失败:', error)
    ElMessage({
      message: '下载模板失败，请检查网络或联系管理员',
      type: 'error',
      duration: 5 * 1000
    })
  }
}

// 生命周期
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