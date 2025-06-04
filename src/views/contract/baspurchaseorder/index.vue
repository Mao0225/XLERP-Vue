<template>
  <div class="purchaseorder-management">
    <div class="action-bar">
      <el-input v-model="queryParams.poNo" placeholder="请输入采购订单号搜索" style="width: 200px; margin-right: 10px;" clearable
        @clear="getPurchaseOrderList()" @keyup.enter="getPurchaseOrderList()" />
      <el-button type="primary" @click="getPurchaseOrderList()">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>
      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增采购订单</el-button>
    </div>

    <el-table :data="purchaseOrderList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="poNo" label="采购订单编码" width="150" />
      <el-table-column prop="poItemNo" label="行项目号" width="120" />
      <el-table-column prop="subclassName" label="种类名称" width="120" />
      <el-table-column prop="conName" label="合同名称" width="200" show-overflow-tooltip />
      <el-table-column prop="buyerName" label="采购方公司" width="180" show-overflow-tooltip />
      <el-table-column prop="materialDesc" label="物料描述" width="200" show-overflow-tooltip />
      <el-table-column prop="amount" label="采购数量" width="100" />
      <el-table-column prop="prjName" label="工程项目" width="180" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-model:current-page="queryParams.pageNumber" v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 采购订单表单对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="80%" @closed="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购订单编码" prop="poNo">
              <el-input v-model="form.poNo" placeholder="请输入采购订单编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行项目号" prop="poItemNo">
              <el-input v-model="form.poItemNo" placeholder="请输入行项目号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="种类编码" prop="subclassCode">
              <el-input v-model="form.subclassCode" placeholder="请输入种类编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="种类名称" prop="subclassName">
              <el-input v-model="form.subclassName" placeholder="请输入种类名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同序号" prop="conCode">
              <el-input v-model="form.conCode" placeholder="请输入合同序号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="conName">
              <el-input v-model="form.conName" placeholder="请输入合同名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购方公司名称" prop="buyerName">
              <el-input v-model="form.buyerName" placeholder="请输入采购方公司名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购方公司编码" prop="buyerCode">
              <el-input v-model="form.buyerCode" placeholder="请输入采购方公司编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物料编码" prop="materialCode">
              <el-input v-model="form.materialCode" placeholder="请输入物料编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购数量" prop="amount">
              <el-input v-model="form.amount" placeholder="请输入采购数量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="物料描述" prop="materialDesc">
              <el-input v-model="form.materialDesc" type="textarea" placeholder="请输入物料描述" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目序号" prop="prjCode">
              <el-input v-model="form.prjCode" placeholder="请输入项目序号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工程项目名称" prop="prjName">
              <el-input v-model="form.prjName" placeholder="请输入工程项目名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物资编码" prop="matCode">
              <el-input v-model="form.matCode" placeholder="请输入物资编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同包号" prop="pkgNo">
              <el-input v-model="form.pkgNo" placeholder="请输入合同包号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="物资大类编码" prop="matMaxCode">
              <el-input v-model="form.matMaxCode" placeholder="请输入物资大类编码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物资中类编码" prop="matMedCode">
              <el-input v-model="form.matMedCode" placeholder="请输入物资中类编码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物资小类编码" prop="matMinCode">
              <el-input v-model="form.matMinCode" placeholder="请输入物资小类编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="物资大类名称" prop="matMaxName">
              <el-input v-model="form.matMaxName" placeholder="请输入物资大类名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物资中类名称" prop="matMedName">
              <el-input v-model="form.matMedName" placeholder="请输入物资中类名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物资小类名称" prop="matMinName">
              <el-input v-model="form.matMinName" placeholder="请输入物资小类名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="固化ID描述" prop="extDes">
              <el-input v-model="form.extDes" type="textarea" placeholder="请输入固化ID描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getBasPurchaseOrders,
  getBasPurchaseOrderById,
  createBasPurchaseOrder,
  updateBasPurchaseOrder,
  deleteBasPurchaseOrder
} from '@/api/contract/baspurchaseorder'

// 查询参数
const queryParams = reactive({
  poNo: '',
  pageNumber: 1,
  pageSize: 10,
})

// 采购订单列表数据
const purchaseOrderList = ref([])
const total = ref(0)
const loading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增采购订单' : '编辑采购订单')
const formRef = ref(null)
const form = reactive({
  id: undefined,
  poNo: '',
  poItemNo: '',
  poItemId: '',
  subclassCode: '',
  subclassName: '',
  conCode: '',
  conName: '',
  buyerName: '',
  buyerCode: '',
  materialCode: '',
  materialDesc: '',
  amount: '',
  sellerConCode: '',
  serialNumber: '',
  sellerSignTime: '',
  conType: undefined,
  prjCode: '',
  prjName: '',
  matCode: '',
  fixedTechId: '',
  pkgNo: '',
  bidBatCode: '',
  extDes: '',
  matMaxCode: '',
  matMedCode: '',
  matMinCode: '',
  matMaxName: '',
  matMedName: '',
  matMinName: '',
  modifyTime: '',
})

// 表单验证规则
const rules = {
  poNo: [
    { required: true, message: '请输入采购订单编码', trigger: 'blur' },
    { min: 1, max: 48, message: '长度在 1 到 48 个字符', trigger: 'blur' },
  ],
  subclassName: [
    { required: true, message: '请输入种类名称', trigger: 'blur' },
    { min: 1, max: 48, message: '长度在 1 到 48 个字符', trigger: 'blur' },
  ],
  conName: [
    { max: 200, message: '合同名称长度不能超过 200 个字符', trigger: 'blur' },
  ],
  buyerName: [
    { max: 200, message: '采购方公司名称长度不能超过 200 个字符', trigger: 'blur' },
  ],
  materialDesc: [
    { max: 255, message: '物料描述长度不能超过 255 个字符', trigger: 'blur' },
  ],
  extDes: [
    { max: 2400, message: '固化ID描述长度不能超过 2400 个字符', trigger: 'blur' },
  ],
}

// 获取采购订单列表
const getPurchaseOrderList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
    }
    console.log('请求参数:', params)
    const res = await getBasPurchaseOrders(params)
    console.log('后端返回数据:', res)
    if (res.success) {
      purchaseOrderList.value = res.data.page.list
      total.value = res.data.page.totalRow
      console.log('采购订单列表:', purchaseOrderList.value)
      console.log('总记录数:', total.value)
    } else {
      ElMessage.error(res.msg || '获取采购订单列表失败')
    }
  } catch (error) {
    console.error('获取采购订单列表失败:', error)
    ElMessage.error('获取采购订单列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNumber = 1
  console.log('分页大小变更:', queryParams.pageSize)
  getPurchaseOrderList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  console.log('当前页变更:', queryParams.pageNumber)
  getPurchaseOrderList()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.keys(form).forEach(key => {
    if (key === 'id' || key === 'conType') {
      form[key] = undefined
    } else {
      form[key] = ''
    }
  })
}

// 新增采购订单
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

// 编辑采购订单
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  try {
    const res = await getBasPurchaseOrderById({ id: row.id })
    console.log('获取采购订单信息:', res)
    if (res.success) {
      Object.assign(form, res.data.basPurchaseOrder)
      dialogVisible.value = true
    } else {
      ElMessage.error(res.msg || '获取采购订单信息失败')
    }
  } catch (error) {
    console.error('获取采购订单信息失败:', error)
    ElMessage.error('获取采购订单信息失败')
  }
}

// 删除采购订单
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除采购订单"${row.poNo}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await deleteBasPurchaseOrder({ id: row.id })
        if (res.success) {
          ElMessage.success('删除成功')
          getPurchaseOrderList()
        } else {
          ElMessage.error(res.msg || '删除采购订单失败')
        }
      } catch (error) {
        console.error('删除采购订单失败:', error)
        ElMessage.error('删除采购订单失败')
      }
    })
    .catch(() => { })
}

const handleRefresh = () => {
  queryParams.poNo = ''
  queryParams.pageNumber = 1
  getPurchaseOrderList()
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const submitForm = { ...form }
        console.log('提交表单数据:', submitForm)
        if (dialogType.value === 'add') {
          const res = await createBasPurchaseOrder(submitForm)
          if (res.success) {
            ElMessage.success('新增成功')
          } else {
            ElMessage.error(res.msg || '新增采购订单失败')
          }
        } else {
          const res = await updateBasPurchaseOrder(submitForm)
          if (res.success) {
            ElMessage.success('修改成功')
          } else {
            ElMessage.error(res.msg || '修改采购订单失败')
          }
        }
        dialogVisible.value = false
        getPurchaseOrderList()
      } catch (error) {
        console.error('保存采购订单失败:', error)
        ElMessage.error('保存采购订单失败')
      }
    }
  })
}

// 页面初始化
onMounted(() => {
  getPurchaseOrderList()
})
</script>

<style scoped>
.purchaseorder-management {
  padding: 20px;
}

.action-bar {
  display: flex;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>