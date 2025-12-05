<template>
  <CustomDialog
    :visible="dialogVisible"
    title="工单生产进度详情"
    width="900px"
    height="70vh"
    :close-on-click-modal="false"
    :is-full-screen="isFullscreen"
    @update:visible="handleVisibleUpdate"
    @update:is-full-screen="isFullscreen = $event"
    @close="handleClose"
  >
    <div class="dialog-content">
      
      <!-- 上部分：工序流程概览 (卡片列表) -->
      <div class="process-section" v-loading="loading" element-loading-text="正在加载工序信息...">
        <div class="section-title">工序流程 (点击工序查看详情)</div>
        
        <div v-if="processList.length > 0" class="process-steps">
          <div
            v-for="(item, index) in processList"
            :key="item.id || index"
            class="process-card"
            :class="{ 'is-active': currentProcessCode === item.processCode }"
            @click="handleProcessClick(item)"
          >
            <div class="p-name">{{ index + 1 }}. {{ item.processName }}</div>
            <div class="p-info">
              <span class="label">编码:</span> {{ item.processCode }}
            </div>
            <div class="p-stat">
              <span class="label">已完成:</span>
              <span class="qty">{{ item.completedQty || 0 }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="!loading" class="empty-text">暂无工序信息</div>
      </div>

      <!-- 下部分：详细报工记录表格 -->
      <div class="report-section">
        <div class="section-title">
          <span v-if="currentProcessName" style="color: #409EFF">【{{ currentProcessName }}】</span>
          <span> 报工记录明细</span>
        </div>

        <el-table 
          v-loading="detailLoading"
          element-loading-text="正在加载报工记录..."
          :data="reportList" 
          border 
          style="width: 100%; flex: 1;" 
          height="100%"
          :header-cell-style="{ 'background-color': '#f5f7fa', 'color': '#333' }"
        >
          <el-table-column prop="processName" label="工序名称" width="120" align="center" />
          <el-table-column prop="processCode" label="工序编号" width="100" align="center" />
          <el-table-column prop="amount" label="报工数量" width="100" align="center">
            <template #default="scope">
              <span style="color: #67C23A; font-weight: bold">{{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="writer" label="报工人员" width="120" align="center" />
          <el-table-column prop="workshopName" label="车间" width="120" align="center" />
          <el-table-column prop="createdTime" label="报工时间" min-width="160" align="center" />
          
          <template #empty>
            <div class="empty-tip">该工序暂无报工记录</div>
          </template>
        </el-table>
      </div>

    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleVisibleUpdate(false)">关 闭</el-button>
      </div>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { ElMessage } from 'element-plus'; // 根据你的UI库版本调整
// 引入你的API接口
import { getPlReportWorkOrderListByWoNo } from '@/api/plmanage/plreportworkorder';
// 假设这是你封装的获取工序列表的API
import { getWorkOrderComplete } from '@/api/plmanage/plworkorder'; 
import CustomDialog from '@/components/common/CustomDialog.vue'; // 确保路径正确

// --- Props & Emits ---
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  woNo: {
    type: String,
    required: true,
    default: ''
  },
  itemId: {
    type: [Number, String],
    default: null
  }
});

const emit = defineEmits(['update:visible', 'close']);

// --- State ---
const isFullscreen = ref(false);
const loading = ref(false);       // 工序列表加载状态
const detailLoading = ref(false); // 报工明细加载状态

const processList = ref([]);      // 工序数据
const reportList = ref([]);       // 报工明细数据
const currentProcessCode = ref(null); // 当前选中的工序Code
const currentProcessName = ref('');   // 当前选中的工序名称

// --- Computed ---
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => handleVisibleUpdate(val)
});

// --- Watchers ---
watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.woNo && props.itemId) {
        initData();
      } else {
        ElMessage.warning('缺少工单号或物料ID');
      }
    } else {
      // 关闭时清理数据
      setTimeout(() => {
        clearData();
      }, 300);
    }
  }
);

// --- Methods ---

// 1. 初始化：获取工序列表
const initData = async () => {
  loading.value = true;
  clearData();
  
  try {
    const res = await getWorkOrderComplete({ woNo: props.woNo, itemId: props.itemId });
    if (res.code === 200 && res.data && res.data.list) {
      processList.value = res.data.list;
      // 默认选中第一个工序
      if (processList.value.length > 0) {
        handleProcessClick(processList.value[0]);
      }
    } else {
      ElMessage.warning(res.msg || '未查询到工序信息');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('获取工序进度失败');
  } finally {
    loading.value = false;
  }
};

// 2. 点击工序卡片：获取报工明细
const handleProcessClick = async (item) => {
  // 避免重复点击请求
  if (currentProcessCode.value === item.processCode) return;

  currentProcessCode.value = item.processCode;
  currentProcessName.value = item.processName;
  
  detailLoading.value = true;
  reportList.value = []; // 先清空表格

  try {
    const res = await getPlReportWorkOrderListByWoNo({
      woNo: props.woNo,
      processCode: item.processCode
    });

    if (res.code === 200 && res.data && res.data.orderList) {
      reportList.value = res.data.orderList;
    } else {
      reportList.value = [];
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('获取报工记录失败');
  } finally {
    detailLoading.value = false;
  }
};

const clearData = () => {
  processList.value = [];
  reportList.value = [];
  currentProcessCode.value = null;
  currentProcessName.value = '';
};

const handleVisibleUpdate = (val) => {
  emit('update:visible', val);
  if (!val) emit('close');
};

const handleClose = () => {
  handleVisibleUpdate(false);
};
</script>

<style scoped lang="scss">
.dialog-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}

/* 通用标题样式 */
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 15px 0 10px 0;
  border-left: 4px solid #409EFF;
  padding-left: 10px;
  display: flex;
  align-items: center;
}

/* 上部分：工序卡片区域 */
.process-section {
  min-height: 120px; /* 防止加载时塌陷 */
  margin-bottom: 10px;
}

.process-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.process-card {
  width: 150px;
  background: #fdfdfd;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: #c6e2ff;
  }

  &.is-active {
    background: #ecf5ff;
    border-color: #409EFF;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);

    /* 选中小三角 */
    &::after {
      content: '';
      position: absolute;
      bottom: -10px; 
      left: 50%;
      transform: translateX(-50%);
      border-width: 10px 10px 0;
      border-style: solid;
      border-color: #409EFF transparent transparent;
      z-index: 10;
    }
  }

  .p-name {
    font-weight: bold;
    color: #303133;
    margin-bottom: 8px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .p-info {
    font-size: 12px;
    color: #909399;
    margin-bottom: 4px;
  }

  .p-stat {
    font-size: 12px;
    color: #606266;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .qty {
      color: #67C23A; 
      font-weight: bold;
      font-size: 16px;
    }
  }
}

.empty-text {
  color: #909399;
  font-size: 14px;
  text-align: center;
  padding: 20px;
}

/* 下部分：表格区域 */
.report-section {
  flex: 1; /* 撑满剩余高度 */
  display: flex;
  flex-direction: column;
  min-height: 0; /* 配合 flex 滚动 */
  padding-bottom: 10px;
}

.empty-tip {
  text-align: center;
  padding: 30px 0;
  color: #999;
}
</style>