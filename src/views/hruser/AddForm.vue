<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="1200px"
    @closed="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="basic">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="人员编号" prop="no">
                <el-input v-model="form.no" placeholder="请输入人员编号" :disabled="true" />
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
                <el-input v-model.number="form.age" placeholder="自动计算" type="number" disabled />
              </el-form-item>
              <el-form-item label="出生日期" prop="birthdate">
                <el-date-picker
                  v-model="form.birthdate"
                  type="date"
                  placeholder="选择出生日期"
                  style="width: 100%"
                  @change="calculateAge"
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
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { saveHruser } from '@/api/hruser/hruser'

const props = defineProps({
  newCode: {
    type: String,
    default: ''
  },
  visible: Boolean,
  sexOptions: Array,
  workStatusOptions: Array,
  polityOptions: Array,
  schoolageOptions: Array,
  degreeOptions: Array,
  learningFormatOptions: Array
})
const dialogVisible = ref(props.visible)

const emit = defineEmits(['update:visible', 'success'])

const dialogTitle = '新增人员'
const formRef = ref(null)
const activeTab = ref('basic')

const form = reactive({
  id: undefined,
  no: props.newCode,
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

// 计算年龄
const calculateAge = () => {
  if (!form.birthdate) {
    form.age = null
    return
  }
  const birthDate = new Date(form.birthdate)
  const today = new Date('2025-10-11')
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  form.age = age > 0 ? age : null
}

watch(() => form.birthdate, calculateAge)

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.no = props.newCode
  form.birthdate = ''
  form.age = null
  // 重置其他字段到默认值...
  activeTab.value = 'basic'
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await saveHruser(form)
        ElMessage.success('新增成功')
        handleClose()
        emit('success')
      } catch (error) {
        console.error('保存人员信息失败', error)
        ElMessage.error('保存人员信息失败')
      }
    }
  })
}

watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal) {
    form.no = props.newCode
  }
})

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
  emit('update:visible', false)
  
}
</script>

<style scoped>
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

.el-row {
  margin-left: -10px;
  margin-right: -10px;
}

.el-col {
  padding-left: 10px;
  padding-right: 10px;
}

.el-form-item.is-required .el-form-item__label::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.el-form-item__error {
  font-size: 12px;
  color: #f56c6c;
  padding-top: 4px;
}

.el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}

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

@media (max-width: 768px) {
  .el-dialog {
    width: 95% !important;
    margin: 0 auto;
  }
  
  .el-col {
    margin-bottom: 10px;
  }
}
</style>