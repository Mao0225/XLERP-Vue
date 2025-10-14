<template>
  <el-dialog
    title="录入铝管检验数据"
    :model-value="visible"
    width="1200px"
    :center="true"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
    @closed="resetForm"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="custom-form">
      <el-row :gutter="16">
        <!-- 基础信息 -->
        <el-col :span="24">
          <el-divider content-position="left">基础信息</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单据号" prop="basNo">
            <el-input v-model="form.basNo" placeholder="单据号" readonly size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="复检单号" prop="matRecheckNo">
            <el-input v-model="form.matRecheckNo" placeholder="请输入复检单号" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="原材料制造商" prop="mafactory">
            <el-input
              v-model="form.mafactory"
              placeholder="选择原材料制造商"
              readonly
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="牌号" prop="matMaterial">
            <el-input v-model="form.matMaterial" placeholder="请输入牌号" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="材质" prop="material">
            <el-input v-model="form.material" placeholder="请输入材质" readonly clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号" prop="type">
            <el-input v-model="form.type" placeholder="请输入型号" readonly clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检验标准" prop="standard">
            <el-input v-model="form.standard" placeholder="请输入检验标准" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="外观尺寸" prop="appearanceSize">
            <el-select v-model="form.appearanceSize" placeholder="请选择检验结果" clearable size="small">
              <el-option label="合格" value="合格"></el-option>
              <el-option label="不合格" value="不合格"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="炉批号" prop="batchNo">
            <el-input v-model="form.batchNo" placeholder="请输入炉批号" readonly clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次号" prop="batchNum">
            <el-input v-model="form.batchNum" placeholder="批次号" readonly size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成分抽检数(件)" prop="compInspQty">
            <el-input v-model.number="form.compInspQty" placeholder="请输入成分检验抽检数量" type="number" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="力学性能抽检数(件)" prop="mechInspQty"required>
            <el-input v-model.number="form.mechInspQty" placeholder="请输入力学性能抽检数量" type="number" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抽检总数量(件)" prop="sampleQuantity"required>
            <el-input v-model.number="form.sampleQuantity" placeholder="请输入总抽检数量" type="number" clearable size="small" />
          </el-form-item>
        </el-col>


        <!-- 化学成分 -->
        <el-col :span="24">
          <el-divider content-position="left">化学成分 (%)</el-divider>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="16">
            <el-col :span="8" v-for="chem in chemicals" :key="chem.key">
              <el-form-item :label="chem.label">
                <el-row :gutter="8">
                    <el-col :span="12">
                    <el-form-item :prop="chem.requiredProp" :rules="rules[chem.requiredProp]">
                      <el-input v-model="form[chem.requiredProp]" :placeholder="chem.label + '要求值'" clearable size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :prop="chem.actualProp" :rules="rules[chem.actualProp]">
                      <el-input v-model.number="form[chem.actualProp]" :placeholder="chem.label + '实测值'" clearable size="small" />
                    </el-form-item>
                  </el-col>
                
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 力学性能 -->
        <el-col :span="24">
          <el-divider content-position="left">力学性能</el-divider>
        </el-col>
        
        <!-- 抗拉强度 -->
        <el-col :span="24">
          <el-form-item label="抗拉强度" label-width="120px">
            <el-row :gutter="16" style="width: 100%;">
              <el-col :span="6">
                <el-form-item prop="mechTSRequired" label-width="0">
                  <el-input v-model="form.mechTSRequired" placeholder="要求值" clearable size="small" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="mechTSA" label-width="0">
                  <el-input v-model.number="form.mechTSA" placeholder="实测值A" clearable size="small" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="mechTSB" label-width="0">
                  <el-input v-model.number="form.mechTSB" placeholder="实测值B" clearable size="small" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="mechTSC" label-width="0">
                  <el-input v-model.number="form.mechTSC" placeholder="实测值C" clearable size="small" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

        <!-- 伸长率 -->
        <el-col :span="24">
          <el-form-item label="伸长率" label-width="120px">
            <el-row :gutter="16" style="width: 100%;">
              <el-col :span="6">
                <el-form-item prop="mechELRequired" label-width="0">
                  <el-input v-model="form.mechELRequired" placeholder="要求值" clearable size="small" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="mechELA" label-width="0">
                  <el-input v-model.number="form.mechELA" placeholder="实测值A" clearable size="small" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="mechELB" label-width="0">
                  <el-input v-model.number="form.mechELB" placeholder="实测值B" clearable size="small" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="mechELC" label-width="0">
                  <el-input v-model.number="form.mechELC" placeholder="实测值C" clearable size="small" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

        <!-- 布氏硬度 -->
        <el-col :span="24">
          <el-form-item label="布氏硬度" label-width="120px">
            <el-row :gutter="16" style="width: 100%;">
              <el-col :span="6">
                <el-form-item prop="mechHBRequired" label-width="0">
                  <el-input v-model="form.mechHBRequired" placeholder="要求值" clearable size="small" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="mechHBA" label-width="0">
                  <el-input v-model.number="form.mechHBA" placeholder="实测值A" clearable size="small" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="mechHBB" label-width="0">
                  <el-input v-model.number="form.mechHBB" placeholder="实测值B" clearable size="small" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="mechHBC" label-width="0">
                  <el-input v-model.number="form.mechHBC" placeholder="实测值C" clearable size="small" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

        <!-- 过程信息 -->
        <el-col :span="24">
          <el-divider content-position="left">过程信息</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂检测日期" prop="leaveFactoryDate">
            <el-date-picker
              v-model="form.leaveFactoryDate"
              type="date"
              placeholder="选择出厂日期"
              value-format="YYYY-MM-DD"
              size="small"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入厂检测日期" prop="detectionTime">
            <el-date-picker
              v-model="form.detectionTime"
              type="date"
              placeholder="选择入厂日期"
              value-format="YYYY-MM-DD"
              size="small"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <!-- 总结论 -->
        <el-col :span="24">
          <el-divider content-position="left">总结论</el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最终检验结论" prop="finalConclusion">
            <el-select v-model="form.finalConclusion" placeholder="请选择检验结论" clearable size="small">
              <el-option label="合格" value="合格"></el-option>
              <el-option label="不合格" value="不合格"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检验数据录入人" prop="checkWriter">
            <el-input v-model="form.checkWriter" placeholder="请输入录入人" readonly size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请检单备注" prop="memo">
            <el-input v-model="form.memo" placeholder="请检单备注" readonly size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检验备注" prop="checkMemo">
            <el-input v-model="form.checkMemo" placeholder="请输入检验备注" clearable size="small" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:visible', false)" size="small">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting" size="small">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { updateLg } from '@/api/clmanage/cl-lg'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const chemicals = [
  { key: 'Si', label: 'Si', actualProp: 'chemSi', requiredProp: 'chemSiRequired' },
  { key: 'Fe', label: 'Fe', actualProp: 'chemFe', requiredProp: 'chemFeRequired' },
  { key: 'Cu', label: 'Cu', actualProp: 'chemCu', requiredProp: 'chemCuRequired' },
  { key: 'Mn', label: 'Mn', actualProp: 'chemMn', requiredProp: 'chemMnRequired' },
  { key: 'Mg', label: 'Mg', actualProp: 'chemMg', requiredProp: 'chemMgRequired' }
]

const emit = defineEmits(['update:visible', 'success'])
const baseUrl = baseURL
const formRef = ref(null)
const submitting = ref(false)

const form = reactive({
  id: undefined,
  matRecheckNo: '',
  mafactory: '',
  matMaterial: '',
  // 化学成分实测值
  chemSi: '',
  chemFe: '',
  chemCu: '',
  chemMn: '',
  chemMg: '',
  // 化学成分要求值
  chemSiRequired: '',
  chemFeRequired: '',
  chemCuRequired: '',
  chemMnRequired: '',
  chemMgRequired: '',
  // 力学性能
  mechInspQty: 3,
  // 抗拉强度
  mechTSRequired: '',
  mechTSA: '',
  mechTSB: '',
  mechTSC: '',
  // 伸长率
  mechELRequired: '',
  mechELA: '',
  mechELB: '',
  mechELC: '',
  // 布氏硬度
  mechHBRequired: '',
  mechHBA: '',
  mechHBB: '',
  mechHBC: '',
  
  leaveFactoryDate: '',
  detectionTime: '',
  status: '40',
  memo: '',
  checkMemo: '',
  basNo: '',
  batchNo: '',
  batchNum: '',
  quantity: '',
  sampleQuantity: 4,
  compInspQty: 1,
  material: '',
  type: '',
  standard: '',
  appearanceSize: '合格',
  auditor: '',
  checker: '',
  checkFinishTime: '',
  contractNo: '',
  contractName: '',
  acceptQuantity: '',
  finalConclusion: '合格',
  checkWriter: userStore.realName
})

const rules = reactive({
  matRecheckNo: [
    { required: true, message: '请输入复检单号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  mafactory: [
    { required: true, message: '请选择原材料制造商', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  matMaterial: [
    { required: true, message: '请输入牌号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  // 化学成分验证规则
  chemSi: [
    { required: true, message: '请输入Si含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemFe: [
    { required: true, message: '请输入Fe含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemCu: [
    { required: true, message: '请输入Cu含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemMn: [
    { required: true, message: '请输入Mn含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemMg: [
    { required: true, message: '请输入Mg含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  // 化学成分要求值
  chemSiRequired: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  chemFeRequired: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  chemCuRequired: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  chemMnRequired: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  chemMgRequired: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  // 力学性能抽检数
  mechInspQty: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  // 抗拉强度
  mechTSRequired: [
   { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  mechTSA: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechTSB: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechTSC: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  // 伸长率
  mechELRequired: [
   { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  mechELA: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechELB: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechELC: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  // 布氏硬度（非必填）
  mechHBRequired: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  mechHBA: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechHBB: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechHBC: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  
  detectionTime: [
    { required: true, message: '请选择入厂检测日期', trigger: 'change' }
  ],
  basNo: [
    { required: true, message: '单据号不能为空', trigger: 'blur' }
  ],
  memo: [
    { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
  ],
  checkMemo: [
    { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
  ],
  batchNo: [
    { required: true, message: '请输入炉批号', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  batchNum: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  quantity: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sampleQuantity: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  compInspQty: [
    { required: true, type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechInspQty: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  material: [
   { required: true, message: '请输入材质', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  type: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  standard: [
    { required: true, message: '请输入检验标准', trigger: 'change' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  appearanceSize: [
    { required: true, message: '请选择外观是否合格', trigger: 'change' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  auditor: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  checker: [
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  acceptQuantity: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  finalConclusion: [
    { required: true, message: '请选择最终检验结论', trigger: 'change' }
  ]
})

watch(() => props.initialData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    Object.assign(form, {
      id: newData.id || undefined,
      matRecheckNo: newData.matRecheckNo || '',
      mafactory: newData.mafactory || '',
      matMaterial: newData.matMaterial || '',
      // 化学成分实测值
      chemSi: newData.chemSi || '',
      chemFe: newData.chemFe || '',
      chemCu: newData.chemCu || '',
      chemMn: newData.chemMn || '',
      chemMg: newData.chemMg || '',
      // 化学成分要求值
      chemSiRequired: newData.chemSiRequired || '',
      chemFeRequired: newData.chemFeRequired || '',
      chemCuRequired: newData.chemCuRequired || '',
      chemMnRequired: newData.chemMnRequired || '',
      chemMgRequired: newData.chemMgRequired || '',
      // 力学性能
      mechInspQty: newData.mechInspQty || 3,
      // 抗拉强度
      mechTSRequired: newData.mechTSRequired || '',
      mechTSA: newData.mechTSA || '',
      mechTSB: newData.mechTSB || '',
      mechTSC: newData.mechTSC || '',
      // 伸长率
      mechELRequired: newData.mechELRequired || '',
      mechELA: newData.mechELA || '',
      mechELB: newData.mechELB || '',
      mechELC: newData.mechELC || '',
      // 布氏硬度
      mechHBRequired: newData.mechHBRequired || '',
      mechHBA: newData.mechHBA || '',
      mechHBB: newData.mechHBB || '',
      mechHBC: newData.mechHBC || '',
      
      leaveFactoryDate: newData.leaveFactoryDate || '',
      detectionTime: newData.detectionTime || '',
      status: newData.status || '40',
      memo: newData.memo || '',
      checkMemo: newData.checkMemo || '',
      basNo: newData.basNo || '',
      batchNo: newData.batchNo || '',
      batchNum: newData.batchNum || '',
      quantity: newData.quantity || '',
      sampleQuantity: newData.sampleQuantity || 4,
      compInspQty: newData.compInspQty || 1,
      material: newData.material || '',
      type: newData.type || '',
      standard: newData.standard || '',
      appearanceSize: newData.appearanceSize || '',
      auditor: newData.auditor || '',
      checker: newData.checker || '',
      checkFinishTime: newData.checkFinishTime || '',
      contractNo: newData.contractNo || '',
      contractName: newData.contractName || '',
      acceptQuantity: newData.acceptQuantity || '',
      finalConclusion: newData.finalConclusion || ''
    })
  }
}, { immediate: true })


const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
 
  Object.assign(form, {
    id: undefined,
    matRecheckNo: '',
    mafactory: '',
    matMaterial: '',
    // 化学成分实测值
    chemSi: '',
    chemFe: '',
    chemCu: '',
    chemMn: '',
    chemMg: '',
    // 化学成分要求值
    chemSiRequired: '',
    chemFeRequired: '',
    chemCuRequired: '',
    chemMnRequired: '',
    chemMgRequired: '',
    // 力学性能
    mechInspQty: 3,
    // 抗拉强度
    mechTSRequired: '',
    mechTSA: '',
    mechTSB: '',
    mechTSC: '',
    // 伸长率
    mechELRequired: '',
    mechELA: '',
    mechELB: '',
    mechELC: '',
    // 布氏硬度
    mechHBRequired: '',
    mechHBA: '',
    mechHBB: '',
    mechHBC: '',
    
    leaveFactoryDate: '',
    detectionTime: '',
    status: '40',
    memo: '',
    checkMemo: '',
    basNo: '',
    batchNo: '',
    batchNum: '',
    sampleQuantity: 4,
    compInspQty: 1,
    material: '',
    type: '',
    standard: '',
    appearanceSize: '',
    auditor: '',
    checker: '',
    checkFinishTime: '',
    contractNo: '',
    contractName: '',
    acceptQuantity: '',
    finalConclusion: ''
  })
}

const submitForm = async () => {
  if (!formRef.value) return
  submitting.value = true
  try {
    await formRef.value.validate()
    if (!form.basNo) {
      ElMessage.error('单据号不能为空，请检查')
      return
    }
    await updateLg(form)
    emit('success')
    emit('update:visible', false)
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新数据失败', error)
    ElMessage.error('更新数据失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 900px;
}

:deep(.el-dialog__header) {
  background: #f5f7fa;
  padding: 12px 16px;
  border-bottom: 1px solid #e8ecef;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-dialog__body) {
  padding: 12px 16px;
  max-height: 70vh;
  overflow-y: auto;
}

.custom-form {
  padding: 0;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
}

:deep(.el-form-item__label) {
  color: #606266;
  font-size: 13px;
  font-weight: 500;
  line-height: 30px;
}

:deep(.el-divider--horizontal) {
  margin: 12px 0;
}

:deep(.el-divider__text) {
  font-size: 13px;
  color: #409eff;
  font-weight: 600;
  background: #fff;
  padding: 0 8px;
}

:deep(.el-input--small .el-input__inner) {
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  font-size: 13px;
}

:deep(.el-date-editor--date) {
  width: 100%;
}

:deep(.el-upload) {
  display: inline-block;
}

:deep(.el-button--small) {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 4px;
}

:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

:deep(.el-dialog__footer) {
  padding: 10px 16px;
  border-top: 1px solid #e8ecef;
  background: #f5f7fa;
}

:deep(.el-textarea__inner) {
  resize: vertical;
  font-size: 12px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 95%;
  }

  .el-col:nth-child(n) {
    margin-bottom: 0;
  }
}
</style>