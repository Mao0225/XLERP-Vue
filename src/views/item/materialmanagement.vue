<!-- MaterialManagement.vue -->
<template>
  <el-dialog
    title="物料材料管理"
    v-model="materialDialogVisible"
    width="90%"
    @closed="handleMaterialDialogClosed"
  >
    <div class="material-management">
      <div class="material-header">
        <h3>当前物料: {{ currentMaterialItem.no }} - {{ currentMaterialItem.name }}</h3>
        <div class="material-actions">
          <el-button :type="activeView === 'list' ? 'primary' : 'default'" @click="activeView = 'list'">列表视图</el-button>
          <el-button :type="activeView === 'tree' ? 'primary' : 'default'" @click="activeView = 'tree'">树状图视图</el-button>
          <el-button type="success" @click="handleAddChildMaterial">添加子物料</el-button>
          <el-button type="warning" @click="refreshMaterialList">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </div>

      <!-- 子物料列表 -->
      <div class="material-list-view">
        <el-table :data="childMaterialList" border v-loading="materialLoading" style="width: 100%">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="no" label="子项编码" />
          <el-table-column prop="name" label="子项名称" />
          <el-table-column prop="spec" label="规格型号" />
          <el-table-column prop="unit" label="计量单位" />
          <el-table-column prop="relation_quantity" label="数量">
            <template #default="{ row }">
              <el-input 
                v-model.number="row.relation_quantity" 
                type="number" 
                min="0.0001" 
                step="0.0001"
                @change="handleQuantityChange(row)"
                style="width: 100px"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="物料类型" width="120">
            <template #default="{ row }">
              {{ getFlagLabel(row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="inclass" label="所属分类" />
          <el-table-column prop="weight" label="重量" />
          <el-table-column prop="planned_price" label="计划价格" />
          <el-table-column prop="avg_price" label="平均价格" />
          <el-table-column prop="memo" label="备注">
            <template #default="{ row }">
              <el-input 
                v-model="row.memo" 
                placeholder="请输入备注"
                @change="handleMemoChange(row)"
                style="width: 150px"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button type="danger" size="small" @click="handleRemoveChildMaterial(row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 树状图视图 -->
      <div class="material-tree-view" v-if="activeView === 'tree'">
        <el-tree
          :data="materialTreeData"
          :props="treeProps"
          node-key="id"
          default-expand-all
          v-loading="treeLoading"
        >
          <template #default="{ node, data }">
            <span class="tree-node-content">
              <span class="node-main-info">
                <span style="font-weight: bold;">{{ data.no }} - {{ data.name }}</span>
                <span v-if="data.spec" style="margin-left: 8px; color: #666;">({{ data.spec }})</span>
              </span>
              <span class="node-attributes">
                <el-tag v-if="data.isRoot" type="primary" size="small">当前物料</el-tag>
                <el-tag size="small" type="success">数量: {{ data.quantity || data.relation_quantity || 1 }}</el-tag>
                <span v-if="data.unit" style="margin-left: 10px; color: #666;">单位: {{ data.unit }}</span>
                <span v-if="data.memo" style="margin-left: 10px; color: #666;">备注: {{ data.memo }}</span>
              </span>
            </span>
          </template>
        </el-tree>
      </div>

      <div v-if="activeView === 'tree'" class="calculation-info">
        <p>说明：请在列表视图中编辑数量和备注，树状图视图会自动同步更新</p>
      </div>

      <div class="pagination-container" v-if="childMaterialTotal > 0">
        <el-pagination
          v-model:current-page="materialQueryParams.pageNumber"
          v-model:page-size="materialQueryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="childMaterialTotal"
          @size-change="handleMaterialSizeChange"
          @current-change="handleMaterialCurrentChange"
        />
      </div>
    </div>
  </el-dialog>

  <!-- 选择子物料对话框 -->
  <el-dialog
    title="选择子物料"
    v-model="selectChildMaterialDialogVisible"
    width="80%"
    @closed="resetSelectChildMaterialForm"
  >
    <div class="search-bar">
      <el-input 
        v-model="selectChildMaterialQueryParams.itemNo" 
        placeholder="按物料编号搜索" 
        style="width: 200px; margin-right: 10px;"
        clearable
        @clear="handleSelectChildMaterialSearch"
        @keyup.enter="handleSelectChildMaterialSearch"
      ></el-input>
      <el-input 
        v-model="selectChildMaterialQueryParams.itemName" 
        placeholder="按物料名称搜索" 
        style="width: 200px; margin-right: 10px;"
        clearable
        @clear="handleSelectChildMaterialSearch"
        @keyup.enter="handleSelectChildMaterialSearch"
      ></el-input>
      <el-button type="primary" @click="handleSelectChildMaterialSearch">搜索</el-button>
      <el-button type="warning" @click="handleSelectChildMaterialRefresh">
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>
    </div>
    
    <el-table :data="allMaterialsList" border v-loading="selectChildMaterialLoading" style="width: 100%" :key="searchKey" >
      <el-table-column prop="no" label="物料编号" />
      <el-table-column prop="name" label="物料名称" />
      <el-table-column prop="spec" label="规格型号" />
      <el-table-column prop="inclass" label="所属分类" />
      <el-table-column prop="type" label="物料类型" width="120">
        <template #default="{ row }">
          {{ getFlagLabel(row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" />
      <el-table-column prop="weight" label="重量" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="selectChildMaterial(row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="selectChildMaterialQueryParams.pageNumber"
        v-model:page-size="selectChildMaterialQueryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="selectChildMaterialTotal"
        @size-change="handleSelectChildMaterialSizeChange"
        @current-change="handleSelectChildMaterialCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, defineProps, defineEmits } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMaterialTree, getChildMaterials, addMaterialRelation, removeMaterialRelation, getAllMaterialsPage, updateMaterialRelation } from '@/api/item/basitem'

const props = defineProps({
  visible: Boolean,
  currentItem: Object,
  typeLabelOptions: Array
})

const emit = defineEmits(['update:visible', 'refresh'])

// 响应式数据
const materialDialogVisible = ref(false)
const activeView = ref('list')
const currentMaterialItem = ref({})
const childMaterialList = ref([])
const childMaterialTotal = ref(0)
const materialLoading = ref(false)
const materialTreeData = ref([])
const treeLoading = ref(false)
const searchKey = ref(0)

const treeProps = {
  label: 'name',
  children: 'children'
}

// 材料管理查询参数
const materialQueryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  itemId: 0
})

// 选择子物料对话框相关
const selectChildMaterialDialogVisible = ref(false)
const selectChildMaterialQueryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  itemNo: '',
  itemName: ''
})
const allMaterialsList = ref([])
const selectChildMaterialTotal = ref(0)
const selectChildMaterialLoading = ref(false)

// 监听父组件传递的 visible 属性
watch(() => props.visible, (newVal) => {
  materialDialogVisible.value = newVal
  if (newVal) {
    currentMaterialItem.value = props.currentItem
    activeView.value = 'list'
    materialQueryParams.pageNumber = 1
    refreshMaterialList(true)
  }
})

// 监听对话框可见性变化
watch(() => materialDialogVisible.value, (newVal) => {
  emit('update:visible', newVal)
})

// 获取物料类型标签
const getFlagLabel = (type) => {
  const item = props.typeLabelOptions.find(option => option.id === type)
  return item ? item.value : '未知'
}

// 刷新材料列表
const refreshMaterialList = async (forceRefreshAll = false) => {
  materialLoading.value = true
  try {
    const res = await getChildMaterials({ 
      id: currentMaterialItem.value.id,
      pageNumber: materialQueryParams.pageNumber,
      pageSize: materialQueryParams.pageSize
    })
    
    if (res.code === 200 && res.data && res.data.page) {
      childMaterialList.value = res.data.page.list || []
      childMaterialTotal.value = res.data.page.totalRow || 0
    } else {
      childMaterialList.value = []
      childMaterialTotal.value = 0
      ElMessage.error('获取数据失败: ' + (res.msg || '响应格式错误'))
    }
    
    if (forceRefreshAll) {
      await loadMaterialTree()
    }
    
  } catch (error) {
    console.error('获取子物料列表失败', error)
    ElMessage.error('获取子物料列表失败: ' + (error.message || '网络错误'))
    childMaterialList.value = []
    childMaterialTotal.value = 0
  } finally {
    materialLoading.value = false
  }
}

// 加载树状图数据
const loadMaterialTree = async () => {
  treeLoading.value = true
  try {
    const res = await getMaterialTree({ id: currentMaterialItem.value.id })
    
    if (res.data && res.data.materialTree) {
      materialTreeData.value = res.data.materialTree
    } else {
      materialTreeData.value = []
    }
    
  } catch (error) {
    console.error('获取物料树形结构失败', error)
    ElMessage.error('获取物料树形结构失败: ' + (error.message || '网络错误'))
    materialTreeData.value = []
  } finally {
    treeLoading.value = false
  }
}

// 同步列表数据到树状图
const syncListDataToTree = () => {
  if (!materialTreeData.value || materialTreeData.value.length === 0) return
  
  const listDataMap = new Map()
  childMaterialList.value.forEach(item => {
    if (item.relation_id) {
      listDataMap.set(item.relation_id, {
        relation_quantity: item.relation_quantity,
        memo: item.memo
      })
    }
  })
  
  const updateTreeNode = (nodes) => {
    if (!nodes || !Array.isArray(nodes)) return
    
    nodes.forEach(node => {
      if (node.relation_id && listDataMap.has(node.relation_id)) {
        const listData = listDataMap.get(node.relation_id)
        node.relation_quantity = listData.relation_quantity
        node.memo = listData.memo
      }
      
      if (node.children && node.children.length > 0) {
        updateTreeNode(node.children)
      }
    })
  }
  
  updateTreeNode(materialTreeData.value)
  materialTreeData.value = [...materialTreeData.value]
}

// 监听视图切换
watch(
  () => activeView.value,
  (newVal) => {
    if (materialDialogVisible.value) {
      if (newVal === 'tree') {
        if (!materialTreeData.value || materialTreeData.value.length === 0) {
          loadMaterialTree()
        } else {
          syncListDataToTree()
        }
      }
    }
  }
)

// 材料管理分页处理
const handleMaterialSizeChange = (size) => {
  materialQueryParams.pageSize = size
  refreshMaterialList()
}

const handleMaterialCurrentChange = (page) => {
  materialQueryParams.pageNumber = page
  refreshMaterialList()
}

// 材料管理对话框关闭
const handleMaterialDialogClosed = () => {
  currentMaterialItem.value = {}
  childMaterialList.value = []
  childMaterialTotal.value = 0
  materialTreeData.value = []
  materialQueryParams.pageNumber = 1
  activeView.value = 'list'
  
  selectChildMaterialQueryParams.pageNumber = 1
  selectChildMaterialQueryParams.itemNo = ''
  selectChildMaterialQueryParams.itemName = ''
}

// 添加子物料
const handleAddChildMaterial = () => {
  selectChildMaterialDialogVisible.value = true
  selectChildMaterialQueryParams.itemNo = ''
  selectChildMaterialQueryParams.itemName = ''
  selectChildMaterialQueryParams.pageNumber = 1
  getAllMaterialsList()
}

// 选择子物料搜索
const handleSelectChildMaterialSearch = () => {
  selectChildMaterialQueryParams.pageNumber = 1
  searchKey.value++
  getAllMaterialsList()
}

// 选择子物料刷新
const handleSelectChildMaterialRefresh = () => {
  selectChildMaterialQueryParams.itemNo = ''
  selectChildMaterialQueryParams.itemName = ''
  selectChildMaterialQueryParams.pageNumber = 1
  getAllMaterialsList()
}

// 获取所有物料列表
const getAllMaterialsList = async () => {
  selectChildMaterialLoading.value = true
  try {
    const res = await getAllMaterialsPage(selectChildMaterialQueryParams)
    if (res.data && res.data.page) {
      allMaterialsList.value = res.data.page.list || []
      selectChildMaterialTotal.value = res.data.page.totalRow || 0
    } else {
      allMaterialsList.value = []
      selectChildMaterialTotal.value = 0
      ElMessage.warning('未获取到有效数据')
    }
  } catch (error) {
    console.error('获取物料列表失败', error)
    ElMessage.error('获取物料列表失败: ' + (error.message || '网络错误'))
    allMaterialsList.value = []
    selectChildMaterialTotal.value = 0
  } finally {
    selectChildMaterialLoading.value = false
  }
}

// 选择子物料分页处理
const handleSelectChildMaterialSizeChange = (size) => {
  selectChildMaterialQueryParams.pageSize = size
  selectChildMaterialQueryParams.pageNumber = 1
  getAllMaterialsList()
}

const handleSelectChildMaterialCurrentChange = (page) => {
  selectChildMaterialQueryParams.pageNumber = page
  getAllMaterialsList()
}

// 选择子物料
const selectChildMaterial = async (row) => {
  try {
    if (!currentMaterialItem.value || !currentMaterialItem.value.id) {
      ElMessage.error('未获取到当前物料信息，请刷新页面重试')
      return
    }
    
    if (!row || !row.id) {
      ElMessage.error('未选择有效的子物料，请重新选择')
      return
    }

    if (row.id === currentMaterialItem.value.id) {
      ElMessage.error('不能选择自身作为子物料')
      return
    }

    const isAlreadyChild = childMaterialList.value.some(item => item.id === row.id)
    if (isAlreadyChild) {
      ElMessage.error('该物料已经是子物料')
      return
    }

    const parentId = Number(currentMaterialItem.value.id)
    const childId = Number(row.id)
    
    if (isNaN(parentId) || isNaN(childId)) {
      ElMessage.error('物料ID格式错误，必须是数字')
      return
    }

    const relationData = {
      parentItemId: parentId,
      childItemId: childId,
      relation_quantity: 1, 
      memo: ''
    }

    await addMaterialRelation(relationData)
    ElMessage.success('添加子物料成功')
    selectChildMaterialDialogVisible.value = false
    
    await refreshMaterialList(true)
  } catch (error) {
    console.error('添加子物料失败', error)
    ElMessage.error('添加子物料失败: ' + (error.response?.data?.msg || error.message))
  }
}

// 处理数量变化
const handleQuantityChange = async (row) => {
  if (row.relation_quantity <= 0) {
    ElMessage.error('数量必须大于0')
    row.relation_quantity = 1
    return
  }
  
  try {
    const response = await updateMaterialRelation({
      relationId: row.relation_id,
      quantity: row.relation_quantity,
      memo: row.memo || ''
    })
    
    if (response.code === 200) {
      ElMessage.success('数量更新成功')
      
      const updatedItem = childMaterialList.value.find(item => item.relation_id === row.relation_id)
      if (updatedItem) {
        updatedItem.relation_quantity = row.relation_quantity
      }
      
      await loadMaterialTree()
    } else {
      ElMessage.error(`更新失败: ${response.msg || response.message || '更新失败'}`)
      await refreshMaterialList(true)
    }
    
  } catch (error) {
    console.error('更新数量失败', error)
    ElMessage.error('更新数量失败: ' + (error.message || '未知错误'))
    await refreshMaterialList(true)
  }
}

// 处理备注变化
const handleMemoChange = async (row) => {
  try {
    const response = await updateMaterialRelation({
      relationId: row.relation_id,
      quantity: row.relation_quantity,
      memo: row.memo || ''
    })
    
    if (response.code === 200) {
      ElMessage.success('备注更新成功')
      
      const updatedItem = childMaterialList.value.find(item => item.relation_id === row.relation_id)
      if (updatedItem) {
        updatedItem.memo = row.memo
      }
      
      syncListDataToTree()
    } else {
      ElMessage.error('更新失败: ' + (response.msg || '未知错误'))
      await refreshMaterialList(true)
    }
    
  } catch (error) {
    console.error('更新备注失败', error)
    ElMessage.error('更新备注失败: ' + (error.message || '未知错误'))
    await refreshMaterialList(true)
  }
}

// 移除子物料
const handleRemoveChildMaterial = (row) => {
  ElMessageBox.confirm(`确认移除子物料"${row.no}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await removeMaterialRelation({ relationId: row.relation_id })
      ElMessage.success('移除子物料成功')
      await refreshMaterialList(true)
    } catch (error) {
      console.error('移除子物料失败', error)
      ElMessage.error('移除子物料失败')
    }
  }).catch(() => {})
}

// 重置选择子物料表单
const resetSelectChildMaterialForm = () => {
  selectChildMaterialQueryParams.pageNumber = 1
  selectChildMaterialQueryParams.itemNo = ''
  selectChildMaterialQueryParams.itemName = ''
}
</script>

<style scoped>
.material-management {
  max-height: 70vh;
  overflow: auto;
}

.material-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.material-header h3 {
  margin: 0;
  color: #409eff;
}

.material-actions {
  display: flex;
  gap: 10px;
}

.material-list-view {
  margin-top: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.search-bar .el-input {
  margin-right: 10px;
}

.material-tree-view {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  max-height: 60vh;
  overflow: auto;
}

.tree-node-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 6px 0;
}

.node-main-info {
  display: flex;
  align-items: center;
}

.node-attributes {
  display: flex;
  align-items: center;
  gap: 8px;
}

.calculation-info {
  margin-top: 15px;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 4px;
  font-size: 12px;
  color: #409eff;
  border: 1px solid #d1ecf1;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>