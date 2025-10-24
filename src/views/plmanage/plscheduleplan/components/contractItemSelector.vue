<template>
  <CustomDialog
    :visible="dialogVisible"
    title="合同物料选择器"
    width="80%"
    height="80vh"
    :close-on-click-modal="false"
    :is-full-screen="isFullscreen"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event"
    @close="handleClose"
  >
    <div class="contract-material-selector">
      <!-- 左右布局：物料列表 + 已选列表 -->
      <div class="content-section">
        <!-- 左侧：物料列表区域 -->
        <div class="material-section">
          <div class="list-header">
            <h3>物料列表</h3>
            <!-- 物料搜索框 -->
            <el-form :model="materialSearchForm" :inline="true" class="material-search">
              <el-form-item>
                <el-input
                  v-model="materialSearchForm.keyword"
                  placeholder="请输入物料编号或名称"
                  clearable
                  style="width: 200px"
                  @keyup.enter="searchMaterials"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchMaterials" :loading="materialLoading">
                  搜索
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-table
            ref="materialTableRef"
            :data="materialList"
            v-loading="materialLoading"
            style="width: 100%"
            height="500"
            @selection-change="handleSelectionChange"
            :row-key="getRowKey"
          >
            <el-table-column 
              type="selection" 
              width="55" 
              :selectable="checkSelectable"
              :reserve-selection="true"
            />
            <el-table-column prop="itemNo" label="物料编号" width="150" />
            <el-table-column prop="itemName" label="物料名称" width="150" show-overflow-tooltip />
            <el-table-column prop="itemSpec" label="规格型号" width="120" show-overflow-tooltip />
            <el-table-column prop="itemnum" label="数量" width="80" />
            <el-table-column prop="itemunit" label="单位" width="80" />
            <el-table-column label="状态" width="150" fixed="right">
              <template #default="scope">
                <div v-if="scope.row.scheduleCode" class="status-tag disabled">
                  已制定: {{ scope.row.scheduleCode }}
                </div>
                <div v-else class="status-tag available">
                  可选择
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- 物料列表分页 -->
          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="materialPagination.currentPage"
              v-model:page-size="materialPagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="materialPagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleMaterialSizeChange"
              @current-change="handleMaterialCurrentChange"
            />
          </div>
        </div>

        <!-- 右侧：已选物料列表 -->
        <div class="selected-section">
          <div class="list-header">
            <h3>已选物料 ({{ selectedMaterials.length }})</h3>
            <el-button 
              type="danger" 
              size="small" 
              @click="clearSelected" 
              :disabled="selectedMaterials.length === 0"
            >
              清空
            </el-button>
          </div>
          
          <div class="selected-list" :class="{ empty: selectedMaterials.length === 0 }">
            <div v-if="selectedMaterials.length === 0" class="empty-hint">
              <el-icon :size="48" color="#c0c4cc"><InfoFilled /></el-icon>
              <p>暂无选中的物料</p>
              <p class="sub-hint">请在左侧列表中选择物料</p>
            </div>
            <div v-else class="selected-items-container" :class="{ 'two-columns': selectedMaterials.length > 5 }">
              <div class="selected-item" v-for="item in selectedMaterials" :key="item.id">
                <div class="item-content">
                  <div class="item-main">
                    <span class="item-no">{{ item.itemNo }}</span>
                    <span class="material-name">{{ item.itemName }}</span>
                  </div>
                  <div class="item-extra">
                    <span class="item-spec">{{ item.itemSpec || '-' }}</span>
                    <span class="item-quantity">数量: {{ item.itemnum }} {{ item.itemunit }}</span>
                  </div>
                </div>
                <el-button 
                  icon="Delete" 
                  size="small" 
                  circle 
                  type="danger"
                  text
                  class="delete-btn"
                  @click="removeMaterial(item)"
                  title="移除"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button 
          type="primary" 
          @click="confirmSelection" 
          :disabled="selectedMaterials.length === 0"
        >
          确认选择 ({{ selectedMaterials.length }})
        </el-button>
      </div>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import CustomDialog from '@/components/common/CustomDialog.vue'
import { getContractItemPage } from '@/api/contract/bascontract'

/**
 * CustomDialog vs el-dialog 核心区别：
 * 1. 绑定方式：:visible="dialogVisible" @update:visible="dialogVisible = $event" （不用 v-model）
 * 2. 全屏控制：:is-full-screen="isFullscreen" @update:is-full-screen="isFullscreen = $event" （不是 fullscreen）
 * 3. 关闭回调：@close="handleClose" （不是 :before-close）
 */

// 组件属性定义
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  contractNo: {
    type: String,
    required: true,
    default: ''
  }
})

// 事件定义
const emit = defineEmits(['update:visible', 'select'])

// 对话框显示控制
const dialogVisible = ref(props.visible)
const isFullscreen = ref(true)

// 表格引用
const materialTableRef = ref(null)

// 监听props.visible的变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal && props.contractNo) {
    resetMaterialData()
    loadMaterialList()
  } else if (newVal && !props.contractNo) {
    ElMessage.error('请传入合同编号')
    handleClose()
  }
})

// 监听contractNo变化，重新加载物料
watch(() => props.contractNo, (newVal) => {
  if (newVal && dialogVisible.value) {
    resetMaterialData()
    loadMaterialList()
  }
})

// 监听dialogVisible的变化，同步给父组件
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
})

// 物料搜索表单
const materialSearchForm = reactive({
  keyword: ''
})

// 物料列表数据
const materialList = ref([])
const materialLoading = ref(false)
const materialPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 已选物料列表
const selectedMaterials = ref([])

// 获取行的唯一key
const getRowKey = (row) => {
  return row.id
}

// 检查行是否可选择
const checkSelectable = (row) => {
  // 已制定计划的物料不可选择
  return !row.scheduleCode
}

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  // 过滤掉已制定计划的物料
  const validSelection = selection.filter(item => !item.scheduleCode)
  
  // 获取当前页所有可选物料的ID
  const currentPageIds = materialList.value
    .filter(item => !item.scheduleCode)
    .map(item => item.id)
  
  // 移除当前页已取消选择的物料
  selectedMaterials.value = selectedMaterials.value.filter(
    item => !currentPageIds.includes(item.id)
  )
  
  // 添加当前页新选中的物料（避免重复）
  validSelection.forEach(item => {
    if (!selectedMaterials.value.some(selected => selected.id === item.id)) {
      selectedMaterials.value.push(item)
    }
  })
}

// 搜索物料
const searchMaterials = () => {
  materialPagination.currentPage = 1
  loadMaterialList()
}

// 加载物料列表
const loadMaterialList = async () => {
  if (!props.contractNo) return
  
  materialLoading.value = true
  try {
    const params = {
      pageNumber: materialPagination.currentPage,
      pageSize: materialPagination.pageSize,
      contractNo: props.contractNo,
      itemName: materialSearchForm.keyword
    }
    
    const response = await getContractItemPage(params)
    if (response.success) {
      const itemData = response.data.itemList
      materialList.value = itemData.list || []
      materialPagination.total = itemData.totalRow || 0
      
      // 等待DOM更新后，恢复表格选中状态
      await nextTick()
      restoreTableSelection()
    } else {
      ElMessage.error(response.msg || '加载物料列表失败')
    }
  } catch (error) {
    console.error('加载物料列表失败:', error)
    ElMessage.error('加载物料列表失败')
  } finally {
    materialLoading.value = false
  }
}

// 恢复表格选中状态
const restoreTableSelection = () => {
  if (!materialTableRef.value) return
  
  // 清空当前选中
  materialTableRef.value.clearSelection()
  
  // 根据selectedMaterials恢复选中状态
  materialList.value.forEach(row => {
    const isSelected = selectedMaterials.value.some(item => item.id === row.id)
    if (isSelected && !row.scheduleCode) {
      materialTableRef.value.toggleRowSelection(row, true)
    }
  })
}

// 从已选列表移除物料
const removeMaterial = (item) => {
  // 从已选列表中删除
  selectedMaterials.value = selectedMaterials.value.filter(m => m.id !== item.id)
  
  // 同步表格选择状态
  if (materialTableRef.value) {
    const tableRow = materialList.value.find(row => row.id === item.id)
    if (tableRow) {
      materialTableRef.value.toggleRowSelection(tableRow, false)
    }
  }
}

// 清空已选列表
const clearSelected = () => {
  selectedMaterials.value = []
  // 清空表格选择状态
  if (materialTableRef.value) {
    materialTableRef.value.clearSelection()
  }
}

// 确认选择
const confirmSelection = () => {
  if (selectedMaterials.value.length === 0) {
    ElMessage.warning('请至少选择一个物料')
    return
  }
  emit('select', [...selectedMaterials.value])
  ElMessage.success(`成功选择 ${selectedMaterials.value.length} 个物料`)
  handleClose()
}

// 物料列表分页处理
const handleMaterialSizeChange = (size) => {
  materialPagination.pageSize = size
  materialPagination.currentPage = 1
  loadMaterialList()
}

const handleMaterialCurrentChange = (page) => {
  materialPagination.currentPage = page
  loadMaterialList()
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  resetMaterialData()
}

// 重置物料数据
const resetMaterialData = () => {
  materialSearchForm.keyword = ''
  materialList.value = []
  selectedMaterials.value = []
  materialPagination.currentPage = 1
  materialPagination.total = 0
  if (materialTableRef.value) {
    materialTableRef.value.clearSelection()
  }
}
</script>

<style scoped>
.contract-material-selector {
  padding: 20px;
}

.content-section {
  display: flex;
  gap: 20px;
  height: 625px;
  align-items: stretch;
}

.material-section {
  flex: 2;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.selected-section {
  flex: 2;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  min-width: 300px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409eff;
}

.list-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.material-search {
  margin: 0;
}

.pagination-wrapper {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

/* 已选列表样式 */
.selected-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f8f9fa;
  height: 500px;
}

.selected-list::-webkit-scrollbar {
  width: 6px;
}

.selected-list::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.selected-list::-webkit-scrollbar-thumb:hover {
  background-color: #c0c4cc;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.empty-hint {
  text-align: center;
  color: #909399;
}

.empty-hint p {
  margin: 10px 0 5px;
  font-size: 14px;
}

.empty-hint .sub-hint {
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 0;
}

.selected-items-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-items-container.two-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.selected-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  transition: all 0.2s;
  min-height: 80px;
}

.selected-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
  transform: translateY(-1px);
}

.item-content {
  flex: 1;
  overflow: hidden;
  margin-right: 10px;
}

.item-main {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.item-no {
  display: inline-block;
  padding: 2px 8px;
  background-color: #ecf5ff;
  color: #409eff;
  font-size: 12px;
  border-radius: 3px;
  font-weight: 500;
  white-space: nowrap;
}

.material-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-extra {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

.item-spec,
.item-quantity {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-btn {
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.selected-item:hover .delete-btn {
  opacity: 1;
}

/* 状态标签样式 */
.status-tag {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
  font-weight: 500;
}

.status-tag.available {
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
}

.status-tag.disabled {
  background-color: #f4f4f5;
  color: #909399;
  border: 1px solid #e9e9eb;
}

/* 底部按钮区域 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .selected-items-container.two-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1200px) {
  .content-section {
    flex-direction: column;
    height: auto;
  }
  
  .material-section,
  .selected-section {
    min-height: 400px;
  }
  
  .selected-section {
    min-width: auto;
  }
  
  .selected-items-container.two-columns {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .selected-items-container.two-columns {
    grid-template-columns: 1fr;
  }
}

/* Element Plus 表格禁用行样式 */
:deep(.el-table__body tr.el-table__row--striped.is-disabled) {
  background-color: #f5f7fa;
}

:deep(.el-table__body tr.is-disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>