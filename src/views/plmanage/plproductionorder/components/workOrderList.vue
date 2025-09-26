<template>
  <el-dialog
    v-model="dialogVisible"
    title="工单进程列表"
    width="800px"
    :before-close="handleClose"
    destroy-on-close
  >
    <div class="order-list-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
        <span>加载中...</span>
      </div>

      <!-- 统计信息 -->
      <div v-if="orderList.length > 0" class="summary-container">
        <span>已完成工单数量总和: {{ completedAmountSum }}</span>
      </div>

      <!-- 表头 -->
      <div v-if="orderList.length > 0" class="table-header">
        <div class="header-index">序号</div>
        <div class="header-woNo">工单编号</div>
        <div class="header-materials">物料名称</div>
        <div class="header-amount">数量</div>
        <div class="header-status">完成状态</div>
      </div>

      <!-- 工单进程列表 -->
      <div v-if="orderList.length > 0" class="order-list">
        <div
          v-for="(item, index) in orderList"
          :key="item.id"
          class="order-item"
        >
          <div class="order-row">
            <div class="col-index">
              <span class="order-index">{{ index + 1 }}</span>
            </div>
            <div class="col-woNo">
              <div class="woNo">{{ item.woNo || '-' }}</div>
            </div>
            <div class="col-materials">
              <div class="materials-name">{{ item.materialsName || '-' }}</div>
            </div>
            <div class="col-amount">
              <div class="amount">{{ item.amount || '-' }}</div>
            </div>
            <div class="col-status">
              <el-tag
                :type="getStatusType(item.status)"
                :icon="getStatusIcon(item.status)"
                size="large"
              >
                {{ getStatusLabel(item.status) }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 空数据状态 -->
      <div v-else class="empty-container">
        <el-empty description="暂无工单数据" />
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElDialog, ElTag, ElButton, ElIcon, ElEmpty } from 'element-plus'
import { Clock,CircleCheck, VideoPlay, Check, Loading } from '@element-plus/icons-vue'
import { getWorkOrderByIpoNo } from '@/api/plmanage/plworkorder'

// 定义组件属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  ipoNo: {
    type: String,
    default: ''
  }
})

// 定义事件
const emit = defineEmits(['update:visible'])

// 响应式数据
const orderList = ref([])
const loading = ref(false)

// 计算属性：控制弹窗显示
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 计算属性：已完成工单数量总和
const completedAmountSum = computed(() => {
  return orderList.value
    .filter(item => item.status === '40')
    .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
})

// 状态配置
const statusConfig = {
  '10': { label: '录入', icon: Clock, type: 'info' },
  '20': { label: '确认', icon: CircleCheck, type: 'warning' },
  '30': { label: '进行中', icon: VideoPlay, type: 'primary' },
  '40': { label: '已完成', icon: Check, type: 'success' }
}

// 获取状态标签
const getStatusLabel = (status) => {
  return statusConfig[status]?.label || '未知状态'
}

// 获取状态图标
const getStatusIcon = (status) => {
  return statusConfig[status]?.icon
}

// 获取状态类型
const getStatusType = (status) => {
  return statusConfig[status]?.type || 'info'
}

// 获取工单进程列表数据
const fetchOrderList = async () => {
  if (!props.ipoNo) return
  
  loading.value = true
  try {
    const response = await getWorkOrderByIpoNo({ ipoNo: props.ipoNo })
    if (response.success && response.data?.orderList) {
      orderList.value = response.data.orderList
    } else {
      orderList.value = []
    }
  } catch (error) {
    console.error('获取工单进程列表失败：', error)
    orderList.value = []
  } finally {
    loading.value = false
  }
}

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
  orderList.value = []
}

// 监听弹窗显示状态和ipoNo变化
watch(
  () => [props.visible, props.ipoNo],
  ([visible, ipoNo]) => {
    if (visible && ipoNo) {
      fetchOrderList()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.order-list-container {
  min-height: 300px;
}

.summary-container {
  padding: 12px 16px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #1890ff;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
}

.loading-container .el-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.table-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border: 1px solid #ebeef5;
  border-radius: 6px 6px 0 0;
  font-weight: 600;
  color: #606266;
  font-size: 14px;
}

.header-index {
  width: 80px;
  text-align: center;
  flex-shrink: 0;
}

.header-woNo {
  flex: 1;
  min-width: 150px;
}

.header-materials {
  flex: 1;
  min-width: 150px;
}

.header-amount {
  width: 100px;
  text-align: center;
  flex-shrink: 0;
}

.header-status {
  width: 120px;
  text-align: center;
  flex-shrink: 0;
}

.order-list {
  border: 1px solid #ebeef5;
  border-top: none;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
}

.order-item {
  border-bottom: 1px solid #ebeef5;
  transition: all 0.3s ease;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item:hover {
  background-color: #f5f7fa;
}

.order-row {
  display: flex;
  align-items: center;
  padding: 16px;
}

.col-index {
  width: 80px;
  text-align: center;
  flex-shrink: 0;
}

.col-woNo {
  flex: 1;
  min-width: 150px;
  padding-right: 16px;
}

.col-materials {
  flex: 1;
  min-width: 150px;
  padding-right: 16px;
}

.col-amount {
  width: 100px;
  text-align: center;
  flex-shrink: 0;
}

.col-status {
  width: 120px;
  text-align: center;
  flex-shrink: 0;
}

.order-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  font-weight: 500;
  font-size: 13px;
}

.woNo {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.materials-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.amount {
  font-size: 14px;
  color: #606266;
}

.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.dialog-footer {
  text-align: right;
}
</style>