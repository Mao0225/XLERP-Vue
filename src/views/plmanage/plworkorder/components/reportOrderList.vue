<template>
  <el-dialog
    v-model="dialogVisible"
    title="工序报工"
    width="1080px"
    :before-close="handleClose"
    destroy-on-close
  >
    <div class="process-container">
      <!-- 表头 -->
      <div class="process-header">
        <div class="col-index">序号</div>
        <div class="col-code">工序编码</div>
        <div class="col-name">工序名称</div>
        <div class="col-workshop">所属车间</div>
        <div class="col-reporter">报工人员</div>
        <div class="col-reportNo">报工单号</div>
        <div class="col-status">状态操作</div>
      </div>

      <!-- 已有的工序 -->
      <div v-for="(item, index) in orderList" :key="item.id" class="process-row">
        <div class="col-index">{{ index + 1 }}</div>
        <div class="col-code">{{ item.processCode || '-' }}</div>
        <div class="col-name">{{ item.processName || '-' }}</div>
        <div class="col-workshop">{{ item.workshopName || '-' }}</div>
        <div class="col-reporter">{{ item.writer || '-' }}</div>
        <div class="col-reportNo">{{ item.reportNo || '-' }}</div>
        <div class="col-status">
          <el-tag v-if="item.status === '20'" type="success" size="small">已完成</el-tag>
          <el-button
            v-else
            type="primary"
            size="small"
            :loading="item.updating"
            @click="confirmFinish(item)"
          >
            确认完成
          </el-button>
        </div>
      </div>

      <!-- 新增一行 -->
      <div class="process-row add-row">
        <div class="col-index"><el-icon><Plus /></el-icon></div>

        <div class="col-code">
          <el-input v-model="newForm.processCode" placeholder="工序编码" size="small" clearable />
        </div>

        <div class="col-name">
          <el-input v-model="newForm.processName" placeholder="工序名称" size="small" clearable />
        </div>

        <div class="col-workshop">
          <el-select
            v-model="newForm.workshopName" 
            placeholder="选择车间"
            size="small"
            style="width: 100%"
            clearable
            filterable
          >
            <el-option label="机锻分厂" value="机锻分厂" />
            <el-option label="铝加工分厂" value="铝加工分厂" />
            <el-option label="中心库" value="中心库" />

          </el-select>
        </div>

        <div class="col-reporter">
          <el-input :value="userRealName" disabled size="small" />
        </div>

        <div class="col-reportNo">
          <el-input :value="newForm.reportNo" disabled size="small" placeholder="自动生成" />
        </div>

        <div class="col-status">
          <el-button
            type="primary"
            size="small"
            :loading="saving"
            :disabled="!canSave"
            @click="handleAdd"
          >
            保存新增
          </el-button>
        </div>
      </div>

      <div v-if="!loading && orderList.length === 0 && !newForm.processName" class="empty-tip">
        暂无工序，可在下方新增
      </div>
    </div>

    <!-- 基础信息 -->
    <div class="readonly-info">
      <el-descriptions :column="2" border size="small" class="info-descriptions">
        <el-descriptions-item label="生产订单号">{{ props.ipoNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="生产工单号">{{ props.woNo || '-' }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { getNewNoNyName } from '@/api/system/basno'
import {
  getPlReportWorkOrderListByWoNo,
  createPlReportWorkOrder,
  updateStatus   // ← 你提供的更新状态接口
} from '@/api/plmanage/plreportworkorder'

const props = defineProps({
  visible: Boolean,
  woNo: String,
  ipoNo: String
})

const emit = defineEmits(['update:visible'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const userStore = useUserStore()
const userRealName = computed(() => userStore.realName || '未知用户')

const orderList = ref([])
const loading = ref(false)
const saving = ref(false)

// 新增表单 - 车间改为单个值存储
const newForm = ref({
  processCode: '',
  processName: '',
  workshopName: '',  // 改为单个字符串存储选中值
  reportNo: ''
})

// 保存按钮校验 - 改为校验单个车间值
const canSave = computed(() => {
  return newForm.value.processCode.trim() &&
         newForm.value.processName.trim() &&
         newForm.value.workshopName.trim()  // 校验非空字符串
})

// 加载工序列表
const fetchList = async () => {
  if (!props.woNo) return
  loading.value = true
  try {
    const res = await getPlReportWorkOrderListByWoNo({ woNo: props.woNo })
    if (res.success && res.data?.orderList) {
      orderList.value = res.data.orderList.map(item => ({
        ...item,
        status: String(item.status || '10'),
        updating: false
      }))
    } else {
      orderList.value = []
    }
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 生成新的报工单号（每次打开弹窗或新增成功后都重新生成）
const generateReportNo = async () => {
  try {
    const res = await getNewNoNyName('bgd')
    if (res?.code === 200 && res.data?.fullNoNyName) {
      newForm.value.reportNo = res.data.fullNoNyName
    } else {
      ElMessage.error(res?.msg || '获取报工单号失败')
      newForm.value.reportNo = ''
    }
  } catch {
    ElMessage.error('生成报工单号出错')
    newForm.value.reportNo = ''
  }
}

// 新增工序 - 直接传递单个车间值
const handleAdd = async () => {
  saving.value = true
  try {
    const params = {
      ipoNo: props.ipoNo,
      woNo: props.woNo,
      processCode: newForm.value.processCode.trim(),
      processName: newForm.value.processName.trim(),
      workshopName: newForm.value.workshopName.trim(),  // 直接传递选中值
      writer: userRealName.value,
      reportNo: newForm.value.reportNo,
      status: '10'  // 新增默认进行中
    }

    const res = await createPlReportWorkOrder(params)
    if (res.code === 200 || res.success) {
      ElMessage.success('新增成功')
      // 重置表单时清空单个车间值
      newForm.value = { processCode: '', processName: '', workshopName: '', reportNo: '' }
      await fetchList()
      await generateReportNo()  // 新增成功后立刻生成下一个编号
    } else {
      throw new Error(res.msg || '新增失败')
    }
  } catch (err) {
    ElMessage.error(err.message || '新增失败')
  } finally {
    saving.value = false
  }
}

// 确认完成
const confirmFinish = async (item) => {
  item.updating = true
  try {
    const res = await updateStatus({ id: item.id, newStatus: '20' })
    if (res.code === 200 || res.success) {
      ElMessage.success('已确认完成')
      item.status = '20'
    } else {
      throw new Error(res.msg || '操作失败')
    }
  } catch (err) {
    ElMessage.error(err.message || '确认失败')
  } finally {
    item.updating = false
  }
}

const handleClose = () => {
  dialogVisible.value = false
  // 关闭时重置表单
  newForm.value = { processCode: '', processName: '', workshopName: '', reportNo: '' }
}

// 打开弹窗 → 加载数据 + 生成第一个报工单号
watch(() => props.visible, async (val) => {
  if (val && props.woNo) {
    await fetchList()
    await generateReportNo()
  }
}, { immediate: true })
</script>

<style scoped>
.process-container {
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* 表头样式 */
.process-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  font-weight: 600;
  color: #1989fa;
  font-size: 14px;
}

.process-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  background: #fff;
  transition: background-color 0.2s ease;
}

/* 行hover效果 */
.process-row:not(.add-row):hover {
  background-color: #fafafa;
}

.process-row:last-child {
  border-bottom: none;
}

.add-row {
  background: #f8f9fb;
  font-weight: 500;
  border-top: 1px dashed #dee2e6;
}

/* 列样式调整 */
.col-index     { width: 60px; text-align: center; flex-shrink: 0; }
.col-code      { width: 130px; flex-shrink: 0; padding: 0 8px; }
.col-name      { flex: 1; min-width: 150px; padding: 0 8px; }
.col-workshop  { flex: 1.2; min-width: 200px; padding: 0 8px; }
.col-reporter  { width: 100px; text-align: center; padding: 0 8px; }
.col-reportNo  { width: 170px; flex-shrink: 0; padding: 0 8px; }
.col-status    { width: 130px; text-align: center; flex-shrink: 0; padding: 0 8px; }

/* 输入框样式优化 */
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  border-radius: 4px;
}

.readonly-info {
  padding: 0 10px;
  margin-bottom: 8px;
}

.info-descriptions {
  background-color: #f9fafb;
}

.empty-tip {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
  background-color: #fff;
}

/* 按钮样式微调 */
:deep(.el-button--small) {
  padding: 6px 12px;
}

:deep(.el-tag--small) {
  padding: 2px 8px;
}
</style>