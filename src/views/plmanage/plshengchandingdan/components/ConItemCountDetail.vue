<template>
  <el-dialog
    title="物料分解详情"
    v-model="dialogVisible"
    width="900px"
    :before-close="handleClose"
    append-to-body
    class="custom-dialog"
  >
    <div v-loading="loading" class="content-container">
      <!-- 无数据状态 -->
      <div v-if="!loading && treeData.length === 0" class="empty-state">
        <el-empty description="暂无物料分解数据" />
      </div>

      <!-- 物料数据展示 -->
      <div v-else class="material-details">
        <!-- 物料根节点 -->
        <div v-for="item in treeData" :key="item.id" class="level-card item-card">
          <!-- 点击整个头部区域都可以展开/折叠 -->
          <div class="card-header" @click="item.expanded = !item.expanded">
            <div class="header-info">
              <h3 class="main-title">{{ item.itemName }} <span class="item-no">({{ item.itemNo }})</span></h3>
              <div class="tag-group">
                <el-tag size="small" class="spec-tag">{{ item.spec }}</el-tag>
                <el-tag size="small" type="info">总量: {{ item.totalAmount }}</el-tag>
                <el-tag size="small" :type="item.allocatedOrderAmount > 0 ? 'success' : 'warning'">
                  已分配: {{ item.allocatedOrderAmount }}
                </el-tag>
              </div>
            </div>
            <el-icon class="toggle-icon">
              <arrow-up v-if="item.expanded" />
              <arrow-down v-else />
            </el-icon>
          </div>

          <!-- 订单列表 -->
          <div v-if="item.expanded" class="children-container">
            <div v-for="order in item.children" :key="order.id" class="level-card order-card">
              <!-- 订单卡片头部点击区域 -->
              <div class="card-header" @click="order.expanded = !order.expanded">
                <div class="header-info">
                  <h4 class="order-title">
                    <el-icon class="order-icon"><shopping-cart /></el-icon>
                    订单: {{ order.ipoNo }}
                  </h4>
                  <div class="stat-group">
                    <div class="stat-item">
                      <span class="stat-label">数量:</span>
                      <span class="stat-value">{{ order.orderAmount }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">剩余:</span>
                      <span class="stat-value">{{ order.remainingInOrder }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">车间:</span>
                      <span class="stat-value">{{ getWorkshopName(order.workshopName) }}</span>
                    </div>
                  </div>
                </div>
                <el-icon class="toggle-icon">
                  <arrow-up v-if="order.expanded" />
                  <arrow-down v-else />
                </el-icon>
              </div>

              <!-- 工单列表 -->
              <div v-if="order.expanded" class="children-container">
                <div v-for="workorder in order.children" :key="workorder.id" class="level-card workorder-card">
                  <div class="workorder-info">
                    <div class="workorder-header">
                      <el-icon class="workorder-icon"><ticket /></el-icon>
                      <span class="wo-no">工单: {{ workorder.woNo }}</span>
                    </div>
                    <div class="workorder-stat">
                      <span class="stat-label">数量:</span>
                      <span class="stat-value">{{ workorder.workorderAmount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>


<script setup>
import { ref, watch } from 'vue'
import { getItemCountDetail } from '@/api/plmanage/plshengchandingdan'
import { ElMessage, ElEmpty, ElTag, ElIcon } from 'element-plus'
import { ArrowUp, ArrowDown, ShoppingCart, Ticket } from '@element-plus/icons-vue'

import { getBasDepartmentOptions } from '@/api/system/department'


// 生产车间列表对应编号
const workshopOptions = ref([])

// 获取车间数据
const loadWorkshopData = async () => {
  try {
    const res = await getBasDepartmentOptions();
    if (!res.success) {
      console.error(res.msg);
      return;
    }
    workshopOptions.value = res.data.options || [];
  } catch (error) {
    console.error('加载车间数据失败');
  }
}

// 处理编号对应的名称显示
const getWorkshopName = (codes) => {
  if (!codes) return ''
  const codeArray = codes.split(',')
  const names = codeArray.map(code => {
    const workshop = workshopOptions.value.find(option => option.code === code.trim())
    return workshop ? workshop.name : code
  })
  return names.join(',')
}

// 接收父组件参数
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  conItemId: {
    type: String,
    required: true
  }
})

// 向父组件传递事件
const emit = defineEmits(['update:visible'])

// 组件内部状态
const dialogVisible = ref(props.visible)
const loading = ref(false)
const treeData = ref([])

// 监听visible变化
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal
    if (newVal && props.conItemId) {
      loadWorkshopData()
      fetchData()
    }
  },
  { immediate: true }
)

// 监听conItemId变化
watch(
  () => props.conItemId,
  (newVal) => {
    if (newVal && dialogVisible.value) {
      loadWorkshopData()
      fetchData()
    }
  }
)

// 加载数据
const fetchData = async () => {
  if (!props.conItemId) return

  loading.value = true
  try {
    const response = await getItemCountDetail({ conItemId: props.conItemId })
    if (response.success && response.data?.itemList?.length) {
      treeData.value = transformToTree(response.data.itemList[0])
    } else {
      treeData.value = []
      ElMessage.warning('未查询到相关数据')
    }
  } catch (error) {
    treeData.value = []
    ElMessage.error(`加载失败: ${error.message || '未知错误'}`)
    console.error('数据加载失败:', error)
  } finally {
    loading.value = false
  }
}

// 转换数据结构
const transformToTree = (itemData) => {
  // 物料根节点
  const itemNode = {
    id: `item_${itemData.itemNo}`,
    level: 'item',
    itemNo: itemData.itemNo,
    itemName: itemData.itemName,
    spec: itemData.spec,
    totalAmount: itemData.totalAmount,
    allocatedOrderAmount: itemData.allocatedOrderAmount,
    expanded: true, // 默认展开
    children: []
  }

  // 处理订单节点
  if (itemData.orders && itemData.orders.length) {
    itemNode.children = itemData.orders.map(order => ({
      id: `order_${order.ipoNo}`,
      level: 'order',
      ipoNo: order.ipoNo,
      orderAmount: order.orderAmount,
      remainingInOrder: order.remainingInOrder,
      workshopName: order.workshopName, // 这里存储的是原始编码
      expanded: false, // 默认折叠
      children: order.workorders?.map(workorder => ({
        id: `workorder_${workorder.woNo}`,
        level: 'workorder',
        woNo: workorder.woNo,
        workorderAmount: workorder.workorderAmount
      })) || []
    }))
  }

  return [itemNode]
}

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
}
</script>
<style scoped>
/* 样式部分主要增加了鼠标悬停效果 */
.custom-dialog {
  --el-dialog-padding: 20px;
}

.content-container {
  max-height: 600px;
  overflow-y: auto;
  padding: 10px 0;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

/* 层级卡片样式 */
.level-card {
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.item-card {
  background: #fff;
  border: 1px solid #e0e6ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.order-card {
  background: #f9fbfd;
  border: 1px solid #e6edf5;
  margin-left: 20px;
}

.workorder-card {
  background: #f0f7ff;
  border: 1px solid #d6e4ff;
  margin-left: 40px;
}

/* 卡片头部样式 - 关键修改：增加了鼠标交互反馈 */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer; /* 显示手型光标，表示可点击 */
  transition: background-color 0.2s ease;
}

/* 鼠标悬停效果，增强可点击感知 */
.card-header:hover {
  background-color: rgba(64, 150, 255, 0.03);
}

.item-card .card-header:hover {
  background-color: rgba(64, 150, 255, 0.05);
}

.order-card .card-header:hover {
  background-color: rgba(64, 150, 255, 0.04);
}

.header-info {
  flex: 1;
}

/* 其他样式保持不变... */
.main-title {
  margin: 0 0 8px 0;
  color: #1d2129;
  font-size: 16px;
}

.item-no {
  color: #86909c;
  font-size: 14px;
  font-weight: normal;
}

.tag-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.spec-tag {
  background-color: #f2f3f5;
  color: #4e5969;
  border-color: #e5e6eb;
}

.order-title {
  margin: 0;
  color: #272e3b;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.order-icon {
  color: #4096ff;
}

.stat-group {
  display: flex;
  gap: 16px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-label {
  color: #86909c;
  font-size: 13px;
}

.stat-value {
  color: #1d2129;
  font-size: 13px;
  font-weight: 500;
}

.toggle-icon {
  color: #86909c;
  width: 18px;
  height: 18px;
  transition: color 0.2s ease;
}

.card-header:hover .toggle-icon {
  color: #4096ff; /* 悬停时箭头变色，增强反馈 */
}

.children-container {
  padding: 0 16px 12px;
}

.workorder-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
}

.workorder-header {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1d2129;
}

.workorder-icon {
  color: #2d8cf0;
}

.wo-no {
  font-size: 13px;
  font-weight: 500;
}

.workorder-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

/* 滚动条优化 */
.content-container::-webkit-scrollbar {
  width: 8px;
}

.content-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.content-container::-webkit-scrollbar-track {
  background: #f9f9f9;
}
</style>