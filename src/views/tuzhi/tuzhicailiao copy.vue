<template>
  <div class="tuzhicailiao-management">
    <div class="action-bar">
      <el-button type="warning" @click="handleRefresh">
        <el-icon><Refresh /></el-icon> 刷新
      </el-button>
      <span v-if="tuzhibianhao">图纸编号：{{ tuzhibianhao }}</span>
      <el-button type="primary" @click="handleAdd" class="ml-auto">
        <el-icon><Plus /></el-icon> 添加材料
      </el-button>
    </div>

    <el-table :data="tuzhicailiaoList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="tuzhibianhao" label="图纸编号" />
      <el-table-column prop="no" label="物料编号" />
      <el-table-column prop="spec" label="规格" />
      <el-table-column prop="shuliang" label="数量" /> 
      <el-table-column prop="weight" label="重量" />
      <el-table-column prop="cailiaotype" label="材料类型" />
      <el-table-column prop="unit" label="单位" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="inclass" label="类别" />
      <el-table-column prop="memo" label="备注" />
      <el-table-column prop="id" label="图纸ID" />
      <el-table-column prop="basitemid" label="物料ID" />
      <el-table-column prop="writer" label="录入者" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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

    <!-- 编辑/添加对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="图纸编号" prop="tuzhibianhao">
          <el-input v-model="form.tuzhibianhao" placeholder="请输入图纸编号" disabled />
        </el-form-item>
        <el-form-item label="物料编号" prop="no">
          <el-input v-model="form.no" placeholder="请输入物料编号" style="width: 70%; display: inline-block;" />
          <el-button type="primary" size="small" @click="openSelectMaterialDialog" style="margin-left: 10px;">选择材料</el-button>
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input v-model="form.spec" placeholder="请输入规格" />
        </el-form-item>
        <el-form-item label="数量" prop="shuliang">
          <el-input v-model="form.shuliang" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入重量" />
        </el-form-item>
        <el-form-item label="材料类型" prop="cailiaotype">
          <el-input v-model="form.cailiaotype" placeholder="请输入材料类型" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类别" prop="inclass">
          <el-input v-model="form.inclass" placeholder="请输入类别" />
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="form.memo" type="textarea" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="图纸ID" prop="id">
          <el-input v-model="form.id" placeholder="图纸ID" disabled />
        </el-form-item>
        <el-form-item label="物料ID" prop="basitemid">
          <el-input v-model="form.basitemid" placeholder="请输入物料ID" />
        </el-form-item>
        <el-form-item label="录入者" prop="writer">
          <el-input v-model="form.writer" placeholder="请输入录入者" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 选择材料对话框 -->
    <el-dialog
      title="选择材料"
      v-model="selectMaterialDialogVisible"
      width="800px"
      @closed="resetSelectMaterialForm"
    >
      <div class="search-bar">
        <el-input v-model="selectMaterialQueryParams.itemno" placeholder="按物料编号搜索" style="width: 200px; margin-right: 10px;"></el-input>
        <el-input v-model="selectMaterialQueryParams.name" placeholder="按物料名称搜索" style="width: 200px;"></el-input>
        <el-button type="primary" @click="getYuancailiaoList">搜索</el-button>
      </div>
      <el-table :data="yuancailiaoList" border v-loading="selectMaterialLoading" style="width: 100%">
        <el-table-column prop="no" label="物料编号" />
        <el-table-column prop="name" label="物料名称" />
        <el-table-column prop="inclass" label="类别" />
        <el-table-column prop="weight" label="重量" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="selectMaterial(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="selectMaterialQueryParams.pageNumber"
          v-model:page-size="selectMaterialQueryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="selectMaterialTotal"
          @size-change="handleSelectMaterialSizeChange"
          @current-change="handleSelectMaterialCurrentChange"
        />
      </div>
      <template #footer>
        <el-button @click="selectMaterialDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onActivated, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTuzhicailiaos, createTuzhicailiao, updateTuzhicailiao, deleteTuzhicailiao, getYuancailiaoPage } from '@/api/tuzhi/tuzhicailiao'
import { Refresh, Plus } from '@element-plus/icons-vue'

// 接收父组件传递的参数
const props = defineProps({
  id: { type: Number, required: true },
  tuzhibianhao: { type: String, required: true }
})

// 查询参数
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  tuzhiid: 0
})

// 图纸材料列表数据
const tuzhicailiaoList = ref([])
const total = ref(0)
const loading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => 
  dialogType.value === 'add' ? '添加图纸材料' : '编辑图纸材料'
)
const formRef = ref(null)
const form = reactive({
  id: undefined,
  tuzhibianhao: '',
  no: '',
  spec: '',
  shuliang: '',
  weight: '',
  cailiaotype: '',
  unit: '',
  name: '',
  inclass: '',
  memo: '',
  basitemid: '',
  writer: '',
  tuzhiid: props.id // 关联当前图纸ID
})

// 表单验证规则
const rules = {
  no: [
    { required: true, message: '请输入物料编号', trigger: 'blur' },
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  shuliang: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  basitemid: [
    { required: true, message: '请输入物料ID', trigger: 'blur' }
  ]
}

// 获取图纸材料列表
const getTuzhicailiaoList = async () => {
  queryParams.tuzhiid = props.id
  loading.value = true
  try {
    const res = await getTuzhicailiaos(queryParams)
    tuzhicailiaoList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取图纸材料列表失败', error)
    ElMessage.error('获取图纸材料列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getTuzhicailiaoList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getTuzhicailiaoList()
}

const handleRefresh = () => {
  queryParams.pageNumber = 1
  getTuzhicailiaoList()
}

// 监听props变化，确保数据更新
watch(
  () => [props.id, props.tuzhibianhao],
  () => {
    queryParams.pageNumber = 1
    queryParams.tuzhiid = props.id
    getTuzhicailiaoList()
  },
  { immediate: true }
)

// 添加图纸材料
const handleAdd = () => {
  dialogType.value = 'add'
  resetForm()
  form.tuzhibianhao = props.tuzhibianhao // 自动填充图纸编号
  form.tuzhiid = props.id // 自动关联图纸ID
  dialogVisible.value = true
}

// 编辑图纸材料
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 取消表单
const cancelForm = () => {
  dialogVisible.value = false
  resetForm()
}

// 删除图纸材料
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除该图纸材料吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteTuzhicailiao({ id: row.id })
      ElMessage.success('删除成功')
      getTuzhicailiaoList()
    } catch (error) {
      console.error('删除图纸材料失败', error)
      ElMessage.error('删除图纸材料失败')
    }
  }).catch(() => {})
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: undefined,
    tuzhibianhao: '',
    no: '',
    spec: '',
    shuliang: '',
    weight: '',
    cailiaotype: '',
    unit: '',
    name: '',
    inclass: '',
    memo: '',
    basitemid: '',
    writer: '',
    tuzhiid: props.id
  })
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await createTuzhicailiao(form)
          ElMessage.success('添加成功')
        } else {
          await updateTuzhicailiao(form)
          ElMessage.success('编辑成功')
        }
        dialogVisible.value = false
        resetForm()
        getTuzhicailiaoList()
      } catch (error) {
        console.error('保存图纸材料失败', error)
        ElMessage.error('保存图纸材料失败')
      }
    }
  })
}

// 选择材料对话框相关
const selectMaterialDialogVisible = ref(false)
const selectMaterialQueryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  itemno: '',
  name: ''
})
const yuancailiaoList = ref([])
const selectMaterialTotal = ref(0)
const selectMaterialLoading = ref(false)

const openSelectMaterialDialog = () => {
  selectMaterialDialogVisible.value = true
  getYuancailiaoList()
}

const getYuancailiaoList = async () => {
  selectMaterialLoading.value = true
  try {
    const res = await getYuancailiaoPage(selectMaterialQueryParams)
    yuancailiaoList.value = res.data.page.list
    selectMaterialTotal.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取原材料列表失败', error)
    ElMessage.error('获取原材料列表失败')
  } finally {
    selectMaterialLoading.value = false
  }
}

const handleSelectMaterialSizeChange = (size) => {
  selectMaterialQueryParams.pageSize = size
  getYuancailiaoList()
}

const handleSelectMaterialCurrentChange = (page) => {
  selectMaterialQueryParams.pageNumber = page
  getYuancailiaoList()
}

const selectMaterial = (row) => {
  form.no = row.no
  form.name = row.name
  form.inclass = row.inclass
  form.weight = row.weight
  form.unit = row.unit
  form.basitemid = row.id
  selectMaterialDialogVisible.value = false
}

const resetSelectMaterialForm = () => {
  selectMaterialQueryParams.pageNumber = 1
  selectMaterialQueryParams.itemno = ''
  selectMaterialQueryParams.name = ''
}

// 页面初始化
onMounted(() => {
  getTuzhicailiaoList()
})

// 组件激活时刷新数据
onActivated(() => {
  getTuzhicailiaoList()
})
</script>

<style scoped>
.tuzhicailiao-management {
  padding: 20px;
}
.action-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
.ml-auto {
  margin-left: auto;
}
.search-bar {
  margin-bottom: 20px;
}
</style>