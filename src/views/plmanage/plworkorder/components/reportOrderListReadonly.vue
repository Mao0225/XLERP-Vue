<template>
  <el-dialog
    v-model="dialogVisible"
    title="工序列表"
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

      <!-- 表头 -->
      <div v-if="orderList.length > 0" class="table-header">
        <div class="header-index">序号</div>
        <div class="header-process">工序名称</div>
        <div class="header-workshop">车间名称</div>
        <div class="header-status">完成状态</div>
      </div>

      <!-- 工序列表 -->
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
            <div class="col-process">
              <div class="process-name">{{ item.processName || '-' }}</div>
            </div>
            <div class="col-workshop">
              <div class="workshop-name">{{ item.workshopName || '-' }}</div>
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
        <el-empty description="暂无工序数据" />
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
import { Clock, CircleCheck, VideoPlay, Check, Loading } from '@element-plus/icons-vue'
import { getPlReportWorkOrderListByWoNo } from '@/api/plmanage/plreportworkorder'

import { getWorkOrderByIpoNo } from '@/api/plmanage/plworkorder'

// 定义组件属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  woNo: {
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

// 获取工序列表数据
const fetchOrderList = async () => {
  if (!props.woNo) return
  
  loading.value = true
  try {
    const response = await getPlReportWorkOrderListByWoNo({woNo:props.woNo})
    if (response.success && response.data?.orderList) {
      orderList.value = response.data.orderList
    } else {
      orderList.value = []
    }
  } catch (error) {
    console.error('获取工序列表失败：', error)
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

// 监听弹窗显示状态和woNo变化
watch(
  () => [props.visible, props.woNo],
  ([visible, woNo]) => {
    if (visible && woNo) {
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

.header-process {
  flex: 1;
  min-width: 150px;
}

.header-workshop {
  flex: 1;
  min-width: 150px;
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

.col-process {
  flex: 1;
  min-width: 150px;
  padding-right: 16px;
}

.col-workshop {
  flex: 1;
  min-width: 150px;
  padding-right: 16px;
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

.process-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.workshop-name {
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