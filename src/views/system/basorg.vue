<template>
  <div class="basorg-management">
    <div class="action-bar">
      <el-input v-model="queryParams.no" placeholder="请输入客户编号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasOrgList" @keyup.enter="getBasOrgList" />
      <el-input v-model="queryParams.descr" placeholder="请输入客户名称查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getBasOrgList" @keyup.enter="getBasOrgList" />
      <el-select v-model="queryParams.type" placeholder="选择客户类型"  style="width: 200px; margin-right: 10px;" >
        <el-option v-for="item in typeLabelOptions" :key="item.id"  :label="item.value" :value="item.id" />
      </el-select>
      <el-select v-model="queryParams.area" placeholder="选择所属区域" style="width: 200px; margin-right: 10px;">
        <el-option v-for="item in areaOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <el-button type="primary" @click="getBasOrgList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增客户</el-button>
    </div>
    
    <el-table :data="basOrgList" border v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID"  />
      <el-table-column prop="no" label="客户编号" />
      <el-table-column prop="descr" label="客户名称" />
      <el-table-column prop="contactname" label="联系人" />
      <el-table-column prop="phone" label="联系电话" width="120" />
      <el-table-column prop="email" label="邮箱" width="150" />
      <el-table-column prop="type" label="客户类型" width="100">
        <template #default="{ row }">
          {{ getTypeLabel(row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="area" label="所属区域" width="100" />
      <el-table-column prop="city" label="城市" width="80" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          {{ row.status === 0 ? '正常' : '停用' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
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

    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="900px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="客户编号" prop="no">
                  <el-input v-model="form.no" placeholder="请输入客户编号" />
                </el-form-item>
                <el-form-item label="客户名称" prop="descr">
                  <el-input v-model="form.descr" placeholder="请输入客户名称" />
                </el-form-item>
                <el-form-item label="类型" prop="type">
                  <el-select v-model="form.type" placeholder="请选择客户类型" :disabled="true">
                    <el-option v-for="item in typeLabelOptions" :key="item.id" :label="item.value" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="所属区域" prop="area">
                  <el-select v-model="form.area" placeholder="请选择或输入区域" allow-create filterable>
                    <el-option v-for="item in areaOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人" prop="contactname">
                  <el-input v-model="form.contactname" placeholder="请输入联系人姓名" />
                </el-form-item>
                <el-form-item label="联系人职务" prop="contactheadship">
                  <el-input v-model="form.contactheadship" placeholder="请输入联系人职务" />
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入联系电话" />
                </el-form-item>
                <el-form-item label="传真号码" prop="fax">
                  <el-input v-model="form.fax" placeholder="请输入传真号码" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          
          <el-tab-pane label="地址信息" name="address">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="详细地址" prop="address">
                  <el-input v-model="form.address" placeholder="请输入详细地址" type="textarea" :rows="3" />
                </el-form-item>
                <el-form-item label="所在城市" prop="city">
                  <el-input v-model="form.city" placeholder="请输入所在城市" />
                </el-form-item>
                <el-form-item label="所在省份" prop="province">
                  <el-input v-model="form.province" placeholder="请输入所在省份" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所在国家" prop="country">
                  <el-input v-model="form.country" placeholder="请输入所在国家" />
                </el-form-item>
                <el-form-item label="邮政编码" prop="postalcode">
                  <el-input v-model="form.postalcode" placeholder="请输入邮政编码" />
                </el-form-item>
                <el-form-item label="电子邮箱" prop="email">
                  <el-input v-model="form.email" placeholder="请输入电子邮箱" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          
          <el-tab-pane label="财务信息" name="finance">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="开户银行" prop="bank">
                  <el-input v-model="form.bank" placeholder="请输入开户银行" />
                </el-form-item>
                <el-form-item label="银行账号" prop="bankcode">
                  <el-input v-model="form.bankcode" placeholder="请输入银行账号" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="税号" prop="taxcode">
                  <el-input v-model="form.taxcode" placeholder="请输入税号" />
                </el-form-item>
                <el-form-item label="备注信息" prop="memo">
                  <el-input v-model="form.memo" placeholder="请输入备注信息" type="textarea" :rows="3" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
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
import { getBasOrgs, getBasOrgById, createBasOrg, updateBasOrg, deleteBasOrg } from '@/api/system/basorg'

// 客户类型选项
// 取值1表示供应商,2表示运输商,3表示客户,4表仓库,10表示分厂，11表示分厂中外加工，12表示外协部，20表示部门
const typeLabelOptions = [
  { id: 1, value: '供应商' },
  { id: 2, value: '运输商' },
  { id: 3, value: '客户' },
  { id: 99, value: '其他' }
]

// 区域选项
const areaOptions = [
  '华北地区', '华东地区', '华南地区', '华中地区', '西南地区', 
  '西北地区', '东北地区', '港澳台地区', '海外地区'
]

// 获取客户类型标签
const getTypeLabel = (type) => {
  const item = typeLabelOptions.find(option => option.id === type)
  return item ? item.value : '未知'
}

// 查询参数
const queryParams = reactive({
  no: '',
  descr: '',
  type: '',
  area: '',
  pageNumber: 1,
  pageSize: 10
})

// 客户列表数据
const basOrgList = ref([])
const total = ref(0)
const loading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增客户' : '编辑客户')
const formRef = ref(null)
const activeTab = ref('basic')

const form = reactive({
  id: undefined,
  no: '',
  descr: '',
  bankcode: '',
  contactname: '',
  address: '',
  city: '',
  province: '',
  country: '',
  postalcode: '',
  phone: '',
  fax: '',
  bank: '',
  taxcode: '',
  email: '',
  isdelete: 0,
  memo: '',
  status: 0,
  type: 3,
  contactheadship: '',
  flag: null,
  area: ''
})

// 表单验证规则
const rules = {
  no: [
    { required: true, message: '请输入客户编号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  descr: [
    { required: true, message: '请输入客户名称', trigger: 'blur' },
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  bankcode: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  contactname: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  address: [
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  city: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  province: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  country: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  postalcode: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  phone: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  fax: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  bank: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  taxcode: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  memo: [
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择客户类型', trigger: 'change' },
    { type: 'number', message: '请选择有效的客户类型', trigger: ['blur', 'change'] }
  ],
  contactheadship: [
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ],
  area: [
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ]
}

// 获取客户列表
const getBasOrgList = async () => {
  loading.value = true
  try {
    const res = await getBasOrgs(queryParams)
    basOrgList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取客户列表失败', error)
    ElMessage.error('获取客户列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getBasOrgList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getBasOrgList()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: undefined,
    no: '',
    descr: '',
    bankcode: '',
    contactname: '',
    address: '',
    city: '',
    province: '',
    country: '',
    postalcode: '',
    phone: '',
    fax: '',
    bank: '',
    taxcode: '',
    email: '',
    isdelete: 0,
    memo: '',
    status: 0,
    type: 3,
    contactheadship: '',
    flag: null,
    area: ''
  })
  activeTab.value = 'basic'
}

// 刷新
const handleRefresh = () => {
  queryParams.no = ''
  queryParams.descr = ''
  queryParams.type = ''
  queryParams.area = ''
  queryParams.pageNumber = 1
  getBasOrgList()
}

// 新增客户
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

// 编辑客户
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  try {
    const res = await getBasOrgById({ id: row.id })
    Object.assign(form, res.data.basOrg)
    dialogVisible.value = true
  } catch (error) {
    console.error('获取客户详情失败', error)
    ElMessage.error('获取客户详情失败')
  }
}

// 删除客户
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除客户"${row.no}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteBasOrg({ id: row.id })
      ElMessage.success('删除成功')
      getBasOrgList()
    } catch (error) {
      console.error('删除客户失败', error)
      ElMessage.error('删除客户失败')
    }
  }).catch(() => {})
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await createBasOrg(form)
          ElMessage.success('新增成功')
        } else {
          await updateBasOrg(form)
          ElMessage.success('修改成功')
        }
        dialogVisible.value = false
        getBasOrgList()
      } catch (error) {
        console.error('保存客户失败', error)
        ElMessage.error('保存客户失败')
      }
    }
  })
}

// 页面初始化
onMounted(() => {
  getBasOrgList()
})
</script>

<style scoped>
.basorg-management {
  padding: 20px;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>