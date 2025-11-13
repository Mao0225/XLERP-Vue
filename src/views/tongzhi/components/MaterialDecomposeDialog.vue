<template>
  <el-dialog
    v-model="isVisible"
    title="物料分解关系查看"
    width="70%"
    :fullscreen="false"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 操作栏：仅刷新 -->
    <!-- <div class="action-bar">
      <el-button 
        type="warning" 
        @click="fetchMaterialTree"
        :loading="loading"
      >
        <RefreshCw class="icon" />
        刷新
      </el-button>
    </div> -->

    <!-- 加载状态 -->
    <el-loading v-if="loading" target=".content" text="加载中..." />

    <!-- 内容区域 -->
    <div class="content">
      <!-- 第一级子物料列表（只读） -->
      <div class="list-container">
        <h3 class="section-title">第一级子物料</h3>

        <el-table
          v-if="!loading && firstLevelChildren.length"
          :data="firstLevelChildren"
          border
          stripe
          class="list-view"
          :header-cell-style="{ 'background-color': '#f5fafe' }"
        >
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="物料编号" prop="no" width="120" />
          <el-table-column label="物料名称" prop="name" width="180" />
          <el-table-column label="规格型号" prop="spec" width="150" />
          <el-table-column label="用量" width="120">
            <template #default="{ row }">
              {{ row.relationQuantity }} {{ row.unit || '个' }}
            </template>
          </el-table-column>
          <el-table-column label="计量单位" prop="unit" width="100" />
          <el-table-column label="所属分类" prop="inclass" width="150" />
          <el-table-column label="技术备注" prop="tech_memo" width="120" show-overflow-tooltip />
          <el-table-column label="物料描述" prop="description" width="150" show-overflow-tooltip />
        </el-table>

        <div class="empty-state" v-if="!loading && !firstLevelChildren.length">
          <el-empty description="暂无第一级子物料" />
        </div>
      </div>


      <!-- 树状图视图 -->
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
    <div class="tree-node" :class="`level-${node.level}`">
      <div class="node-info">
        <span class="node-name">{{ data.name }}</span>
        <span class="node-no">(编号：{{ data.no }})</span>
        <span class="node-spec">规格：{{ data.spec || '-' }}</span>
        <span class="node-class">(分类：{{ data.inclass }})</span>
      </div>
      <div class="node-quantity" v-if="data.relationQuantity !== undefined">
        用量：{{ data.relationQuantity }} {{ data.unit || '个' }}
      </div>
    </div>
  </template>
</el-tree>

        <div class="empty-state" v-if="!loading && !treeData.length">
          <el-empty description="暂无物料分解关系" />
        </div>
      </div>

         <!-- 合并子材料数量统计 -->
<div class="summary-container" v-if="!loading && summaryData.length">
  <h3 class="section-title">合并子材料数量</h3>
  <el-table
    :data="summaryData"
    border
    stripe
    class="summary-table"
    :header-cell-style="{ 'background-color': '#e6f7ff' }"
  >
    <el-table-column label="序号" type="index"  />
    <el-table-column label="物料编号" prop="no"  />
    <el-table-column label="物料名称" prop="name"  />
    <el-table-column label="规格型号" prop="spec" />
    <el-table-column label="分类" prop="inclass" />
    <el-table-column label="总用量" >
      <template #default="{ row }">
        <strong>{{ row.totalQuantity }}</strong> {{ row.unit || '个' }}
      </template>
    </el-table-column>
    <!-- <el-table-column label="计量单位" prop="unit" width="100" /> -->
  </el-table>
</div>

<!-- 无数据时 -->
<div class="empty-state" v-if="!loading && !summaryData.length && treeData.length">
  <el-empty description="暂无可合并的子材料" />
</div>
    </div>


 

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted,computed } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshCw } from 'lucide-vue-next'
import { getMaterialTree } from '@/api/item/basitemrelation'

// Props
const props = defineProps({
  visible: { type: Boolean, required: true, default: false },
  itemId: { type: [Number, String], required: true },
  itemQuantity: { type: [Number, String], required: true,default:1 }
})

const emit = defineEmits(['update:visible', 'close'])

// 响应式数据
const isVisible = ref(props.visible)
const loading = ref(false)
const treeData = ref([])
const firstLevelChildren = ref([])

// 树配置
const treeProps = {
  label: 'name',
  children: 'children',
  id: 'id'
}

// 监听 visible 变化
watch(() => props.visible, (val) => {
  isVisible.value = val
  if (val && props.itemId) {
    fetchMaterialTree()
  }
}, { immediate: true })

watch(isVisible, (val) => {
  if (!val) emit('update:visible', false)
})

// 获取物料树
const fetchMaterialTree = async () => {
  if (!props.itemId) return
  loading.value = true
  try {
    const res = await getMaterialTree({ id: props.itemId })
    if (res.success && res.data.tree) {
      treeData.value = [res.data.tree]

      const qty = Number(props.itemQuantity) || 1
      firstLevelChildren.value = res.data.tree.children?.map(item => ({
        ...item,
        totalQuantity: (item.relationQuantity || 1) * qty
      })) || []
    } else {
      treeData.value = []
      firstLevelChildren.value = []
      ElMessage.warning('暂无分解关系数据')
    }
  } catch (error) {
    console.error('查询失败：', error)
    ElMessage.error('加载失败')
    treeData.value = []
    firstLevelChildren.value = []
  } finally {
    loading.value = false
  }
}

// 递归计算总用量（支持主产品需求量）
const calculateSummary = (node, multiplier = 1, rootQuantity = 1) => {
  const result = []
  if (!node) return result

  const effectiveMultiplier = multiplier * rootQuantity

  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      const childMultiplier = effectiveMultiplier * (child.relationQuantity || 1)
      result.push(...calculateSummary(child, childMultiplier, 1))
    })
  } else {
    result.push({
      ...node,
      totalQuantity: effectiveMultiplier
    })
  }

  return result
}

// 合并统计
const summaryData = computed(() => {
  if (!treeData.value.length || !treeData.value[0]) return []

  const root = treeData.value[0]
  const rootQuantity = Number(props.itemQuantity) || 1

  const allItems = calculateSummary(root, 1, rootQuantity)

  const map = new Map()
  allItems.forEach(item => {
    const key = item.no
    if (!map.has(key)) {
      map.set(key, { ...item, totalQuantity: 0 })
    }
    map.get(key).totalQuantity += item.totalQuantity
  })

  return Array.from(map.values())
    .map(item => ({
      ...item,
      totalQuantity: Number(item.totalQuantity.toFixed(4)) // 保留4位，防浮点误差
    }))
    .sort((a, b) => a.no.localeCompare(b.no))
})

// 关闭
const handleClose = () => {
  isVisible.value = false
  emit('close')
}

onMounted(() => {
  if (props.visible && props.itemId) {
    fetchMaterialTree()
  }
})


</script>

<style scoped>
/* 保留原有美观样式，精简注释 */
.el-dialog {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.el-dialog__header {
  background: linear-gradient(135deg, #409eff, #79bbff);
  color: white;
  padding: 16px 24px;
  margin: 0;
  border-radius: 12px 12px 0 0;
}

.el-dialog__title {
  font-weight: 600;
  font-size: 18px;
}

.el-dialog__body {
  padding: 0;
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  padding: 16px 24px;
  background: #f8f9fc;
  border-bottom: 1px solid #ebeef5;
  gap: 12px;
}

.action-bar .el-button {
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon {
  width: 16px;
  height: 16px;
}

.content {
  min-height: 600px;
  max-height: 720px;
  overflow-y: auto;
  padding: 20px 24px;
  background: #ffffff;
}

.content::-webkit-scrollbar {
  width: 8px;
}
.content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.content::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
  position: relative;
}

.section-title::before {
  content: '';
  width: 5px;
  height: 18px;
  background: #409eff;
  border-radius: 3px;
  display: inline-block;
}

.list-view {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.list-view :deep(.el-table th) {
  background-color: #f0f7ff !important;
  color: #303133;
  font-weight: 600;
}

.list-view :deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

.list-view :deep(.el-table__body tr:hover > td) {
  background-color: #e6f7ff !important;
}

.tree-container {
  margin-top: 24px;
}

.tree-view {
  background: #f9fbfc;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 三级树状图 - 专属配色 */
.tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 6px 0;
  font-size: 14px;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.tree-node:hover {
  background: rgba(64, 158, 255, 0.1);
  border-radius: 4px;
  padding-left: 4px;
}

/* 根节点（成品） */
.level-1 {
  font-weight: 700;
  border-left-color: #1e3a8a; /* 深蓝 */
}
.level-1 .node-name { color: #1e3a8a; }
.level-1 .node-quantity { 
  background: #eef2ff; 
  color: #1e3a8a; 
  font-weight: 600;
}

/* 第一级子物料（半成品） */
.level-2 {
  border-left-color: #3b82f6; /* 亮蓝 */
}
.level-2 .node-name { color: #3b82f6; }
.level-2 .node-quantity { 
  background: #dbeafe; 
  color: #3b82f6; 
}

/* 第二级子物料（原材料） */
.level-3 {
  border-left-color: #10b981; /* 绿色 */
}
.level-3 .node-name { color: #10b981; }
.level-3 .node-quantity { 
  background: #ecfdf5; 
  color: #10b981; 
}

.node-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.node-name {
  font-weight: 600;
  color: #409eff;
}

.node-no {
  font-size: 12px;
  color: #909399;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.node-spec {
  font-size: 12px;
  color: #67c23a;
}

.node-class {
  font-size: 12px;
  color: #a6b61b;
}

.node-quantity {
  font-size: 13px;
  color: #e6a23c;
  font-weight: 600;
  background: #fdf6ec;
  padding: 2px 8px;
  border-radius: 6px;
  min-width: 80px;
  text-align: center;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #dcdfe6, transparent);
  margin: 24px 0;
}

/* 合并统计表 */
.summary-container {
  margin-top: 32px;
}

.summary-table {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.summary-table :deep(.el-table th) {
  background-color: #e6f7ff !important;
  color: #303133;
  font-weight: 600;
}

.summary-table :deep(.el-table__body tr:hover > td) {
  background-color: #d6f3ff !important;
}

.summary-table strong {
  color: #e6a23c;
  font-size: 15px;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 220px;
  color: #909399;
  font-size: 15px;
}

.empty-state :deep(.el-empty__image) {
  width: 120px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .action-bar .el-button {
    width: 100%;
    justify-content: center;
  }
  .content {
    padding: 16px;
  }
}
</style>