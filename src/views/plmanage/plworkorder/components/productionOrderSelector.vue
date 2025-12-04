<template>
  <CustomDialog
    :visible="dialogVisible"
    title="生成工单向导"
    width="1300px"
    height="85vh"
    :close-on-click-modal="false"
    :is-full-screen="isFullscreen"
    @update:visible="dialogVisible = $event"
    @update:is-full-screen="isFullscreen = $event"
    @close="handleClose">

    <!-- 步骤条 -->
    <div class="steps-container">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="选择生产订单" description="选择来源订单" />
        <el-step title="设置生产参数" description="输入数量与时间" />
        <el-step title="确认生成工单" description="预览并保存" />
      </el-steps>
    </div>

    <!-- 主体内容区域 -->
    <div class="step-content" v-loading="globalLoading" element-loading-text="处理中...">
      
      <!-- STEP 1: 选择生产订单 -->
      <div v-show="activeStep === 0">
        <div class="search-section">
          <el-form :model="filters" inline>
            <el-form-item label="生产订单编号：">
              <el-input v-model="filters.ipoNo" placeholder="请输入" clearable style="width: 180px" />
            </el-form-item>
            <el-form-item label="合同编号：">
              <el-input v-model="filters.contractNo" placeholder="请输入" clearable style="width: 180px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon> 搜索</el-button>
              <el-button @click="handleReset"><el-icon><Refresh /></el-icon> 重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :data="tableData" 
                  v-loading="tableLoading" 
                  height="450" 
                  stripe 
                  highlight-current-row
                  @current-change="handleCurrentRowChange">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column width="50" align="center">
            <template #default="{ row }">
              <el-radio :model-value="selectedRow?.id" :label="row.id">{{ '' }}</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="ipoNo" label="生产订单号" width="150" />
          <el-table-column prop="contractNo" label="合同编号" width="140" />
          <el-table-column prop="itemName" label="产品名称" width="180" show-overflow-tooltip />
          <el-table-column prop="itemSpec" label="产品型号" width="120" />
          <el-table-column prop="materialsCode" label="物料编码" width="140" />
          <el-table-column prop="amount" label="订单总量" width="100" align="center" />
          <el-table-column prop="allocatedAmount" label="已分数量" width="100" align="center" />
        </el-table>
        <div class="pagination-container">
           <el-pagination v-model:current-page="pagination.current"
                         v-model:page-size="pagination.size"
                         :total="pagination.total"
                         layout="total, prev, pager, next"
                         @current-change="fetchData" />
        </div>
      </div>

      <!-- STEP 2: 输入参数 -->
      <div v-show="activeStep === 1" class="step-two-container">
        <el-descriptions title="已选订单信息" border column="2" style="margin-bottom: 20px;">
          <el-descriptions-item label="生产订单号">{{ selectedRow?.ipoNo }}</el-descriptions-item>
          <el-descriptions-item label="物料名称">{{ selectedRow?.itemName }}</el-descriptions-item>
          <el-descriptions-item label="剩余可排数量">{{ getRemainingAmount }}</el-descriptions-item>
        </el-descriptions>

        <el-form :model="formData" :rules="formRules" ref="stepTwoFormRef" label-width="120px" style="max-width: 600px; margin: 0 auto;">
          <el-form-item label="本批生产数量" prop="produceAmount">
            <el-input-number v-model="formData.produceAmount" :min="1" style="width: 100%" />
          </el-form-item>
          <el-form-item label="计划开始时间" prop="planStartDate">
            <el-date-picker v-model="formData.planStartDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%" />
          </el-form-item>
          <el-form-item label="计划结束时间" prop="planFinishDate">
            <el-date-picker v-model="formData.planFinishDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%" />
          </el-form-item>
        </el-form>
      </div>

      <!-- STEP 3: 预览与生成 -->
      <div v-show="activeStep === 2">
        <div class="batch-info-bar">
          <el-tag size="large">批次号: {{ generatedBatchNo }}</el-tag>
          <span style="margin-left: 15px; font-size: 13px; color: #666">
            共生成 {{ previewList.length }} 条工单记录，请确认信息后点击提交。
          </span>
        </div>
        
        <el-table :data="previewList" height="450" border stripe>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="nodeType" label="类型" width="80">
            <template #default="{ row }">
              <el-tag :type="row.nodeType === 'root' ? 'success' : 'info'">
                {{ row.nodeType === 'root' ? '成品' : '半成品' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="materialsCode" label="物料编码" width="140" show-overflow-tooltip />
          <el-table-column prop="materialsName" label="物料名称" width="180" show-overflow-tooltip />
          <el-table-column prop="modelSpec" label="规格型号" width="120" show-overflow-tooltip />
          <el-table-column prop="materialsUnit" label="单位" width="80" align="center" />
          <el-table-column prop="amount" label="生产数量" width="100" align="center" />
          <el-table-column label="计划时间" width="220" align="center">
            <template #default="{ row }">
              {{ row.planStartDate }} ~ {{ row.planFinishDate }}
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="150">
            <template #default="{ row }">
              <el-input v-model="row.memo" size="small" placeholder="请输入备注" />
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        
        <el-button v-if="activeStep > 0" @click="prevStep">上一步</el-button>
        
        <el-button v-if="activeStep < 2" type="primary" @click="nextStep" :disabled="activeStep === 0 && !selectedRow">
          下一步
        </el-button>
        
        <el-button v-if="activeStep === 2" type="success" @click="handleFinalSubmit" :loading="globalLoading">
          <el-icon class="el-icon--left"><Check /></el-icon> 确认生成工单
        </el-button>
      </div>
    </template>

  </CustomDialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Check } from '@element-plus/icons-vue'
import CustomDialog from '@/components/common/CustomDialog.vue'

// API 引入
import { getConfirmOrderList } from '@/api/plmanage/plproductionorder'
import { generatorWorkOrder, createPlWorkOrder } from '@/api/plmanage/plworkorder'
// 假设这里有一个获取批次号的接口，如果没有则使用前端生成逻辑
// import { getBatchNo } from '@/api/...' 

const props = defineProps({
  visible: { type: Boolean, default: false }
})
const emits = defineEmits(['update:visible', 'close', 'success'])

// === 基础弹窗控制 ===
const dialogVisible = computed({
  get: () => props.visible,
  set: val => emits('update:visible', val)
})
const isFullscreen = ref(false)
const globalLoading = ref(false)
const activeStep = ref(0)

// === STEP 1: 列表选择相关 ===
const tableLoading = ref(false)
const tableData = ref([])
const selectedRow = ref(null) // 当前选中的生产订单行
const filters = reactive({ ipoNo: '', contractNo: '' })
const pagination = reactive({ current: 1, size: 10, total: 0 })

// 获取Step 1列表数据
const fetchData = async () => {
  tableLoading.value = true
  try {
    const params = {
      pageNumber: pagination.current,
      pageSize: pagination.size,
      ipoNo: filters.ipoNo || undefined,
      contractNo: filters.contractNo || undefined,
    }
    const res = await getConfirmOrderList(params)
    if (res.code === 200) {
      tableData.value = res.data.page.list
      pagination.total = res.data.page.totalRow
    }
  } catch (e) {
    console.error(e)
  } finally {
    tableLoading.value = false
  }
}

// 选中行处理 (单选)
const handleCurrentRowChange = (val) => {
  selectedRow.value = val
}

const handleSearch = () => { pagination.current = 1; fetchData() }
const handleReset = () => { filters.ipoNo = ''; filters.contractNo = ''; fetchData() }

// === STEP 2: 参数填写相关 ===
const stepTwoFormRef = ref(null)
const formData = reactive({
  produceAmount: 0,
  planStartDate: '',
  planFinishDate: ''
})

const formRules = {
  produceAmount: [{ required: true, message: '请输入生产数量', trigger: 'blur' }],
  planStartDate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  planFinishDate: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

// 计算剩余数量作为默认值
const getRemainingAmount = computed(() => {
  if (!selectedRow.value) return 0
  return (selectedRow.value.amount || 0) - (selectedRow.value.allocatedAmount || 0)
})

// === STEP 3: 预览与提交相关 ===
const previewList = ref([]) // 存储转换后的列表
const generatedBatchNo = ref('') // 存储生成的批次号

// 生成批次号 (你可以在这里自定义规则)
const generateBatchNo = () => {
  const date = new Date()
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `WO${ymd}${random}`
}

// 核心：请求接口并处理数据映射
const preparePreviewData = async () => {
  globalLoading.value = true
  try {
    // 1. 生成批次号
    generatedBatchNo.value = generateBatchNo()

    // 2. 调用生成工单列表接口
    // 注意：这里传递的是Step 1选中的basItemId和Step 2填写的数量
    // 假设 selectedRow 中有 basItemId 或 itemId 字段，请根据实际情况调整
    const params = {
      basItemId: selectedRow.value.basItemId, // 或者是 selectedRow.value.basItemId
      ipoNo: selectedRow.value.ipoNo,
      amount: formData.produceAmount
    }
    
    const res = await generatorWorkOrder(params)
    
    if (res.code === 200 && res.success) {
      // 3. 数据映射：将接口返回的数据转换为 createPlWorkOrder 需要的格式
      previewList.value = res.data.list.map(item => ({
        // 原始字段保存 (如果需要)
        _originId: item.id, 
        
        // 映射字段
        itemId: item.id,                 // id -> itemId
        materialsCode: item.no,          // no -> materialsCode
        materialsName: item.name,        // name -> materialsName
        modelSpec: item.spec,            // spec -> modelSpec
        materialsUnit: item.unit,        // unit -> materialsUnit
        amount: item.requiredQuantity,   // requiredQuantity -> amount
        
        // 继承自上一步的字段
        planStartDate: formData.planStartDate,
        planFinishDate: formData.planFinishDate,
        ipoNo: selectedRow.value.ipoNo,
        woBatchNo: generatedBatchNo.value,
        
        // 额外字段
        memo: '',                        // 允许用户填写
        nodeType: item.nodeType          // 用于UI展示颜色区分
      }))
    } else {
      throw new Error(res.msg || '生成失败')
    }
    
    // 成功后进入下一步
    activeStep.value = 2
    
  } catch (error) {
    ElMessage.error(error.message || '获取工单预览失败')
  } finally {
    globalLoading.value = false
  }
}

// 最终提交：循环调用保存接口
const handleFinalSubmit = async () => {
  if (previewList.value.length === 0) {
    return ElMessage.warning('没有可生成的工单数据')
  }

  globalLoading.value = true
  let successCount = 0
  let failCount = 0

  try {
    // 使用 Promise.all 并行请求，或者使用 for...of 串行请求
    // 为了防止部分成功部分失败导致的数据混乱，通常建议串行或者后端提供批量接口
    // 这里按要求使用循环调用
    
    const promises = previewList.value.map(row => {
      // 构造保存接口需要的参数对象 (剔除 UI 辅助字段)
      const saveParams = {
        itemId: row.itemId,
        materialsCode: row.materialsCode,
        materialsName: row.materialsName,
        modelSpec: row.modelSpec,
        materialsUnit: row.materialsUnit,
        amount: row.amount,
        planStartDate: row.planStartDate,
        planFinishDate: row.planFinishDate,
        ipoNo: row.ipoNo,
        woBatchNo: row.woBatchNo,
        memo: row.memo,
        // 如果后端需要关联原始订单ID
        // relationIpoId: selectedRow.value.id 
      }
      return createPlWorkOrder(saveParams)
    })

    const results = await Promise.all(promises)

    // 检查结果
    results.forEach(res => {
      if (res.code === 200 || res.success) {
        successCount++
      } else {
        failCount++
      }
    })

    if (failCount === 0) {
      ElMessage.success(`成功生成 ${successCount} 条工单`)
      emits('success')
      handleClose()
    } else {
      ElMessage.warning(`操作完成：成功 ${successCount} 条，失败 ${failCount} 条`)
      // 可以选择保留弹窗让用户重试，或者关闭
      handleClose()
    }

  } catch (error) {
    console.error(error)
    ElMessage.error('保存过程中发生错误')
  } finally {
    globalLoading.value = false
  }
}

// === 导航控制 ===
const nextStep = () => {
  if (activeStep.value === 0) {
    if (!selectedRow.value) return ElMessage.warning('请先选择一个生产订单')
    // 初始化 Step 2 数据
    formData.produceAmount = getRemainingAmount.value
    activeStep.value = 1
  } else if (activeStep.value === 1) {
    stepTwoFormRef.value.validate((valid) => {
      if (valid) {
        // 进入 Step 3 前先获取预览数据
        preparePreviewData() 
      }
    })
  }
}

const prevStep = () => {
  if (activeStep.value > 0) activeStep.value--
}

const handleClose = () => {
  dialogVisible.value = false
  // 重置状态
  activeStep.value = 0
  selectedRow.value = null
  previewList.value = []
  formData.produceAmount = 0
  formData.planStartDate = ''
  formData.planFinishDate = ''
  emits('close')
}

// 监听弹窗打开自动加载
watch(dialogVisible, (val) => {
  if (val) {
    fetchData()
  }
})
</script>

<style scoped>
.steps-container {
  padding: 10px 50px 30px;
}
.step-content {
  padding: 0 20px;
  /* 保持高度一致避免跳动 */
  min-height: 500px; 
}
.search-section {
  margin-bottom: 10px;
  background: #f5f7fa;
  padding: 15px 15px 0 15px;
  border-radius: 4px;
}
.step-two-container {
  padding: 20px 50px;
}
.batch-info-bar {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  background: #f0f9eb;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e1f3d8;
}
.pagination-container {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>