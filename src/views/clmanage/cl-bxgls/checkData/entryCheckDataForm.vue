<template>
  <el-dialog
    title="录入不锈钢螺栓检验数据"
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
            <el-input v-model.number="form.compInspQty" placeholder="请输入抽检检验抽检数量" type="number" clearable size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抽检数量(件)" prop="sampleQuantity">
            <el-input v-model.number="form.sampleQuantity" placeholder="总抽检数量" readonly size="small" />
          </el-form-item>
        </el-col>

        <!-- 外形 -->
        <el-col :span="24">
          <el-divider content-position="left">外形</el-divider>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="16">
            <el-col :span="12" v-for="shape in shape" :key="shape.key">
              <el-form-item :label="shape.label">
                <el-row :gutter="8">
                  <el-col :span="15">
                    <el-form-item :prop="shape.actualProp" :rules="rules[shape.actualProp]">
                      <el-input v-model ="form[shape.actualProp]" :placeholder="shape.label " clearable size="small" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 尺寸 -->
        <el-col :span="24">
          <el-divider content-position="left">尺寸</el-divider>
        </el-col>

        <!-- 尺寸规格 -->
        <el-col :span="24">
          <el-row :gutter="16">
            <el-col :span="12" v-for="sizeStandard in sizeStandard" :key="sizeStandard.key">
              <el-form-item :label="sizeStandard.label">
                <el-row :gutter="8">
                  <el-col :span="15">
                    <el-form-item :prop="sizeStandard.actualProp" :rules="rules[sizeStandard.actualProp]">
                      <el-input v-model ="form[sizeStandard.actualProp]" :placeholder="sizeStandard.label " clearable size="small" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 尺寸实际测量 -->
        <el-col :span="24">
          <el-row :gutter="16">
            <el-col :span="12" v-for="size in sizeRequired" :key="size.key">
              <el-form-item :label="size.label">
                <el-row :gutter="8">
                  <el-col :span="18">
                    <el-form-item :prop="size.actualProp" :rules="rules[size.actualProp]">
                      <el-input v-model ="form[size.actualProp]" :placeholder="size.label " clearable size="small" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 尺寸平均值，判断结果 -->
        <el-col :span="24">
          <el-row :gutter="16">
            <el-col :span="12" v-for="size in size" :key="size.key">
              <el-form-item :label="size.label">
                <el-row :gutter="8">
                  <el-col :span="15">
                    <el-form-item :prop="size.actualProp" :rules="rules[size.actualProp]">
                      <el-input v-model ="form[size.actualProp]" :placeholder="size.label " clearable size="small" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 化学成分 -->
        <el-col :span="24">
          <el-divider content-position="left">化学成分</el-divider>
        </el-col>

        <!-- 化学成分规格，炉号，批号 -->
        <el-col :span="24">
          <el-row :gutter="16">
            <el-col :span="12" v-for="chem in chem" :key="chem.key">
              <el-form-item :label="chem.label">
                <el-row :gutter="8">
                  <el-col :span="15">
                    <el-form-item :prop="chem.actualProp" :rules="rules[chem.actualProp]">
                      <el-input v-model ="form[chem.actualProp]" :placeholder="chem.label " clearable size="small" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 化学成分 -->
        <el-col :span="24">
          <el-row :gutter="16">
            <el-col :span="8" v-for="chem in chemicals" :key="chem.key">
              <el-form-item :label="chem.label">
                <el-row :gutter="8">
                  <el-col :span="12">
                    <el-form-item :prop="chem.actualProp" :rules="rules[chem.actualProp]">
                      <el-input v-model.number ="form[chem.actualProp]" :placeholder="chem.label + '实测值'" clearable size="small"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :prop="chem.requiredProp" :rules="rules[chem.requiredProp]">
                      <el-input v-model.number ="form[chem.requiredProp]" :placeholder="chem.label + '要求值'" clearable size="small"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 化学成分判断结果 -->
        <el-col :span="24">
          <el-row :gutter="16">
            <el-col :span="12" v-for="chem in chemDeterminationResult" :key="chem.key">
              <el-form-item :label="chem.label">
                <el-row :gutter="8">
                  <el-col :span="20">
                    <el-form-item :prop="chem.actualProp" :rules="rules[chem.actualProp]">
                      <el-input v-model ="form[chem.actualProp]" :placeholder="chem.label " clearable size="small" />
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
import { updateBxgls } from '@/api/clmanage/cl-bxgls'
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

const shape = [
  { key: 'Standard', label: '外形规格', actualProp: 'shapeStandard' },
  { key: 'OutOfRoundness', label: '外形不圆度', actualProp: 'shapeOutOfRoundness' },
  { key: 'DeterminationResult', label: '外形判断结果', actualProp: 'shapeDeterminationResult' },
]

const sizeStandard = [
  { key: 'Standard', label: '尺寸规格', actualProp: 'sizeStandard' }
]

const sizeRequired = [
  { key: 'Required1', label: '尺寸实际测量值一', actualProp: 'sizeRequired1' },
  { key: 'Required2', label: '尺寸实际测量值二', actualProp: 'sizeRequired2' },
  { key: 'Required3', label: '尺寸实际测量值三', actualProp: 'sizeRequired3' }
]

const size = [
  { key: 'Mean', label: '尺寸平均值', actualProp: 'sizeMean' },
  { key: 'DeterminationResult', label: '尺寸判断结果', actualProp: 'sizeDeterminationResult' }
]

const chem = [
  { key: 'Standard', label: '化学成分规格', actualProp: 'chemStandard' },
  { key: 'BatchNo', label: '化学成分炉号', actualProp: 'chemBatchNo' },
  { key: 'BatchNum', label: '化学成分批号', actualProp: 'chemBatchNum' }
]

const chemicals = [
  { key: 'C', label: 'C', actualProp: 'chemC', requiredProp: 'chemCRequired' }, 
  { key: 'Si', label: 'Si', actualProp: 'chemSi', requiredProp: 'chemSiRequired' },
  { key: 'Mn', label: 'Mn', actualProp: 'chemMn', requiredProp: 'chemMnRequired' },
  { key: 'Cr', label: 'Cr', actualProp: 'chemCr', requiredProp: 'chemCrRequired' },
  { key: 'Ni', label: 'Ni', actualProp: 'chemNi', requiredProp: 'chemNiRequired' },
] 

const chemDeterminationResult = [
  { key: 'DeterminationResult', label: '化学成分判断结果', actualProp: 'chemDeterminationResult' }
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
  chemResult: '',
  chemCr: '',
  chemNi: '',
  chemCRequired: '',
  chemSiRequired: '',
  chemMnRequired: '',
  chemCrRequired: '',
  chemNiRequired: '',
  chemStandard: '',
  chemBatchNo: '',
  chemBatchNum: '',
  chemDeterminationResult: '',
  shapeStandard: '',
  shapeOutOfRoundness: '',
  shapeDeterminationResult: '',
  sizeStandard: '',
  sizeRequired1: '',
  sizeRequired2: '',
  sizeRequired3: '',
  sizeMean: '',
  sizeDeterminationResult: '',
  leaveFactoryDate: '',
  detectionTime: '',
  status: '40',
  memo: '',
  checkMemo: '',
  basNo: '',
  batchNo: '',
  batchNum: '',
  quantity: '',
  sampleQuantity: 1,
  compInspQty: 1,
  mechInspQty: 0,
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
  chemCr: [
      { required: true, message: '请输入Cr含量', trigger: 'blur' },
      { type: 'number', message: '必须为数字', trigger: 'blur' }
    ],
  chemNi: [
      { required: true, message: '请输入Ni含量', trigger: 'blur' },
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
  chemCrRequired: [
      { type: 'number', message: '必须为数字', trigger: 'blur' }
    ],
  chemNiRequired: [
      { type: 'number', message: '必须为数字', trigger: 'blur' }
    ],
  chemStandard: [
      { required: true, message: '请输入化学成分规格', trigger: 'blur' }
    ],
  chemBatchNo: [
      { required: true, message: '请输入化学成分炉号', trigger: 'blur' }
    ],
  chemBatchNum: [
      { required: true, message: '请输入化学成分批号', trigger: 'blur' }
    ],
  chemDeterminationResult: [
      { required: true, message: '请输入化学成分判定结果', trigger: 'blur' }
    ],
  shapeStandard: [
      { required: true, message: '请输入外形规格', trigger: 'blur' }
    ],
  shapeOutOfRoundness: [
      { required: true, message: '请输入外形不圆度', trigger: 'blur' }
    ],
  shapeDeterminationResult: [
      { required: true, message: '请输入外形判断结果', trigger: 'blur' }
    ],
  sizeStandard: [
      { required: true, message: '请输入尺寸规格', trigger: 'blur' }
    ],
  sizeRequired1: [
      { required: true, message: '请输入尺寸实际测量值一', trigger: 'blur' }
    ],
  sizeRequired2: [
      { required: true, message: '请输入尺寸实际测量值二', trigger: 'blur' }
    ],
  sizeRequired3: [
      { required: true, message: '请输入尺寸实际测量值三', trigger: 'blur' }
    ],
  sizeMean: [
      { required: true, message: '请输入尺寸平均值', trigger: 'blur' }
    ],
  sizeDeterminationResult: [
      { required: true, message: '请输入尺寸判断结果', trigger: 'blur' }
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
      chemDeterminationResult: newData.chemDeterminationResult || '',
      chemCr: newData.chemCr || '',
      chemNi: newData.chemNi || '',
      chemCRequired: newData.chemCRequired || '',
      chemSiRequired: newData.chemSiRequired || '',
      chemMnRequired: newData.chemMnRequired || '',
      chemCrRequired: newData.chemCrRequired || '',
      chemNiRequired: newData.chemNiRequired || '',
      chemStandard: newData.chemStandard || '',
      chemBatchNo: newData.chemBatchNo || '',
      chemBatchNum: newData.chemBatchNum || '',
      chemDeterminationResult: newData.chemDeterminationResult || '',
      shapeStandard: newData.shapeStandard || '',
      shapeOutOfRoundness: newData.shapeOutOfRoundness || '',
      shapeDeterminationResult: newData.shapeDeterminationResult || '',
      sizeStandard: newData.sizeStandard || '',
      sizeRequired1: newData.sizeRequired1 || '',
      sizeRequired2: newData.sizeRequired2 || '',
      sizeRequired3: newData.sizeRequired3 || '',
      sizeMean: newData.sizeMean || '',
      sizeDeterminationResult: newData.sizeDeterminationResult || '',
      leaveFactoryDate: newData.leaveFactoryDate || '',
      detectionTime: newData.detectionTime || '',
      status: newData.status || '40',
      memo: newData.memo || '',
      checkMemo: newData.checkMemo || '',
      basNo: newData.basNo || '',
      batchNo: newData.batchNo || '',
      batchNum: newData.batchNum || '',
      quantity: newData.quantity || '',
      sampleQuantity: newData.sampleQuantity || '',
      compInspQty: newData.compInspQty || 1,
      mechInspQty: newData.mechInspQty || 0,
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
  () => [form.compInspQty, form.mechInspQty],
  () => {
    form.sampleQuantity = (form.compInspQty || 0) + (form.mechInspQty || 0);
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
    chemResult: '',
    chemCr: '',
    chemNi: '',
    chemCRequired: '',
    chemSiRequired: '',
    chemMnRequired: '',
    chemCrRequired: '',
    chemNiRequired: '',
    chemStandard: '',
    chemBatchNo: '',
    chemBatchNum: '',
    chemDeterminationResult: '',
    shapeStandard: '',
    shapeOutOfRoundness: '',
    shapeDeterminationResult: '',
    sizeStandard: '',
    sizeRequired1: '',
    sizeRequired2: '',
    sizeRequired3: '',
    sizeMean: '',
    sizeDeterminationResult: '',
    leaveFactoryDate: '',
    detectionTime: '',
    status: '40',
    memo: '',
    checkMemo: '',
    basNo: '',
    batchNo: '',
    batchNum: '',
    sampleQuantity: 1,
    compInspQty: 1,
    mechInspQty: 0,
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
    // 重点：捕获验证错误的详细信息
    await formRef.value.validate((isValid, invalidFields) => {
      if (!isValid) {
        // 打印所有验证失败的字段（在控制台查看）
        console.error('表单验证失败的字段：', invalidFields);
        // 提取第一个失败字段的提示信息，显示给用户
        const firstErrorField = Object.keys(invalidFields)[0];
        const firstErrorMsg = invalidFields[firstErrorField][0].message;
        ElMessage.error(`验证失败：${firstErrorMsg}`);
        // 终止提交流程
        throw new Error('表单验证不通过');
      }
    });

    // 后续的单据号检查、API请求逻辑...
    if (!form.basNo) {
      ElMessage.error('单据号不能为空，请检查')
      return
    }
    await updateBxgls(form)
    emit('success')
    emit('update:visible', false)
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新数据失败详情：', error);
    // 避免重复提示（验证错误已单独处理）
    if (error.message !== '表单验证不通过') {
      ElMessage.error('更新数据失败')
    }
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