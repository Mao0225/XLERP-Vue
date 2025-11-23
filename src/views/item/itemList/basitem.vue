<template>
  <div class="basitem-management">
    <!-- 操作栏（联动版分类筛选） -->
    <div class="action-bar">
      <el-select 
        v-model="queryParams.firstClassId" 
        placeholder="请选择一级分类" 
        style="width: 180px; margin-right: 10px;"
        clearable
        @change="handleFirstClassChange" 
        @clear="handleFirstClassClear"
      >
        <el-option 
          v-for="item in firstClassOptions" 
          :key="item.id" 
          :label="item.classname" 
          :value="item.id"
        />
      </el-select>
      <el-select 
        v-model="queryParams.secondClassId" 
        placeholder="请选择二级分类" 
        style="width: 180px; margin-right: 10px;"
        clearable
        @change="getBasItemList"
        :disabled="!queryParams.firstClassId"
      >
        <el-option 
          v-for="item in filteredSecondClassOptions"
          :key="item.id" 
          :label="item.classname" 
          :value="item.id"
        />
      </el-select>
      <el-input v-model="queryParams.itemNo" placeholder="请输入物料编号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasItemList" @keyup.enter="getBasItemList" />
      <el-input v-model="queryParams.itemName" placeholder="请输入物料名称查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasItemList" @keyup.enter="getBasItemList" />
              <el-input v-model="queryParams.spec" placeholder="请输入规格型号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasItemList" @keyup.enter="getBasItemList" />
      <el-button type="primary" @click="getBasItemList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增物料</el-button>
      <!-- <el-button type="primary" @click="importItem" >导入物料</el-button>
      <el-button type="info" @click="downloadExsl">下载模板</el-button> -->
    </div>

    <!-- 物料列表（调整字段顺序，空值显示"-"） -->
    <el-table :data="basItemList" border v-loading="loading" style="width: 100%" cell-class-name="table-cell">
      <el-table-column label="序号" width="60">
        <template #default="scope">
          {{ (queryParams.pageNumber - 1) * queryParams.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <!-- 必填项前置（物料编号、名称、分类、单位、规格、材质、执行标准） -->
      <el-table-column prop="no" width="120" show-overflow-tooltip label="物料编号" />
      <el-table-column prop="name" width="120" show-overflow-tooltip label="物料名称" />
      <el-table-column prop="inclass" width="250" show-overflow-tooltip label="所属分类" />
      <el-table-column prop="unit" width="80" show-overflow-tooltip label="单位" />
      <el-table-column prop="spec" width="120" show-overflow-tooltip label="规格型号" />
      <el-table-column prop="material" width="100" show-overflow-tooltip label="材质">
        <template #default="scope">{{ scope.row.material || '-' }}</template>
      </el-table-column>
      <el-table-column prop="standard" width="150" show-overflow-tooltip label="执行标准">
        <template #default="scope">{{ scope.row.standard || '-' }}</template>
      </el-table-column>
      <!-- 补充字段（按原有逻辑排序） -->
      <el-table-column prop="tuzhiNo" width="120" show-overflow-tooltip label="图号">
        <template #default="scope">{{ scope.row.tuzhiNo || '-' }}</template>
      </el-table-column>
            <el-table-column prop="grade" width="80" show-overflow-tooltip label="等级">
        <template #default="scope">{{ scope.row.grade || '-' }}</template>
      </el-table-column>
      <el-table-column prop="tech_memo" width="150" show-overflow-tooltip label="技术备注">
        <template #default="scope">{{ scope.row.tech_memo || '-' }}</template>
      </el-table-column>
      <el-table-column prop="description" width="150" show-overflow-tooltip label="物料描述">
        <template #default="scope">{{ scope.row.description || '-' }}</template>
      </el-table-column>
      <el-table-column prop="color" width="80" show-overflow-tooltip label="颜色">
        <template #default="scope">{{ scope.row.color || '-' }}</template>
      </el-table-column>
      <el-table-column prop="location" width="120" show-overflow-tooltip label="存放位置">
        <template #default="scope">{{ scope.row.location || '-' }}</template>
      </el-table-column>

      <el-table-column prop="material_version" width="100" show-overflow-tooltip label="物料版本">
        <template #default="scope">{{ scope.row.material_version || '-' }}</template>
      </el-table-column>
      <el-table-column prop="memo" width="100" show-overflow-tooltip label="备注">
        <template #default="scope">{{ scope.row.memo || '-' }}</template>
      </el-table-column>

      <el-table-column label="操作" width="230" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.inclass.includes('成品')" type="success" size="small" @click="handleMaterialManage(row)">材料管理</el-button>
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页（不变） -->
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

    <!-- 原有弹窗组件（不变） -->
    <ImportResultDialog 
      v-model="importResultVisible" 
      :import-data="importResultData"
      @confirm="handleImportResultConfirm"
    />
    <AddForm
      v-model="addFormVisible"
      :unit-options="unitOptions"
      @success="handleSuccess"
    />
    <EditForm
      v-model="editFormVisible"
      :unit-options="unitOptions"
      :initial-data="selectedRows"
      @success="handleSuccess"
    />

    <!-- 物料分解弹窗组件 -->
    <MaterialDecomposeDialog
      v-model:visible="DecomposeDialogVisible"
      :itemId="currentItemId"
      @close="DecomposeDialogVisible=false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBasItems, deleteBasItem, importItemList } from '@/api/item/basitem'
import { getBasItemClassTreeList } from '@/api/item/basitemclass'
import ImportResultDialog from '../components/ImportResultDialog.vue'
import { baseURL } from '@/utils/request'
import AddForm from './add.vue'
import EditForm  from './edit.vue'
import MaterialDecomposeDialog from './MaterialDecomposeDialog.vue'
import { Refresh } from '@element-plus/icons-vue'

// 常量定义（不变）
const unitOptions = [
  '件', '套', '个', '块', '根', '袋', '箱', '捆', '托', '纸箱'
]

// 响应式数据
const queryParams = reactive({
  itemNo: '',
  itemName: '',
  spec: '',
  firstClassId: '', // 一级分类ID
  secondClassId: '', // 二级分类ID
  pageNumber: 1,
  pageSize: 10
})

const basItemList = ref([])
const total = ref(0)
const loading = ref(false)
const firstClassOptions = ref([]) // 所有一级分类
const allSecondClassOptions = ref([]) // 所有二级分类（含父级ID）

// 计算属性：根据选中的一级分类，过滤对应的二级分类
const filteredSecondClassOptions = computed(() => {
  if (!queryParams.firstClassId) return []
  // 只返回父级ID等于当前一级分类ID的二级分类
  return allSecondClassOptions.value.filter(item => item.parentId === queryParams.firstClassId)
})

// 表单相关（不变）
const addFormVisible = ref(false)
const editFormVisible = ref(false)
const selectedRows = ref([])
const importResultVisible = ref(false)
const importResultData = ref({})
const DecomposeDialogVisible = ref(false)
const currentItemId = ref(null)

// 加载分类树：保存一级分类和「带父级ID的二级分类」
const loadClassOptions = async () => {
  try {
    const res = await getBasItemClassTreeList('')
    const classTree = res.data.list || []
    const firstClass = []
    const secondClass = []

    // 递归遍历，保存一级分类和带父级ID的二级分类
    const traverseTree = (tree, parentId = 0) => {
      tree.forEach(node => {
        const { itemClass } = node
        if (itemClass.type === 1) {
          // 一级分类（父级ID为0）
          firstClass.push({ id: itemClass.id, classname: itemClass.classname })
          // 递归处理该一级分类的子节点（找二级分类）
          if (node.children && node.children.length) {
            traverseTree(node.children, itemClass.id)
          }
        } else if (itemClass.type === 2) {
          // 二级分类（保存父级ID，即所属一级分类ID）
          secondClass.push({ 
            id: itemClass.id, 
            classname: itemClass.classname,
            parentId: parentId // 关键：关联父级一级分类ID
          })
          // 递归处理子节点（不影响，二级分类的子节点是三级）
          if (node.children && node.children.length) {
            traverseTree(node.children, itemClass.id)
          }
        }
      })
    }

    traverseTree(classTree)
    firstClassOptions.value = firstClass
    allSecondClassOptions.value = secondClass
  } catch (error) {
    console.error('加载分类选项失败', error)
    ElMessage.error('加载分类筛选选项失败')
  }
}

// 一级分类变化时的处理：清空二级分类并刷新列表
const handleFirstClassChange = () => {
  queryParams.secondClassId = '' // 清空之前选中的二级分类
  getBasItemList() // 刷新列表（仅按一级分类筛选）
}

// 清空一级分类时的处理：清空二级分类并刷新列表
const handleFirstClassClear = () => {
  queryParams.secondClassId = ''
  getBasItemList()
}

// 获取物料列表（不变，携带联动后的筛选参数）
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

// 原有方法（不变）
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getBasItemList()
}
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getBasItemList()
}
const handleRefresh = () => {
  queryParams.itemNo = ''
  queryParams.itemName = ''
  queryParams.spec = ''
  queryParams.firstClassId = ''
  queryParams.secondClassId = ''
  queryParams.pageNumber = 1
  getBasItemList()
}
const handleAdd = () => {
  addFormVisible.value = true
}
const handleEdit = (row) => {
  selectedRows.value = row
  editFormVisible.value = true
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
  currentItemId.value = row.id
  DecomposeDialogVisible.value = true
}
const handleSuccess = () => {
  ElMessage.success('操作成功')
  addFormVisible.value = false
  editFormVisible.value = false
  DecomposeDialogVisible.value = false
  getBasItemList()
}

// 导入相关方法（不变）
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

// 生命周期（不变）
onMounted(() => {
  loadClassOptions()
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
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
/* 表格空值"-"样式优化：灰色、居中 */
.table-cell .el-table__cell-content {
  color: #666;
}
.table-cell .el-table__cell-content:empty::after,
.table-cell .el-table__cell-content:contains("-") {
  color: #999;
  font-style: normal;
}
/* 调整表格列宽适配，避免文字溢出 */
.el-table {
  font-size: 14px;
}
.el-table-column {
  overflow: hidden;
}
@media (max-width: 1200px) {
  .action-bar > * {
    margin-right: 0 !important;
  }
  /* 小屏幕下隐藏部分非关键列，优先显示必填项 */
  .el-table-column[width="150"],
  .el-table-column[width="120"]:not(.el-table__fixed-right) {
    display: none !important;
  }
}
</style>