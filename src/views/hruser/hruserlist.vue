<template>
  <div class="hruser-management">
    <div class="action-bar">
      <el-input v-model="queryParams.no" placeholder="请输入人员编号查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getHruserList" @keyup.enter="getHruserList" />
      <el-input v-model="queryParams.name" placeholder="请输入人员姓名查询" style="width: 200px; margin-right: 10px;"
        clearable @clear="getHruserList" @keyup.enter="getHruserList" />
      <el-select v-model="queryParams.workstatus" placeholder="选择工作状态" style="width: 200px; margin-right: 10px;">
        <el-option v-for="item in workStatusOptions" :key="item.id" :label="item.value" :value="item.id" />
      </el-select>
      <el-select v-model="queryParams.sex" placeholder="选择性别" style="width: 200px; margin-right: 10px;">
        <el-option v-for="item in sexOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <el-button type="primary" @click="getHruserList">搜索</el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon>
          <Refresh />
        </el-icon> 刷新
      </el-button>

      <el-button type="primary" style="margin-left: auto;" @click="handleAdd">新增人员</el-button>
    </div>
    
    <el-table :data="hruserList" border v-loading="loading" table-layout="auto">
      <!-- 序号 -->
       <el-table-column type="index" label="序号" width="80" />
      <!-- <el-table-column prop="id" label="ID" width="80" /> -->
      <!-- <el-table-column prop="no" label="人员编号" width="120" /> -->
      <el-table-column prop="name" label="人员姓名" width="120" />
      <el-table-column prop="sex" label="性别"  />
      <el-table-column prop="age" label="年龄"  />
      <el-table-column prop="department" label="部门名称"  />
      <el-table-column prop="duty" label="职务"  />
      
      <!-- <el-table-column prop="workstatus" label="工作状态" width="120">
        <template #default="{ row }">
          {{ getWorkStatusLabel(row.workstatus) }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="phone1" label="联系电话" width="120" /> -->
      <!-- <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          {{ row.status === 0 ? '正常' : '停用' }}
        </template>
      </el-table-column> -->
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
      width="1200px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="人员编号" prop="no">
                  <el-input v-model="form.no" placeholder="请输入人员编号" />
                </el-form-item>
                <el-form-item label="人员姓名" prop="name">
                  <el-input v-model="form.name" placeholder="请输入人员姓名" />
                </el-form-item>
                <el-form-item label="曾用名" prop="cyname">
                  <el-input v-model="form.cyname" placeholder="请输入曾用名" />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-select v-model="form.sex" placeholder="请选择性别">
                    <el-option v-for="item in sexOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                  <el-input v-model.number="form.age" placeholder="请输入年龄" type="number" />
                </el-form-item>
                <el-form-item label="出生日期" prop="birthdate">
                  <el-date-picker
                    v-model="form.birthdate"
                    type="date"
                    placeholder="选择出生日期"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="身份证号" prop="idcardno">
                  <el-input v-model="form.idcardno" placeholder="请输入身份证号" />
                </el-form-item>
                <el-form-item label="民族" prop="nation">
                  <el-input v-model="form.nation" placeholder="请输入民族" />
                </el-form-item>
                <el-form-item label="籍贯" prop="nativeplace">
                  <el-input v-model="form.nativeplace" placeholder="请输入籍贯" />
                </el-form-item>
                <el-form-item label="出生地" prop="birthaddress">
                  <el-input v-model="form.birthaddress" placeholder="请输入出生地" />
                </el-form-item>
                <el-form-item label="家庭住址" prop="familyaddress">
                  <el-input v-model="form.familyaddress" placeholder="请输入家庭住址" />
                </el-form-item>
                <el-form-item label="户口所在地" prop="accountaddress">
                  <el-input v-model="form.accountaddress" placeholder="请输入户口所在地" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="电话1" prop="phone1">
                  <el-input v-model="form.phone1" placeholder="请输入电话1" />
                </el-form-item>
                <el-form-item label="电话2" prop="phone2">
                  <el-input v-model="form.phone2" placeholder="请输入电话2" />
                </el-form-item>
                <el-form-item label="电话3" prop="phone3">
                  <el-input v-model="form.phone3" placeholder="请输入电话3" />
                </el-form-item>
                <el-form-item label="政治面貌" prop="polity">
                  <el-select v-model="form.polity" placeholder="请选择政治面貌">
                    <el-option v-for="item in polityOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item label="入党时间" prop="rddate">
                  <el-date-picker
                    v-model="form.rddate"
                    type="date"
                    placeholder="选择入党时间"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="备注信息" prop="memo">
                  <el-input v-model="form.memo" placeholder="请输入备注信息" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          
          <el-tab-pane label="工作信息" name="work">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="部门名称" prop="department">
                  <el-input v-model="form.department" placeholder="请输入部门名称" />
                </el-form-item>
                <el-form-item label="班组名称" prop="bzmc">
                  <el-input v-model="form.bzmc" placeholder="请输入班组名称" />
                </el-form-item>
                <el-form-item label="职务" prop="duty">
                  <el-input v-model="form.duty" placeholder="请输入职务" />
                </el-form-item>
                <el-form-item label="岗位名称" prop="gwname">
                  <el-input v-model="form.gwname" placeholder="请输入岗位名称" />
                </el-form-item>
                <el-form-item label="工作状态" prop="workstatus">
                  <el-select v-model="form.workstatus" placeholder="请选择工作状态">
                    <el-option v-for="item in workStatusOptions" :key="item.id" :label="item.value" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="开始工作时间" prop="beginworkdate">
                  <el-date-picker
                    v-model="form.beginworkdate"
                    type="date"
                    placeholder="选择开始工作时间"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="入本单位时间" prop="rbdwsj">
                  <el-date-picker
                    v-model="form.rbdwsj"
                    type="date"
                    placeholder="选择入本单位时间"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="退休日期" prop="endworkdate">
                  <el-date-picker
                    v-model="form.endworkdate"
                    type="date"
                    placeholder="选择退休日期"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="用工性质" prop="ygxz">
                  <el-input v-model="form.ygxz" placeholder="请输入用工性质" />
                </el-form-item>
                <el-form-item label="用工分类" prop="ygfl">
                  <el-input v-model="form.ygfl" placeholder="请输入用工分类" />
                </el-form-item>
                <el-form-item label="用工形式" prop="ygxs">
                  <el-input v-model="form.ygxs" placeholder="请输入用工形式" />
                </el-form-item>
                <el-form-item label="人员类别" prop="rylb">
                  <el-input v-model="form.rylb" placeholder="请输入人员类别" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="岗位工资" prop="gwgz">
                  <el-input v-model.number="form.gwgz" placeholder="请输入岗位工资" type="number" />
                </el-form-item>
                <el-form-item label="技能工资" prop="jngz">
                  <el-input v-model.number="form.jngz" placeholder="请输入技能工资" type="number" />
                </el-form-item>
                <el-form-item label="劳动合同编号" prop="ldhtbh">
                  <el-input v-model="form.ldhtbh" placeholder="请输入劳动合同编号" />
                </el-form-item>
                <el-form-item label="合同起始时间" prop="ldhtqssj">
                  <el-date-picker
                    v-model="form.ldhtqssj"
                    type="date"
                    placeholder="选择合同起始时间"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="合同终止时间" prop="ldhtzzsj">
                  <el-date-picker
                    v-model="form.ldhtzzsj"
                    type="date"
                    placeholder="选择合同终止时间"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="个人身份" prop="grsf">
                  <el-input v-model="form.grsf" placeholder="请输入个人身份" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          
          <el-tab-pane label="教育信息" name="education">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="学历" prop="schoolage">
                  <el-select v-model="form.schoolage" placeholder="请选择学历">
                    <el-option v-for="item in schoolageOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item label="最初学历" prop="zcxl">
                  <el-select v-model="form.zcxl" placeholder="请选择最初学历">
                    <el-option v-for="item in schoolageOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item label="学位" prop="degree">
                  <el-select v-model="form.degree" placeholder="请选择学位">
                    <el-option v-for="item in degreeOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item label="专业" prop="major">
                  <el-input v-model="form.major" placeholder="请输入专业" />
                </el-form-item>
                <el-form-item label="专业类别" prop="majorlb">
                  <el-input v-model="form.majorlb" placeholder="请输入专业类别" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="毕业院校" prop="graduateschool">
                  <el-input v-model="form.graduateschool" placeholder="请输入毕业院校" />
                </el-form-item>
                <el-form-item label="入学时间" prop="rxsj">
                  <el-date-picker
                    v-model="form.rxsj"
                    type="date"
                    placeholder="选择入学时间"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="毕业时间" prop="bysj">
                  <el-date-picker
                    v-model="form.bysj"
                    type="date"
                    placeholder="选择毕业时间"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="受教育年限" prop="educateyear">
                  <el-input v-model.number="form.educateyear" placeholder="请输入受教育年限" type="number" />
                </el-form-item>
                <el-form-item label="学习形式" prop="learningformat">
                  <el-select v-model="form.learningformat" placeholder="请选择学习形式">
                    <el-option v-for="item in learningFormatOptions" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否第一学历" prop="sffxl">
                  <el-select v-model="form.sffxl" placeholder="请选择是否第一学历">
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </el-form-item>
                <el-form-item label="专业技术职务" prop="zyjszw">
                  <el-input v-model="form.zyjszw" placeholder="请输入专业技术职务" />
                </el-form-item>
                <el-form-item label="专业技术职务等级" prop="zyjszwj">
                  <el-input v-model="form.zyjszwj" placeholder="请输入专业技术职务等级" />
                </el-form-item>
                <el-form-item label="聘任时间" prop="prsj">
                  <el-date-picker
                    v-model="form.prsj"
                    type="date"
                    placeholder="选择聘任时间"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="聘任终止时间" prop="przjsj">
                  <el-date-picker
                    v-model="form.przjsj"
                    type="date"
                    placeholder="选择聘任终止时间"
                    style="width: 100%"
                  />
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
import { getHruserList as getHrusers, getHruserById, saveHruser, updateHruser, deleteHruser } from '@/api/hruser/hruser'

// 选项配置
const sexOptions = ['男', '女']

const workStatusOptions = [
  { id: 10, value: '在职' },
  { id: 20, value: '退休' },
  { id: 30, value: '买断' }
]

const polityOptions = [
  '中共党员', '中共预备党员', '共青团员', '民革党员', '民盟盟员', 
  '民建会员', '民进会员', '农工党党员', '致公党党员', '九三学社社员', 
  '台盟盟员', '无党派人士', '群众'
]

const schoolageOptions = [
  '博士研究生', '硕士研究生', '大学本科', '大学专科', 
  '中等职业', '普通高中', '初中', '小学', '其他'
]

const degreeOptions = [
  '博士', '硕士', '学士', '无'
]

const learningFormatOptions = [
  '普通全日制', '成人教育', '自学考试', '网络教育', '其他'
]

// 获取工作状态标签
const getWorkStatusLabel = (status) => {
  const item = workStatusOptions.find(option => option.id === status)
  return item ? item.value : '未知'
}

// 查询参数
const queryParams = reactive({
  no: '',
  name: '',
  workstatus: '',
  sex: '',
  pageNumber: 1,
  pageSize: 10
})

// 人员列表数据
const hruserList = ref([])
const total = ref(0)
const loading = ref(false)

// 弹窗表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增人员' : '编辑人员')
const formRef = ref(null)
const activeTab = ref('basic')

const form = reactive({
  id: undefined,
  no: '',
  name: '',
  departmentid: '',
  nativeplace: '',
  sex: '',
  age: null,
  schoolage: '',
  major: '',
  graduateschool: '',
  familyaddress: '',
  nation: '',
  birthdate: '',
  workstatus: 10,
  polity: '',
  beginworkdate: '',
  phone1: '',
  phone2: '',
  phone3: '',
  memo: '',
  type: '',
  status: 0,
  endworkdate: '',
  duty: '',
  idcardno: '',
  flag: '',
  description: '',
  cyname: '',
  department: '',
  departmentlb: '',
  bzmc: '',
  majorlb: '',
  rxsj: '',
  bysj: '',
  sffxl: '',
  degree: '',
  educateyear: null,
  learningformat: '',
  accountaddress: '',
  birthaddress: '',
  communityname: '',
  ygxz: '',
  ygfl: '',
  rddate: '',
  rylb: '',
  gwname: '',
  gwfl: '',
  gwgzdj: '',
  gwgz: null,
  gwgztzsj: '',
  zwjb: '',
  zwprsj: '',
  zwprzzsj: '',
  zyjszw: '',
  zyjszwj: '',
  zjjszwxl: '',
  prbz: '',
  prsj: '',
  przjsj: '',
  jngzdj: '',
  jngz: null,
  jngztzsj: '',
  rbdwsj: '',
  grsf: '',
  ygxs: '',
  fyzyjrbs: '',
  cjsj: '',
  fyzysj: '',
  jdzwjb: '',
  xxsj: '',
  ldhtbh: '',
  ldhtqxlx: '',
  ldhtqssj: '',
  ldhtzzsj: '',
  zcxl: '',
  isdelete: 0
})

// 表单验证规则
const rules = {
  no: [
    { required: true, message: '请输入人员编号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入人员姓名', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  idcardno: [
    { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, 
      message: '请输入正确的身份证号码', trigger: 'blur' }
  ],
  phone1: [
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  age: [
    { type: 'number', min: 1, max: 100, message: '年龄必须在1-100之间', trigger: 'blur' }
  ]
}

// 获取人员列表
const getHruserList = async () => {
  loading.value = true
  try {
    const res = await getHrusers(queryParams)
    hruserList.value = res.data.page.list
    total.value = res.data.page.totalRow
  } catch (error) {
    console.error('获取人员列表失败', error)
    ElMessage.error('获取人员列表失败')
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  queryParams.pageSize = size
  getHruserList()
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  queryParams.pageNumber = page
  getHruserList()
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(form, {
    id: undefined,
    no: '',
    name: '',
    departmentid: '',
    nativeplace: '',
    sex: '',
    age: null,
    schoolage: '',
    major: '',
    graduateschool: '',
    familyaddress: '',
    nation: '',
    birthdate: '',
    workstatus: 10,
    polity: '',
    beginworkdate: '',
    phone1: '',
    phone2: '',
    phone3: '',
    memo: '',
    type: '',
    status: 0,
    endworkdate: '',
    duty: '',
    idcardno: '',
    flag: '',
    description: '',
    cyname: '',
    department: '',
    departmentlb: '',
    bzmc: '',
    majorlb: '',
    rxsj: '',
    bysj: '',
    sffxl: '',
    degree: '',
    educateyear: null,
    learningformat: '',
    accountaddress: '',
    birthaddress: '',
    communityname: '',
    ygxz: '',
    ygfl: '',
    rddate: '',
    rylb: '',
    gwname: '',
    gwfl: '',
    gwgzdj: '',
    gwgz: null,
    gwgztzsj: '',
    zwjb: '',
    zwprsj: '',
    zwprzzsj: '',
    zyjszw: '',
    zyjszwj: '',
    zjjszwxl: '',
    prbz: '',
    prsj: '',
    przjsj: '',
    jngzdj: '',
    jngz: null,
    jngztzsj: '',
    rbdwsj: '',
    grsf: '',
    ygxs: '',
    fyzyjrbs: '',
    cjsj: '',
    fyzysj: '',
    jdzwjb: '',
    xxsj: '',
    ldhtbh: '',
    ldhtqxlx: '',
    ldhtqssj: '',
    ldhtzzsj: '',
    zcxl: '',
    isdelete: 0
  })
  activeTab.value = 'basic'
}

// 刷新
const handleRefresh = () => {
  queryParams.no = ''
  queryParams.name = ''
  queryParams.workstatus = ''
  queryParams.sex = ''
  queryParams.pageNumber = 1
  getHruserList()
}

// 新增人员
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
}

// 编辑人员
const handleEdit = async (row) => {
  dialogType.value = 'edit'
  const res = await getHruserById({ id: row.id })
  Object.assign(form, res.data.hruser)
  dialogVisible.value = true
}

// 删除人员
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除人员"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteHruser({ id: row.id })
      ElMessage.success('删除成功')
      getHruserList()
    } catch (error) {
      console.error('删除人员失败', error)
      ElMessage.error('删除人员失败')
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
          await saveHruser(form)
          ElMessage.success('新增成功')
        } else {
          await updateHruser(form)
          ElMessage.success('修改成功')
        }
        dialogVisible.value = false
        getHruserList()
      } catch (error) {
       console.error('保存人员信息失败', error)
       ElMessage.error('保存人员信息失败')
     }
   }
 })
}

// 组件挂载时获取数据
onMounted(() => {
 getHruserList()
})
</script>

<style scoped>
.hruser-management {
 padding: 20px;
}

.action-bar {
 display: flex;
 align-items: center;
 margin-bottom: 20px;
 flex-wrap: wrap;
 gap: 10px;
}

.pagination-container {
 display: flex;
 justify-content: left;
 margin-top: 20px;
}

.el-form {
 max-height: 60vh;
 overflow-y: auto;
}

.el-form-item {
 margin-bottom: 18px;
}

.el-tabs__content {
 padding-top: 20px;
}

.el-dialog__body {
 padding: 10px 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
 .action-bar {
   flex-direction: column;
   align-items: stretch;
 }
 
 .action-bar .el-input,
 .action-bar .el-select {
   width: 100% !important;
   margin-right: 0 !important;
   margin-bottom: 10px;
 }
 
 .el-dialog {
   width: 95% !important;
   margin: 0 auto;
 }
 
 .el-col {
   margin-bottom: 10px;
 }
}

/* 表格样式优化 */
/* .el-table {
 border-radius: 8px;
 overflow: hidden;
 box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-table th {
 background-color: #f8f9fa;
 color: #606266;
 font-weight: 600;
}

.el-table td {
 padding: 12px 0;
} */

/* 按钮样式优化 */
.el-button + .el-button {
 margin-left: 8px;
}

.el-button--primary {
 background-color: #409eff;
 border-color: #409eff;
}

.el-button--primary:hover {
 background-color: #66b1ff;
 border-color: #66b1ff;
}

.el-button--danger {
 background-color: #f56c6c;
 border-color: #f56c6c;
}

.el-button--danger:hover {
 background-color: #f78989;
 border-color: #f78989;
}

/* 表单样式优化 */
.el-form-item__label {
 font-weight: 500;
 color: #606266;
}

.el-input__inner,
.el-textarea__inner,
.el-select .el-input__inner {
 border-radius: 4px;
 transition: border-color 0.3s;
}

.el-input__inner:focus,
.el-textarea__inner:focus,
.el-select .el-input__inner:focus {
 border-color: #409eff;
 box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 标签页样式 */
.el-tabs__header {
 margin-bottom: 15px;
}

.el-tabs__item {
 font-weight: 500;
 color: #606266;
}

.el-tabs__item.is-active {
 color: #409eff;
 font-weight: 600;
}

/* 分页样式 */
.el-pagination {
 text-align: center;
}

.el-pagination .el-select .el-input {
 width: auto;
}

/* 加载状态 */
.el-loading-mask {
 background-color: rgba(255, 255, 255, 0.9);
}

/* 对话框样式 */
.el-dialog__header {
 padding: 20px 20px 10px;
 border-bottom: 1px solid #ebeef5;
}

.el-dialog__title {
 font-size: 18px;
 font-weight: 600;
 color: #303133;
}

.el-dialog__footer {
 padding: 10px 20px 20px;
 text-align: right;
 border-top: 1px solid #ebeef5;
}

/* 状态标签样式 */
.status-tag {
 padding: 2px 8px;
 border-radius: 12px;
 font-size: 12px;
 font-weight: 500;
}

.status-normal {
 background-color: #f0f9ff;
 color: #1890ff;
}

.status-disabled {
 background-color: #fff2f0;
 color: #ff4d4f;
}

/* 工作状态样式 */
.work-status-active {
 color: #52c41a;
 font-weight: 500;
}

.work-status-retired {
 color: #faad14;
 font-weight: 500;
}

.work-status-buyout {
 color: #f5222d;
 font-weight: 500;
}

/* 滚动条样式 */
.el-form::-webkit-scrollbar {
 width: 6px;
}

.el-form::-webkit-scrollbar-track {
 background: #f1f1f1;
 border-radius: 3px;
}

.el-form::-webkit-scrollbar-thumb {
 background: #c1c1c1;
 border-radius: 3px;
}

.el-form::-webkit-scrollbar-thumb:hover {
 background: #a8a8a8;
}

/* 动画效果 */
/* .el-table tr {
 transition: background-color 0.3s;
}

.el-table tr:hover {
 background-color: #fafafa;
} */

.el-button {
 transition: all 0.3s;
}

.el-input__inner {
 transition: all 0.3s;
}

/* 表单项间距优化 */
.el-row {
 margin-left: -10px;
 margin-right: -10px;
}

.el-col {
 padding-left: 10px;
 padding-right: 10px;
}

/* 必填字段标识 */
.el-form-item.is-required .el-form-item__label::before {
 content: '*';
 color: #f56c6c;
 margin-right: 4px;
}

/* 错误提示样式 */
.el-form-item__error {
 font-size: 12px;
 color: #f56c6c;
 padding-top: 4px;
}

/* 禁用状态样式 */
.el-input.is-disabled .el-input__inner {
 background-color: #f5f7fa;
 border-color: #e4e7ed;
 color: #c0c4cc;
 cursor: not-allowed;
}
</style>