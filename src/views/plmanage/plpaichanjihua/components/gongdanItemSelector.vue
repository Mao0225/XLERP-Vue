<template>
  <el-dialog
    title="选择工单物料"
    v-model="visible"
    width="60%"
    @closed="handleClose"
  >
    <el-table
      :data="materialList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      @row-click="handleRowClick"
    >
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="woNo" label="生产工单号" width="150" />
      <el-table-column prop="itemname" label="物料名称" width="200" />
      <el-table-column prop="productModel" label="产品型号" width="120" />
      <el-table-column prop="amount" label="数量" width="100" />
      <el-table-column prop="unit" label="单位" width="80" />
      <el-table-column prop="workshopName" label="车间" width="150">
        <template #default="{ row }">
          {{ getWorkshopName(row.workshopName) }}
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" width="150" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="selectMaterial(row)">
            选择
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNumber"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getGongdanItemList } from '@/api/plmanage/plshengchangongdan'
import { getBasDepartmentOptions } from '@/api/system/department'

// 定义组件的 props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  woNo: {
    type: String,
    default: ''
  },
  onSelect: {
    type: Function,
    default: () => {}
  }
})

// 定义组件发出的事件
const emit = defineEmits(['update:modelValue'])

// 控制弹窗的显示状态
const visible = ref(false)

// 监听父组件传入的 modelValue
watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val && props.woNo) {
    loadWorkshopData()
    loadMaterialList()
  }
})

// 监听弹窗显示状态的变化
watch(visible, (val) => {
  emit('update:modelValue', val)
})

// 查询参数
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  woNo: ''
})

// 物料列表数据
const materialList = ref([])
// 总记录数
const total = ref(0)
// 加载状态
const loading = ref(false)


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

// 获取车间名称
const getWorkshopName = (codes) => {
  if (!codes) return ''
  const codeArray = codes.split(',')
  const names = codeArray.map(code => {
    const workshop = workshopOptions.value.find(option => option.code === code.trim())
    return workshop ? workshop.name : code
  })
  return names.join(',')
}

// 加载物料列表
const loadMaterialList = async () => {
  if (!props.woNo) {
    ElMessage.warning('未提供生产工单号')
    materialList.value = []
    total.value = 0
    return
  }
  
  loading.value = true
  try {
    queryParams.woNo = props.woNo
    const res = await getGongdanItemList(queryParams)
    materialList.value = res.data.itemList || []
    total.value = res.data.itemList?.length || 0
  } catch (error) {
    ElMessage.error('加载物料列表失败: ' + error.message)
    materialList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNumber = 1
  loadMaterialList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  loadMaterialList()
}

// 选择物料
const selectMaterial = (material) => {
  props.onSelect(material)
  visible.value = false
}

// 处理表格行点击事件
const handleRowClick = (row) => {
  selectMaterial(row)
}

// 处理弹窗关闭事件
const handleClose = () => {
  queryParams.pageNumber = 1
  queryParams.woNo = ''
  materialList.value = []
  total.value = 0
}
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  text-align: right;
}

:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>