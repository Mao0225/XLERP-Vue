<template>
  <el-dialog
    title="选择合同行项目"
    :visible="modelValue"
    width="800px"
    @closed="handleClose"
    @update:visible="handleVisibleChange"
  >
    <el-table
      :data="tableData"
      border
      v-loading="loading"
      style="width: 100%"
      @row-click="handleRowClick"
      highlight-current-row
    >
      <el-table-column prop="itemname" label="项目名称" width="150" />
      <el-table-column prop="itemno" label="项目编号" width="150" />
      <el-table-column prop="spec" label="规格型号" width="150" />
      <el-table-column prop="itemunit" label="单位" width="80" />
      <el-table-column prop="itemnum" label="数量" width="80" />
      <el-table-column prop="itemprice" label="单价" width="100" />
      <el-table-column prop="poItemno" label="行项目号" width="150" />
      <el-table-column prop="poItemId" label="行项目ID" width="150" />
    </el-table>

    <template #footer>
      <el-button @click="handleCloseDialog">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getcontractitems } from '@/api/plchuchangchoujian/plchuchangchoujian'

// 接收父组件参数 - 使用v-model默认的modelValue
const props = defineProps({
  modelValue: {  // 适配v-model默认规则
    type: Boolean,
    default: false
  },
  contractNo: {
    type: String,
    default: ''
  }
})

// 向父组件传递事件
const emit = defineEmits(['update:modelValue', 'onSelect'])

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const currentContractNo = ref('')

// 组件初始化时打印初始参数
onMounted(() => {
  console.log('=== 行项目选择器组件初始化 ===')
  console.log('初始modelValue值:', props.modelValue)
  console.log('初始contractNo值:', props.contractNo)
})

// 处理el-dialog的visible变化
const handleVisibleChange = (value) => {
  console.log('子组件：visible变化为 →', value)
  emit('update:modelValue', value)  // 同步到父组件的v-model
}

// 关闭对话框
const handleCloseDialog = () => {
  console.log('子组件：关闭按钮被点击')
  emit('update:modelValue', false)
}

// 同时监听可见状态和合同编号变化
watch(
  () => [props.modelValue, props.contractNo],
  ([newVisible, newContractNo], [oldVisible, oldContractNo]) => {
    console.log('子组件：可见状态变化', oldVisible, '→', newVisible)
    console.log('子组件：合同编号变化', oldContractNo, '→', newContractNo)
    
    // 当组件变为可见且合同编号有效时，加载数据
    if (newVisible && newContractNo && (newVisible !== oldVisible || newContractNo !== oldContractNo)) {
      currentContractNo.value = newContractNo
      fetchData() // 调用接口加载行项目数据
    }
  },
  { immediate: true } // 初始化时立即执行一次
)

// 接口调用方法 - 加载行项目数据
const fetchData = async () => {
  console.log('=== fetchData 开始执行 ===')
  console.log('当前合同编号:', currentContractNo.value)
  
  // 合同编号有效性校验
  if (!currentContractNo.value || currentContractNo.value.trim() === '') {
    console.log('→ 合同编号为空或无效，不调用接口')
    ElMessage.warning('请先选择有效的销售合同')
    return
  }

  loading.value = true
  try {
    console.log('调用接口getcontractitems，参数:', currentContractNo.value)
    const startTime = Date.now()
    const res = await getcontractitems(currentContractNo.value)
    const endTime = Date.now()
    
    console.log(`接口调用完成，耗时${endTime - startTime}ms`)
    console.log('接口返回code:', res?.code)
    
    if (res?.code === 200) {
      console.log('→ 接口调用成功')
      if (!res.data || !Array.isArray(res.data.items)) {
        throw new Error('接口返回数据格式不正确: 缺少items数组')
      }
      
      // 过滤有效数据
      const validItems = res.data.items.filter(item => 
        item && item.poItemno !== undefined && item.poItemId !== undefined
      )
      
      console.log(`过滤后有效数据: ${validItems.length}条`)
      tableData.value = validItems
      
      if (tableData.value.length === 0) {
        ElMessage.info('未查询到有效的合同行项目数据')
      }
    } else {
      console.log(`→ 接口返回非200状态: ${res?.code}`)
      tableData.value = []
      ElMessage.warning(res?.msg || '获取行项目数据失败')
    }
  } catch (error) {
    console.error('→ fetchData 发生错误:', error)
    ElMessage.error(`获取数据失败: ${error.message || '未知错误'}`)
    tableData.value = []
  } finally {
    loading.value = false
    console.log('=== fetchData 执行结束 ===')
  }
}

// 处理行点击事件
const handleRowClick = (row) => {
  console.log('=== 行项目被点击 ===')
  console.log('选中的行数据:', row)
  
  if (!row.poItemno || !row.poItemId) {
    console.log('→ 行项目数据不完整')
    ElMessage.warning('所选行项目数据不完整')
    return
  }
  
  emit('onSelect', {
    poItemno: row.poItemno,
    poItemId: row.poItemId
  })
  handleCloseDialog()
}

// 对话框关闭时重置数据
const handleClose = () => {
  console.log('=== 对话框关闭事件触发 ===')
  tableData.value = []
  currentContractNo.value = ''
}
</script>

<style scoped>
.el-table {
  margin-bottom: 10px;
}
</style>
