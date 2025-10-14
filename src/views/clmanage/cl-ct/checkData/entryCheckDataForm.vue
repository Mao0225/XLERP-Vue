<template>
  <el-dialog
    title="录入锤头检验数据"
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
          <el-form-item label="材质" prop="matMaterial">
            <el-input v-model="form.matMaterial" placeholder="请输入材质" clearable size="small" />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="检验标准" prop="standard">
            <el-input v-model="form.standard" placeholder="请输入检验标准" clearable size="small" />
          </el-form-item>
        </el-col>
        
       
        <el-col :span="12">
          <el-form-item label="批次号" prop="batchNum">
            <el-input v-model="form.batchNum" placeholder="批次号" readonly size="small" />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="抽检数量(件)" prop="sampleQuantity">
            <el-input v-model.number="form.sampleQuantity" placeholder="总抽检数量" readonly size="small" />
          </el-form-item>
        </el-col>

<!-- 尺寸信息 -->
<el-col :span="24">
  <el-card shadow="hover" class="mb-4">
    <template #header>
      <span>尺寸信息</span>
    </template>

    <!-- 孔测量模块 -->
    <el-divider content-position="left">孔测量</el-divider>
    <el-row :gutter="10">
      <!-- 孔标准尺寸 -->
      <el-col :span="6">
        <el-form-item label="孔标准尺寸" prop="kongRequired">
          <el-input 
            v-model.number="form.kongRequired" 
            placeholder="孔标准尺寸"
            type="number"
            clearable
            size="small"
          />
        </el-form-item>
      </el-col>

      <!-- 实测值 -->
      <el-col v-for="n in 5" :key="'kong'+n" :span="6">
        <el-form-item :label="'测量值' + n" :prop="'kong' + n">
          <el-input
            v-model.number="form['kong' + n]"
            placeholder="请输入孔实际测量值"
            type="number"
            clearable
            size="small"
          />
        </el-form-item>
      </el-col>

      <!-- 判断结果 -->
      <el-col :span="6">
        <el-form-item label="判断结果" prop="kongJudgmentResult">
          <el-select v-model="form.kongJudgmentResult" placeholder="请选择结果" clearable size="small">
            <el-option label="合格" value="合格" />
            <el-option label="不合格" value="不合格" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 总长测量模块 -->
    <el-divider content-position="left">总长测量</el-divider>
    <el-row :gutter="10">
      <!-- 总长标准尺寸 -->
      <el-col :span="6">
        <el-form-item label="总长标准尺寸" prop="zongChangRequired">
          <el-input 
            v-model.number="form.zongChangRequired" 
            placeholder="总长标准尺寸"
            type="number"
            clearable
            size="small"
          />
        </el-form-item>
      </el-col>

      <!-- 实测值 -->
      <el-col v-for="n in 5" :key="'zongChang'+n" :span="6">
        <el-form-item :label="'测量值' + n" :prop="'zongChang' + n">
          <el-input
            v-model.number="form['zongChang' + n]"
            placeholder="请输入总长实际测量值"
            type="number"
            clearable
            size="small"
          />
        </el-form-item>
      </el-col>

      <!-- 判断结果 -->
      <el-col :span="6">
        <el-form-item label="判断结果" prop="zongChangJudgmentResult">
          <el-select v-model="form.zongChangJudgmentResult" placeholder="请选择结果" clearable size="small">
            <el-option label="合格" value="合格" />
            <el-option label="不合格" value="不合格" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 宽测量模块 -->
    <el-divider content-position="left">宽测量</el-divider>
    <el-row :gutter="10">
      <!-- 宽标准尺寸 -->
      <el-col :span="6">
        <el-form-item label="宽标准尺寸" prop="kuanRequired">
          <el-input 
            v-model.number="form.kuanRequired" 
            placeholder="宽标准尺寸"
            type="number"
            clearable
            size="small"
          />
        </el-form-item>
      </el-col>

      <!-- 实测值 -->
      <el-col v-for="n in 5" :key="'kuan'+n" :span="6">
        <el-form-item :label="'测量值' + n" :prop="'kuan' + n">
          <el-input
            v-model.number="form['kuan' + n]"
            placeholder="请输入宽实际测量值"
            type="number"
            clearable
            size="small"
          />
        </el-form-item>
      </el-col>

      <!-- 判断结果 -->
      <el-col :span="6">
        <el-form-item label="判断结果" prop="kuanJudgmentResult">
          <el-select v-model="form.kuanJudgmentResult" placeholder="请选择结果" clearable size="small">
            <el-option label="合格" value="合格" />
            <el-option label="不合格" value="不合格" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 头宽测量模块 -->
    <el-divider content-position="left">头宽测量</el-divider>
    <el-row :gutter="10">
      <!-- 头宽标准尺寸 -->
      <el-col :span="6">
        <el-form-item label="头宽标准尺寸" prop="touKuanRequired">
          <el-input 
            v-model.number="form.touKuanRequired" 
            placeholder="头宽标准尺寸"
            type="number"
            clearable
            size="small"
          />
        </el-form-item>
      </el-col>

      <!-- 实测值 -->
      <el-col v-for="n in 5" :key="'touKuan'+n" :span="6">
        <el-form-item :label="'测量值' + n" :prop="'touKuan' + n">
          <el-input
            v-model.number="form['touKuan' + n]"
            placeholder="请输入头宽实际测量值"
            type="number"
            clearable
            size="small"
          />
        </el-form-item>
      </el-col>

      <!-- 判断结果 -->
      <el-col :span="6">
        <el-form-item label="判断结果" prop="touKuanJudgmentResult">
          <el-select v-model="form.touKuanJudgmentResult" placeholder="请选择结果" clearable size="small">
            <el-option label="合格" value="合格" />
            <el-option label="不合格" value="不合格" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

  </el-card>
</el-col>

<!-- 外形信息 -->
<el-col :span="24">
  <el-card shadow="hover" class="mb-4">
    <template #header>
      <span>外形信息</span>
    </template>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="外形标准" prop="appearanceRequired">
          <el-input 
            value="表面应光洁、平整。不应有裂纹存在" 
            readonly 
            size="small" 
          />
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item label="外形标准" prop="appearanceRequired">
        <el-input 
        v-model="form.appearanceRequired" 
        placeholder="表面应光洁、平整。不应有裂纹存在" 
        readonly 
        size="small" 
        />
        </el-form-item>

      </el-col>

      <el-col :span="6">
        <el-form-item label="判断结果" prop="appearanceJudgmentResult">
          <el-select v-model="form.appearanceJudgmentResult" placeholder="请选择结果" clearable size="small">
            <el-option label="合格" value="合格" />
            <el-option label="不合格" value="不合格" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-card>
</el-col>

<!-- 机械性能 -->
<el-col :span="24">
  <el-card shadow="hover">
    <template #header>
      <span>机械性能</span>
    </template>

    <el-divider content-position="left">重量测量</el-divider>
    <el-row :gutter="10">
      <!-- 重量标准尺寸 -->
      <el-col :span="6">
        <el-form-item label="重量标准尺寸" prop="zhongLiangRequired">
          <el-input 
            v-model.number="form.zhongLiangRequired" 
            placeholder="重量标准尺寸"
            type="number"
            clearable
            size="small"
          />
        </el-form-item>
      </el-col>

      <!-- 实测值 -->
      <el-col v-for="n in 5" :key="'zhongLiang'+n" :span="6">
        <el-form-item :label="'测量值' + n" :prop="'zhongLiang' + n">
          <el-input
            v-model.number="form['zhongLiang' + n]"
            placeholder="请输入重量实际测量值"
            type="number"
            clearable
            size="small"
          />
        </el-form-item>
      </el-col>

      <!-- 判断结果 -->
      <el-col :span="6">
        <el-form-item label="判断结果" prop="machineryJudgmentResult">
          <el-select v-model="form.machineryJudgmentResult" placeholder="请选择结果" clearable size="small">
            <el-option label="合格" value="合格" />
            <el-option label="不合格" value="不合格" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-card>
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
import { updateCt } from '@/api/clmanage/cl-ct'
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

const emit = defineEmits(['update:visible', 'success'])
const baseUrl = baseURL
const formRef = ref(null)
const submitting = ref(false)

const form = reactive({
  id: undefined,
  matRecheckNo: '',
  mafactory: '',
  matMaterial: '',
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
  mechInspQty: 1,
  appearanceRequired: '表面应光洁、平整。不应有裂纹存在',
  // 尺寸信息
kong1: '', kong2: '', kong3: '', kong4: '', kong5: '',
kongJudgmentResult: '',

zongChang1: '', zongChang2: '', zongChang3: '', zongChang4: '', zongChang5: '',
zongChangJudgmentResult: '',

kuan1: '', kuan2: '', kuan3: '', kuan4: '', kuan5: '',
kuanJudgmentResult: '',

touKuan1: '', touKuan2: '', touKuan3: '', touKuan4: '', touKuan5: '',
touKuanJudgmentResult: '',

// 外形信息
appearance: '',
appearanceJudgmentResult: '',

// 机械性能
zhongLiang1: '', zhongLiang2: '', zhongLiang3: '', zhongLiang4: '', zhongLiang5: '',
machineryJudgmentResult: '',
  material: '',
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
 yieldStrength: [
  { type: 'number', message: '屈服强度必须为数字', trigger: 'blur' }
],
tensileStrength: [
  { type: 'number', message: '抗拉强度必须为数字', trigger: 'blur' }
],
elongation: [
  { type: 'number', message: '延伸率必须为数字', trigger: 'blur' }
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

      leaveFactoryDate: newData.leaveFactoryDate || '',
      detectionTime: newData.detectionTime || '',
      status: newData.status || '40',
      memo: newData.memo || '',
      checkMemo: newData.checkMemo || '',
      basNo: newData.basNo || '',
      batchNo: newData.batchNo || '',
      batchNum: newData.batchNum || '',
      quantity: newData.quantity || '',
      sampleQuantity: newData.sampleQuantity || 1,
      compInspQty: newData.compInspQty || 1,
      mechInspQty: newData.mechInspQty || 1,
      material: newData.material || '',
      standard: newData.standard || '',
      appearanceSize: newData.appearanceSize || '',
      auditor: newData.auditor || '',
      checker: newData.checker || '',
      checkFinishTime: newData.checkFinishTime || '',
      contractNo: newData.contractNo || '',
      contractName: newData.contractName || '',
      acceptQuantity: newData.acceptQuantity || '',
      finalConclusion: newData.finalConclusion || '',
      kong1: newData.kong1 || '',
      kong2: newData.kong2 || '',
      kong3: newData.kong3 || '',
      kong4: newData.kong4 || '',
      kong5: newData.kong5 || '',
      kongJudgmentResult: newData.kongJudgmentResult || '',

      zongChang1: newData.zongChang1 || '',
      zongChang2: newData.zongChang2 || '',
      zongChang3: newData.zongChang3 || '',
      zongChang4: newData.zongChang4 || '',
      zongChang5: newData.zongChang5 || '',
      zongChangJudgmentResult: newData.zongChangJudgmentResult || '',

      kuan1: newData.kuan1 || '',
      kuan2: newData.kuan2 || '',
      kuan3: newData.kuan3 || '',
      kuan4: newData.kuan4 || '',
      kuan5: newData.kuan5 || '',
      kuanJudgmentResult: newData.kuanJudgmentResult || '',

      touKuan1: newData.touKuan1 || '',
      touKuan2: newData.touKuan2 || '',
      touKuan3: newData.touKuan3 || '',
      touKuan4: newData.touKuan4 || '',
      touKuan5: newData.touKuan5 || '',
      touKuanJudgmentResult: newData.touKuanJudgmentResult || '',

      appearance: newData.appearance || '',
      appearanceRequired: newData.appearanceRequired || '表面应光洁、平整。不应有裂纹存在',
      appearanceJudgmentResult: newData.appearanceJudgmentResult || '',

      zhongLiang1: newData.zhongLiang1 || '',
      zhongLiang2: newData.zhongLiang2 || '',
      zhongLiang3: newData.zhongLiang3 || '',
      zhongLiang4: newData.zhongLiang4 || '',
      zhongLiang5: newData.zhongLiang5 || '',
      machineryJudgmentResult: newData.machineryJudgmentResult || ''
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
    mechInspQty: 1,
    material: '',
    standard: '',
    appearanceSize: '',
    auditor: '',
    checker: '',
    checkFinishTime: '',
    contractNo: '',
    contractName: '',
    acceptQuantity: '',
    finalConclusion: '',
    kong1: '', 
    kong2: '',
    kong3: '', 
    kong4: '',
    kong5: '', 
    kongJudgmentResult: '',
    zongChang1: '', 
    zongChang2: '', 
    zongChang3: '', 
    zongChang4: '', 
    zongChang5: '', 
    zongChangJudgmentResult: '',
    kuan1: '', 
    kuan2: '', 
    kuan3: '', 
    kuan4: '', 
    kuan5: '', 
    kuanJudgmentResult: '',
    touKuan1: '', 
    touKuan2: '', 
    touKuan3: '', 
    touKuan4: '', 
    touKuan5: '', 
    touKuanJudgmentResult: '',
    appearance: '', 
    appearanceJudgmentResult: '',
    zhongLiang1: '', 
    zhongLiang2: '', 
    zhongLiang3: '', 
    zhongLiang4: '', 
    zhongLiang5: '', 
    machineryJudgmentResult: ''
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
    await updateCt(form)
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