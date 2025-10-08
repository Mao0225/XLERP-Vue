<template>
  <el-dialog
    title="录入圆钢检验数据"
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
          <el-form-item label="单据号" prop="basno">
            <el-input v-model="form.basno" placeholder="单据号" readonly size="small" />
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
          <el-form-item label="力学性能抽检数(件)" prop="meInspQty">
            <el-input v-model.number="form.meInspQty" placeholder="请输入力学性能检验抽检数量" type="number" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抽检数量(件)" prop="sampleQuantity">
            <el-input v-model.number="form.sampleQuantity" placeholder="总抽检数量" type="number" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格(mm)" prop="specs">
              <el-input v-model.number="form.specs" placeholder="请输入规格(mm)" type="number" clearable size="small" step="0.01" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="长度(mm)" prop="length">
              <el-input v-model.number="form.length" placeholder="请输入长度(mm)" type="number" clearable size="small" step="0.01" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="弯曲性能" prop="bending">
            <el-input v-model="form.bending" placeholder="请输入弯曲性能" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="冲击实验" prop="impactexp">
            <el-input v-model="form.impactexp" placeholder="请输入结果" clearable size="small" />
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
                    <el-form-item :prop="chem.actualProp" :rules="rules[chem.actualProp]">
                      <el-input v-model.number="form[chem.actualProp]" :placeholder="chem.label + '实测值'" clearable size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :prop="chem.requiredProp" :rules="rules[chem.requiredProp]">
                      <el-input v-model.number="form[chem.requiredProp]" :placeholder="chem.label + '要求值'" clearable size="small" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 力学性能 -->
         <el-col :span="24">
          <el-divider content-position="left">力学性能 </el-divider>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="16">
            <el-col :span="8" v-for="mech in mechanics" :key="mech.key">
              <el-form-item :label="mech.label">
                <el-row :gutter="8">
                  <el-col :span="12">
                    <el-form-item :prop="mech.actualProp" :rules="rules[mech.actualProp]">
                      <el-input v-model.number="form[mech.actualProp]" :placeholder="mech.label + '实测值'" clearable size="small" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :prop="mech.requiredProp" :rules="rules[mech.requiredProp]">
                      <el-input v-model.number="form[mech.requiredProp]" :placeholder="mech.label + '要求值'" clearable size="small" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
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
import { updateYg } from '@/api/clmanage/cl-yg'
import { uploadFile } from '@/api/file/file'
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
  { key: 'C', label: 'C', actualProp: 'chemC', requiredProp: 'chemCRequired' },
  { key: 'Si', label: 'Si', actualProp: 'chemSi', requiredProp: 'chemSiRequired' },
  { key: 'Mn', label: 'Mn', actualProp: 'chemMn', requiredProp: 'chemMnRequired' },
  { key: 'P', label: 'P', actualProp: 'chemP', requiredProp: 'chemPRequired' },
  { key: 'S', label: 'S', actualProp: 'chemS', requiredProp: 'chemSRequired' }
]

const mechanics = [
  { key: 'tensileStrength', label: '抗拉强度', actualProp: 'mechtensileStrength', requiredProp: 'mechtensileStrengthRequired' },
  { key: 'yieldStrength', label: '屈服强度', actualProp: 'mechyieldStrength', requiredProp: 'mechyieldStrengthRequired' },
  { key: 'elongation', label: '断后伸长率', actualProp: 'mechelongation', requiredProp: 'mechelongationRequired' }
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
  chemC: '',
  chemSi: '',
  chemMn: '',
  chemP: '',
  chemS: '',
  chemCRequired: '',
  chemSiRequired: '',
  chemMnRequired: '',
  chemPRequired: '',
  chemSRequired: '',
  mechtensileStrength: '',
  mechyieldStrength: '',
  mechelongation: '',
  mechtensileStrengthRequired: '',
  mechyieldStrengthRequired: '',
  mechelongationRequired: '',
  bending: '',
  impactexp: '',
  leaveFactoryDate: '',
  detectionTime: '',
  status: '40',
  memo: '',
  checkMemo: '',
  basno: '',
  batchNo: '',
  batchNum: '',
  quantity: '',
  specs: '',
  length: '',
  sampleQuantity: 1,
  compInspQty: 1,
  meInspQty: 0,
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
  chemC: [
    { required: true, message: '请输入C含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemSi: [
    { required: true, message: '请输入Si含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemMn: [
    { required: true, message: '请输入Mn含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemP: [
    { required: true, message: '请输入P含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemS: [
    { required: true, message: '请输入S含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemCRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemSiRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemMnRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemPRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemSRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechtensileStrength: [
    { required: true, message: '请输入 抗拉强度', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechyieldStrength: [
    { required: true, message: '请输入 屈服强度', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechelongation: [
    { required: true, message: '请输入 断后伸长率', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechtensileStrengthRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechyieldStrengthRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechelongationRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  bending: [
    { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
  ],
  impactexp: [
    { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
  ],
  detectionTime: [
    { required: true, message: '请选择入厂检测日期', trigger: 'change' }
  ],
  basno: [
    { required: true, message: '单据号不能为空', trigger: 'blur' }
  ],
  memo: [
    { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
  ],
  checkMemo: [
    { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
  ],
  batchNo: [
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
  meInspQty: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  material: [
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
      chemC: newData.chemC || '',
      chemSi: newData.chemSi || '',
      chemMn: newData.chemMn || '',
      chemP: newData.chemP || '',
      chemS: newData.chemS || '',
      chemCRequired: newData.chemCRequired || '',
      chemSiRequired: newData.chemSiRequired || '',
      chemMnRequired: newData.chemMnRequired || '',
      chemPRequired: newData.chemPRequired || '',
      chemSRequired: newData.chemSRequired || '',
      mechtensileStrengthRequired: newData.mechtensileStrengthRequired || '',
      mechyieldStrengthRequired: newData.mechyieldStrengthRequired || '',
      mechelongationRequired: newData.mechelongationRequired || '',
      mechtensileStrength: newData.mechtensileStrength || '',
      mechyieldStrength: newData.mechyieldStrength || '',
      mechelongation: newData.mechelongation || '',
      leaveFactoryDate: newData.leaveFactoryDate || '',
      detectionTime: newData.detectionTime || '',
      status: newData.status || '40',
      bending: newData.bending || '',
      impactexp: newData.impactexp || '',
      memo: newData.memo || '',
      checkMemo: newData.checkMemo || '',
      basno: newData.basno || '',
      batchNo: newData.batchNo || '',
      batchNum: newData.batchNum || '',
      quantity: newData.quantity || '',
      specs: newData.specs || '',
      length: newData.length || '',
      sampleQuantity: newData.sampleQuantity || '',
      compInspQty: newData.compInspQty || 1,
      meInspQty: newData.meInspQty || 0,
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

watch(
  () => [form.compInspQty, form.meInspQty],
  () => {
    form.sampleQuantity = (form.compInspQty || 0) + (form.meInspQty || 0);
  },
  { immediate: true }
)

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
 
  Object.assign(form, {
    id: undefined,
    matRecheckNo: '',
    mafactory: '',
    matMaterial: '',
    chemC: '',
    chemSi: '',
    chemMn: '',
    chemP: '',
    chemS: '',
    chemCRequired: '',
    chemSiRequired: '',
    chemMnRequired: '',
    chemPRequired: '',
    chemSRequired: '',
    mechtensileStrengthRequired: '',
    mechyieldStrengthRequired: '',
    mechelongationRequired: '',
    mechtensileStrength: '',
    mechyieldStrength: '',
    mechelongation: '',
    leaveFactoryDate: '',
    detectionTime: '',
    status: '40',
    bending: '',
    impactexp: '',
    memo: '',
    checkMemo: '',
    basno: '',
    batchNo: '',
    batchNum: '',
    specs: '',
    length: '',
    sampleQuantity: 1,
    compInspQty: 1,
    meInspQty: 0,
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
    if (!form.basno) {
      ElMessage.error('单据号不能为空，请检查')
      return
    }
    await updateYg(form)
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

.uploaded-files {
  margin-top: 8px;
  max-height: 100px;
  overflow-y: auto;
  border: 1px solid #e8ecef;
  border-radius: 4px;
  padding: 8px;
  background: #fafafa;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  padding: 4px 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.file-name {
  color: #409eff;
  cursor: pointer;
  font-size: 12px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-name:hover {
  text-decoration: underline;
}

:deep(.el-button--text) {
  color: #f56c6c;
  padding: 0;
  font-size: 12px;
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