<template>
  <CustomDialog
    :visible="visible"
    title="批量制定生产订单"
    :close-on-click-modal="false"
    width="95%"
    height="85vh"
    :is-full-screen="isFullscreen"
    @update:is-full-screen="isFullscreen = $event"
    @update:visible="visible = $event"
    @close="handleClose"
    class="batch-order-dialog"
  >
    <!-- 主体 -->
    <div class="dialog-body" v-loading="loading" element-loading-text="数据加载中..." element-loading-background="rgba(255,255,255,0.6)">
      <!-- 批次信息 -->
      <div class="batch-info">
        <h3>本次添加批次号为：</h3>
        <span class="batch-no">{{ batchNo }}</span>
      </div>

      <!-- 表格骨架屏 -->
      <el-skeleton :loading="loading" animated :count="5" style="width: 100%; height: 100%">
        <el-table
          v-if="!loading"
          :data="tableData"
          border
          height="100%"
          style="width: 100%"
          class="batch-table"
          :row-class-name="() => 'batch-table-row'"
        >
          <!-- 序号 -->
          <el-table-column type="index" label="#" width="50" align="center" />

          <!-- 物料编号 -->
          <el-table-column prop="itemNo" label="物料编号" min-width="100" header-align="center" align="center" />

          <!-- 物料名称 -->
          <el-table-column prop="itemName" label="物料名称" min-width="160" show-overflow-tooltip />

          <!-- 规格型号 -->
          <el-table-column prop="itemSpec" label="规格型号" min-width="130" show-overflow-tooltip />

          <!-- 计划数量 -->
          <el-table-column label="计划数量" min-width="90" align="center">
            <template #default="{ row }">
              <span class="plan-qty">{{ row.itemnum }}</span>
            </template>
          </el-table-column>

          <!-- 已分配数量 -->
          <el-table-column label="已分配数量" min-width="90" align="center">
            <template #default="{ row }">
              <span class="actual-qty">{{ row.allocatedAmount }}</span>
            </template>
          </el-table-column>

          <!-- 订单数量 -->
          <el-table-column label="本次分配数量" min-width="120" align="center">
            <template #default="{ row }">
              <el-input-number
                v-model="row.orderQty"
                :min="1"
                :max="row.itemnum"
                size="small"
                controls-position="right"
                style="width: 100%"
              />
            </template>
          </el-table-column>

          <!-- 生产车间 -->
          <el-table-column label="生产车间" min-width="140">
            <template #default="{ row }">
              <el-input v-model="row.workshopName" placeholder="请输入车间" size="small" clearable />
            </template>
          </el-table-column>

          <!-- 计划开始 -->
          <el-table-column label="计划开始" min-width="130" align="center">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.planStartDate"
                type="date"
                size="small"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                :clearable="false"
              />
            </template>
          </el-table-column>

          <!-- 计划完成 -->
          <el-table-column label="计划完成" min-width="130" align="center">
            <template #default="{ row }">
              <el-date-picker
                v-model="row.planFinishDate"
                type="date"
                size="small"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                :clearable="false"
              />
            </template>
          </el-table-column>

          <!-- 排产编码 -->
          <el-table-column prop="scheduleCode" label="排产编码" min-width="150" show-overflow-tooltip />

          <!-- 操作列 -->
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template #default="{ $index }">
              <el-button
                type="danger"
                size="small"
                text
                @click="removeRow($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-skeleton>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          提交生产订单
        </el-button>
      </div>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, computed, watch, nextTick, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CustomDialog from '@/components/common/CustomDialog.vue'
import { useUserStore } from '@/store/user'
import { createPlProductionOrder } from '@/api/plmanage/plproductionorder'

const userStore = useUserStore()

// Props & Emits
const props = defineProps({
  visible: Boolean,
  selectedRows: { type: Array, default: () => [] },
  ipoBatchNo: String
})
const emit = defineEmits(['update:visible', 'success'])

// 响应式属性
const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const isFullscreen = ref(true)
const submitting = ref(false)
const loading = ref(false)
const tableData = ref([])
const batchNo = ref(props.ipoBatchNo)

// 弹窗打开时加载数据（立即显示 loading）
watch(
  () => props.visible,
  async (val) => {
    if (val) {
      loading.value = true
      tableData.value = []

      await nextTick() // 等待弹窗渲染
      try {
        // 模拟加载延时，避免闪烁（可选）
        await new Promise(resolve => setTimeout(resolve, 200))

        if (props.selectedRows?.length) {
          const rawData = props.selectedRows.map(row => ({
            ...row,
            orderQty: row.orderQty ?? row.itemnum ?? 0,
            workshopName: row.workshopName ?? '',
            planStartDate: row.planStartDate ?? '',
            planFinishDate: row.planFinishDate ?? ''
          }))
          tableData.value = reactive(rawData)
        }
      } catch (err) {
        console.error('加载数据出错:', err)
        ElMessage.error('加载数据失败，请重试')
      } finally {
        loading.value = false
      }
    }
  },
  { immediate: false }
)

// 删除一行
const removeRow = (index) => {
  ElMessageBox.confirm('确定要删除这条数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      tableData.value.splice(index, 1)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}

// 关闭弹窗
const handleClose = () => {
  visible.value = false
}

// 提交保存
const handleSubmit = async () => {
  if (!tableData.value.length) {
    ElMessage.warning('没有可提交的数据，请至少保留一条记录')
    return
  }

  // 校验数据
  const invalid = tableData.value.some(row => {
    return (
      !row.orderQty ||
      !row.workshopName ||
      !row.planStartDate ||
      !row.planFinishDate ||
      row.planStartDate > row.planFinishDate
    )
  })

  if (invalid) {
    ElMessage.warning('请检查数量、车间、日期是否完整，且开始日期 ≤ 完成日期')
    return
  }

  submitting.value = true

  try {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const promises = tableData.value.map(async (row) => {
      const data = {
        purchaserHqCode: row.purchaserHqCode || '',
        ipoType: '默认',
        supplierCode: row.supplierCode || '',
        supplierName: row.supplierName || '',
        ipoNo: '',
        ipoBatchNo: batchNo.value,
        categoryCode: row.categoryCode || '',
        subclassCode: row.subclassCode || '',
        scheduleCode: row.scheduleCode || '',
        poItemId: row.poItemId || '',
        dataType: '',
        soItemNo: '',
        materialsCode: row.itemNo || '',
        materialsName: row.itemName || '',
        materialsUnit: row.itemunit || '',
        materialsDesc: '无',
        amount: Number(row.orderQty),
        unit: row.itemunit || '',
        productIdGrpNo: '',
        productIdType: '',
        productModel: row.itemSpec || '',
        planStartDate: row.planStartDate,
        planFinishDate: row.planFinishDate,
        actualStartDate: '',
        actualFinishDate: '',
        plantName: '',
        workshopName: row.workshopName,
        ipoStatus: '',
        center: '',
        dataSource: '供应商侧',
        dataSourceCreateTime: new Date().toISOString(),
        ownerId: '',
        openId: '',
        createdTime: now,
        updatedTime: now,
        status: '10',
        writer: userStore.realName,
        remark: ''
      }

      try {
        const res = await createPlProductionOrder(data)
        if (res.code === 200) return { success: true }
        return { success: false, msg: res.msg }
      } catch (err) {
        return { success: false, msg: err.message }
      }
    })

    const results = await Promise.all(promises)
    const successCount = results.filter(r => r.success).length
    const failCount = results.length - successCount

    if (successCount > 0) {
      ElMessage.success(`成功保存 ${successCount} 条生产订单${failCount ? `，失败 ${failCount} 条` : ''}`)
      emit('success')
      handleClose()
    } else {
      ElMessage.error('全部保存失败，请检查后重试')
    }
  } catch (err) {
    console.error('批量生产订单提交异常：', err)
    ElMessage.error('提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.batch-order-dialog :deep(.el-dialog__body) {
  padding: 16px !important;
  height: calc(100% - 60px) !important;
  display: flex;
  flex-direction: column;
}

.dialog-body {
  flex: 1;
  overflow: hidden;
  height: 100%;
}

.batch-info {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #e0f7fa, #f0faff);
  border: 1px solid #c6e2ff;
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.batch-info h3 {
  margin: 0;
  font-size: 16px;
  color: #409eff;
}

.batch-no {
  margin-left: 6px;
  color: #67c23a;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 1px;
}

.batch-table {
  height: 100% !important;
  width: 100% !important;
}

.batch-table-row {
  height: 46px !important;
}

:deep(.el-input__inner),
:deep(.el-input-number),
:deep(.el-date-editor) {
  height: 32px;
  line-height: 32px;
}

:deep(.el-input-number .el-input__inner) {
  text-align: center;
}

.plan-qty {
  font-weight: 600;
  color: #67c23a;
}

.actual-qty {
  font-weight: 600;
  color: #409eff;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}
</style>
