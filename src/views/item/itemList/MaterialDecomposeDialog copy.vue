<template>
  <el-dialog
    v-model="isVisible"
    title="物料分解关系管理"
    width="70%"
    :fullscreen="false"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 操作栏：刷新 + 添加材料 -->
    <div class="action-bar">
      <el-button 
        type="warning" 
        @click="fetchMaterialTree"
        :loading="loading"
      >
        <RefreshCw class="icon" />
        刷新
      </el-button>

      <el-button 
        type="primary" 
        @click="openAddMaterial"
      >
        添加材料
      </el-button>
    </div>

    <!-- 加载状态 -->
    <el-loading v-if="loading" target=".content" text="加载中..." />

    <!-- 内容区域：上半部分列表（已有+待添加），下半部分树状图 -->
    <div class="content">
      <!-- 列表视图：已有子物料 + 待添加子物料 -->
      <div class="list-container">
        <h3 class="section-title">第一级子物料（可编辑用量）</h3>
        
        <!-- 待添加的物料列表（临时） -->
        <el-table
          v-if="pendingMaterials.length > 0"
          :data="pendingMaterials"
          border
          stripe
          class="list-view pending-list"
          :header-cell-style="{ 'background-color': '#f5fafe' }"
        >
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="物料编号" prop="no" width="120" />
          <el-table-column label="物料名称" prop="name" width="180" />
          <el-table-column label="规格型号" prop="spec" width="150" />
          <el-table-column label="计量单位" prop="unit" width="100" />
          <el-table-column label="所属分类" prop="inclass" width="150" />
          <el-table-column label="技术备注" width="100" prop="tech_memo" show-overflow-tooltip />
          <el-table-column label="物料描述" width="100" prop="description" show-overflow-tooltip />
          <el-table-column label="用量" width="180">
            <template #default="{ row }">
              <el-input-number
                v-model.number="row.relationQuantity"
                :min="1"
                :step="1"
                size="small"
                style="width: 120px;"
                @change="handleQuantityChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row, $index }">
              <el-button
                type="success"
                size="small"
                @click="handleAddPendingMaterial(row, $index)"
                :disabled="!row.relationQuantity"
              >
                确认添加
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="removePendingMaterial($index)"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 已有子物料列表 -->
        <el-table
          v-if="!loading && firstLevelChildren.length"
          :data="firstLevelChildren"
          border
          stripe
          class="list-view"
        >
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="物料编号" prop="no" width="120" />
          <el-table-column label="物料名称" prop="name" width="180" />
          <el-table-column label="规格型号" prop="spec" width="150" />
          <el-table-column label="计量单位" prop="unit" width="100" />
          <el-table-column label="所属分类" prop="inclass" width="150" />
          <el-table-column label="技术备注" width="100" prop="tech_memo" show-overflow-tooltip />
          <el-table-column label="物料描述" width="100" prop="description" show-overflow-tooltip />
          <el-table-column label="用量" width="180">
            <template #default="{ row }">
              <el-input-number
                v-model.number="row.relationQuantity"
                :min="1"
                :step="1"
                :disabled="!row.isEditing"
                size="small"
                style="width: 120px;"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="!row.isEditing"
                type="primary"
                size="small"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <div v-else class="operation-group">
                <el-button
                  type="success"
                  size="small"
                  @click="handleSaveQuantity(row)"
                >
                  保存
                </el-button>
                <el-button
                  type="warning"
                  size="small"
                  @click="handleCancelEdit(row)"
                >
                  取消
                </el-button>
              </div>
              <el-button
                type="danger"
                size="small"
                @click="handleDeleteRelation(row)"
                :disabled="row.isEditing"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 列表空状态 -->
        <div class="empty-state" v-if="!loading && !firstLevelChildren.length && !pendingMaterials.length">
          <el-empty description="暂无第一级子物料" />
        </div>
      </div>

      <!-- 分割线 -->
      <div class="divider"></div>

      <!-- 树状图视图：展示全层级关系 -->
      <div class="tree-container">
        <h3 class="section-title">全层级物料分解关系</h3>
        <el-tree
          v-if="!loading && treeData.length"
          :data="treeData"
          :props="treeProps"
          :expand-on-click-node="false"
          :default-expand-all="true"
          class="tree-view"
        >
          <template #default="{ node, data }">
            <div class="tree-node">
              <!-- 物料基础信息 -->
              <div class="node-info">
                <span class="node-name">{{ data.name }}</span>
                <span class="node-no">(编号：{{ data.no }})</span>
                <span class="node-spec">规格：{{ data.spec || '-' }}</span>
              </div>
              <!-- 用量信息（非根节点显示） -->
              <div class="node-quantity" v-if="data.relationQuantity !== undefined">
                用量：{{ data.relationQuantity }} {{ data.unit || '个' }}
              </div>
            </div>
          </template>
        </el-tree>

        <!-- 树状图空状态 -->
        <div class="empty-state" v-if="!loading && !treeData.length">
          <el-empty description="暂无物料分解关系" />
        </div>
      </div>
    </div>

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>

    <!-- 物料选择器弹窗 -->
    <MaterialSelector
    v-model="materialSelectorVisible"
    :multiple="true"
    :alreadySelectedIds="excludeIds"
    @confirm="handleMaterialSelect"
  />
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted, computed, toRefs, nextTick } from 'vue'
import { ElMessage, ElEmpty, ElDialog, ElMessageBox } from 'element-plus'
import { RefreshCw } from 'lucide-vue-next'
import { getMaterialTree, updateBasItemRelation, addBasItemRelation, deleteBasItemRelation } from '@/api/item/basitemrelation'

// 导入物料选择器组件（请根据实际路径调整）
import MaterialSelector from '../components/MaterialSelector.vue'

// 组件Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  itemId: {
    type: [Number, String],
    required: true,
    validator: (val) => val !== '' && val !== null
  }
})

// 组件Emits
const emit = defineEmits(['update:visible', 'close'])
// 计算属性：需要排除的ID列表 = [当前父物料ID, ...已有的子物料ID]
const excludeIds = computed(() => {
  // 1. 先获取已有的子物料ID（从firstLevelChildren中提取）
  const existingChildIds = firstLevelChildren.value.map(item => item.id)
  // 2. 加上当前父物料ID（避免选择自己作为子物料）
  return [props.itemId, ...existingChildIds]
})
// 响应式数据
const { visible } = toRefs(props)
const isVisible = ref(visible.value)
const loading = ref(false)
const treeData = ref([])
const firstLevelChildren = ref([])
const unsavedChanges = ref(false) // 跟踪未保存的修改
const materialSelectorVisible = ref(false) // 物料选择器弹窗显示状态
const pendingMaterials = ref([]) // 待添加的临时物料列表

// 树状图配置
const treeProps = {
  label: 'name',
  children: 'children',
  id: 'id'
}

// 监听父组件visible变化
watch(
  () => props.visible,
  (newVal) => {
    isVisible.value = newVal
    if (newVal && props.itemId) {
      fetchMaterialTree()
    }
  },
  { immediate: true }
)

// 监听弹窗内部关闭
watch(
  () => isVisible.value,
  (newVal) => {
    if (!newVal) {
      emit('update:visible', false)
    }
  }
)

// 计算属性：提取第一级子物料
const extractFirstLevelChildren = computed(() => {
  if (treeData.value.length === 0) return []
  // 为每个子物料添加编辑状态和原始用量属性
  return treeData.value[0]?.children.map(item => ({
    ...item,
    isEditing: false, // 是否处于编辑状态
    originalQuantity: item.relationQuantity // 原始用量，用于取消编辑时恢复
  })) || []
})

// 查询物料分解树
const fetchMaterialTree = async () => {
  loading.value = true
  try {
    const res = await getMaterialTree({ id: props.itemId })
    if (res.success && res.data.tree) {
      treeData.value = [res.data.tree]
      firstLevelChildren.value = extractFirstLevelChildren.value
      unsavedChanges.value = false // 重置未保存状态
    } else {
      treeData.value = []
      firstLevelChildren.value = []
      ElMessage.warning('查询物料分解关系失败')
    }
  } catch (error) {
    console.error('物料分解树查询失败：', error)
    ElMessage.error('网络错误，查询失败')
  } finally {
    loading.value = false
  }
}

// 打开物料选择器
const openAddMaterial = () => {
  // 清空之前的待添加列表
  pendingMaterials.value = []
  materialSelectorVisible.value = true
}

// 处理物料选择结果
const handleMaterialSelect = (selectedMaterials) => {
  if (!selectedMaterials || selectedMaterials.length === 0) return

  // 过滤掉已存在的子物料（避免重复添加）
  const existingChildIds = firstLevelChildren.value.map(item => item.id)
  const newMaterials = selectedMaterials
    .filter(material => !existingChildIds.includes(material.id))
    .map(material => ({
      ...material,
      relationQuantity: 1, // 默认用量1
      relationId: null, // 新增的物料暂无关联ID
      isPending: true // 标记为待添加状态
    }))

  if (newMaterials.length === 0) {
    ElMessage.info('所选物料已全部存在于子物料列表中')
    return
  }

  // 添加到待添加列表
  pendingMaterials.value = [...pendingMaterials.value, ...newMaterials]
}

// 移除待添加物料
const removePendingMaterial = (index) => {
  pendingMaterials.value.splice(index, 1)
}

// 确认添加待选物料（调用新增接口）
const handleAddPendingMaterial = async (row, index) => {
  if (!row.relationQuantity || row.relationQuantity < 1) {
    ElMessage.warning('请输入有效的用量（至少1）')
    return
  }

  loading.value = true
  try {
    const params = {
      parentItemId: props.itemId,
      childItemId: row.id,
      quantity: row.relationQuantity
    }

    const res = await addBasItemRelation(params)
    if (res.success) {
      ElMessage.success('物料添加成功')
      // 移除待添加列表中的该物料
      pendingMaterials.value.splice(index, 1)
      // 重新加载物料树，更新列表
      await fetchMaterialTree()
    } else {
      ElMessage.error('添加失败：' + (res.msg || '未知错误'))
    }
  } catch (error) {
    console.error('添加物料关系失败：', error)
    ElMessage.error('网络错误，添加失败')
  } finally {
    loading.value = false
  }
}

// 点击编辑按钮
const handleEdit = (row) => {
  // 先取消其他行的编辑状态
  firstLevelChildren.value.forEach(item => {
    if (item.id !== row.id) {
      item.isEditing = false
      // 恢复其他行的原始用量
      item.relationQuantity = item.originalQuantity
    }
  })
  // 设置当前行为编辑状态
  row.isEditing = true
  unsavedChanges.value = false // 编辑开始时还未产生未保存修改
}

// 取消编辑
const handleCancelEdit = (row) => {
  row.isEditing = false
  // 恢复原始用量
  row.relationQuantity = row.originalQuantity
  unsavedChanges.value = false
}

// 用量变化时标记未保存状态
const handleQuantityChange = (row) => {
  // 只有当用量发生变化时才标记为未保存
  if (row.originalQuantity !== undefined) {
    unsavedChanges.value = row.relationQuantity !== row.originalQuantity
  }
}

// 保存用量修改
const handleSaveQuantity = async (row) => {
  // 检查用量是否变化
  if (row.relationQuantity === row.originalQuantity) {
    ElMessage.info('用量未发生变化')
    row.isEditing = false
    return
  }

  loading.value = true
  try {
    const params = {
      id: row.relationId,
      parentItemId: props.itemId,
      childItemId: row.id,
      quantity: row.relationQuantity
    }
    const res = await updateBasItemRelation(params)
    if (res.success) {
      ElMessage.success('用量更新成功')
      row.isEditing = false
      row.originalQuantity = row.relationQuantity // 更新原始用量
      unsavedChanges.value = false
      // 同步更新树状图中的用量
      updateTreeQuantity(row.id, row.relationQuantity)
    } else {
      ElMessage.error('更新失败：' + (res.msg || '未知错误'))
    }
  } catch (error) {
    console.error('用量更新失败：', error)
    ElMessage.error('网络错误，更新失败')
  } finally {
    loading.value = false
  }
}

// 删除子物料关系
const handleDeleteRelation = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确认删除子物料"${row.name}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    loading.value = true
    const res = await deleteBasItemRelation({ id: row.relationId })
    if (res.success) {
      ElMessage.success('删除成功')
      await fetchMaterialTree() // 重新加载列表
    } else {
      ElMessage.error('删除失败：' + (res.msg || '未知错误'))
    }
  } catch (error) {
    if (error === 'cancel') return // 用户取消删除
    console.error('删除物料关系失败：', error)
    ElMessage.error('网络错误，删除失败')
  } finally {
    loading.value = false
  }
}

// 同步更新树状图中的用量
const updateTreeQuantity = (itemId, newQuantity) => {
  const updateNode = (nodes) => {
    for (const node of nodes) {
      if (node.id === itemId) {
        node.relationQuantity = newQuantity
        return true
      }
      if (node.children && node.children.length) {
        const found = updateNode(node.children)
        if (found) return true
      }
    }
    return false
  }
  updateNode(treeData.value)
}

// 关闭弹窗：检查未保存修改
const handleClose = async () => {
  // 如果有待添加物料或未保存的修改，提示用户
  if (pendingMaterials.length > 0 || unsavedChanges.value) {
    try {
      await ElMessageBox.confirm(
        '存在未确认的添加操作或未保存的修改，是否确认关闭？关闭后修改将丢失。',
        '确认关闭',
        {
          confirmButtonText: '确认关闭',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      // 用户确认关闭，重置状态
      resetState()
      isVisible.value = false
      emit('close')
    } catch (error) {
      // 用户取消关闭，不做操作
    }
  } else {
    // 无未保存修改，直接关闭
    resetState()
    isVisible.value = false
    emit('close')
  }
}

// 重置组件状态
const resetState = () => {
  // 取消所有编辑状态
  firstLevelChildren.value.forEach(item => {
    item.isEditing = false
    item.relationQuantity = item.originalQuantity
  })
  // 清空待添加列表和未保存状态
  pendingMaterials.value = []
  unsavedChanges.value = false
  // 清空数据（下次打开重新加载）
  treeData.value = []
  firstLevelChildren.value = []
}

// 初始化
onMounted(() => {
  if (props.visible && props.itemId) {
    fetchMaterialTree()
  }
})
</script>

<style scoped>
/* 弹窗内部样式 */
.action-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

/* 图标样式 */
.icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  vertical-align: middle;
}

.content {
  min-height: 600px;
  max-height: 700px;
  overflow-y: auto;
  padding-right: 8px;
}

/* 列表容器样式 */
.list-container {
  margin-bottom: 20px;
}

/* 待添加列表特殊样式 */
.pending-list {
  margin-bottom: 16px;
  border: 1px dashed #409eff;
}

/* 树状图容器样式 */
.tree-container {
  margin-top: 20px;
}

/* section标题样式 */
.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #1989fa;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  background-color: #1989fa;
  margin-right: 8px;
  border-radius: 2px;
}

/* 分割线样式 */
.divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 16px 0;
}

.tree-view {
  --el-tree-node-padding: 8px 0;
}

.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.node-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-name {
  font-weight: 500;
  color: #1989fa;
}

.node-no {
  font-size: 12px;
  color: #666;
}

.node-spec {
  font-size: 12px;
  color: #999;
}

.node-quantity {
  font-size: 12px;
  color: #e6a23c;
  font-weight: 500;
}

.list-view {
  width: 100%;
}

/* 操作按钮组样式 */
.operation-group {
  display: flex;
  gap: 8px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

/* 滚动条样式优化 */
.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>