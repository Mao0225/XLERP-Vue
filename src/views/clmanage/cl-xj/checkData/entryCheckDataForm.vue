<template>
    <el-dialog
      title="录入橡胶检验数据"
      :model-value="visible"
      width="1300px"
      :center="true"
      :close-on-click-modal="false"
      @update:model-value="$emit('update:visible', $event)"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="custom-form">
        <el-row :gutter="20">
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
            <el-form-item label="检验单号" prop="inNo">
              <el-input v-model="form.inNo" placeholder="请输入检验单号" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商编码" prop="mafactoryno">
              <el-input v-model="form.mafactoryno" placeholder="供应商编码" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="mafactoryname">
              <el-input v-model="form.mafactoryname" placeholder="供应商名称" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材料名称" prop="matname">
              <el-input v-model="form.matname" placeholder="材料名称" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材质" prop="material">
              <el-input v-model="form.material" placeholder="材质" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格" prop="mattype">
              <el-input v-model="form.mattype" placeholder="规格" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试验编号" prop="testno">
              <el-input v-model="form.testno" placeholder="试验编号" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用单位" prop="matdepartment">
              <el-input v-model="form.matdepartment" placeholder="使用单位" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来料检验批次号" prop="matRecheckNo">
              <el-input v-model="form.matRecheckNo" placeholder="来料检验批次号" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行标准" prop="standard">
              <el-input v-model="form.standard" placeholder="执行标准" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来料数量" prop="quantity">
              <el-input v-model.number="form.quantity" placeholder="来料数量" type="number" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="抽检数量" prop="sampleQuantity">
              <el-input v-model="form.sampleQuantity" placeholder="抽检数量" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原材料出厂检测日期" prop="leavefactoryDate">
              <el-date-picker
                v-model="form.leavefactoryDate"
                type="date"
                placeholder="选择日期"
                value-format="YYYY-MM-DD"
                size="small"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验日期" prop="detectionTime">
              <el-date-picker
                v-model="form.detectionTime"
                type="date"
                placeholder="选择日期"
                value-format="YYYY-MM-DD"
                size="small"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
  
          <!-- 外形检测 -->
          <el-col :span="24">
            <el-divider content-position="left">外形检测</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外形检测说明" prop="appearanceSize">
              <el-input v-model="form.appearanceSize" placeholder="外形检测说明" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外形检测结果" prop="appearanceResult">
              <el-select v-model="form.appearanceResult" placeholder="请选择检测结果" clearable size="small">
                <el-option label="合格" value="合格"></el-option>
                <el-option label="不合格" value="不合格"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
  
          <!-- 长度检测 -->
          <el-col :span="24">
            <el-divider content-position="left">长度检测</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="4.8" v-for="i in 5" :key="'long' + i">
                <el-form-item :label="'测量值 ' + i" :prop="'matlongsize' + i">
                  <el-input v-model.number="form['matlongsize' + i]" placeholder="请输入测量值" type="number" step="0.01" clearable size="small" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准值" prop="matlongsizebiaozhun">
              <el-input v-model.number="form.matlongsizebiaozhun" placeholder="请输入标准值" type="number" step="0.01" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结果" prop="matlongresult">
              <el-select v-model="form.matlongresult" placeholder="请选择检测结果" clearable size="small">
                <el-option label="合格" value="合格"></el-option>
                <el-option label="不合格" value="不合格"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
  
          <!-- 宽度检测 -->
          <el-col :span="24">
            <el-divider content-position="left">宽度检测</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="4.8" v-for="i in 5" :key="'lengh' + i">
                <el-form-item :label="'测量值 ' + i" :prop="'matlenghsize' + i">
                  <el-input v-model.number="form['matlenghsize' + i]" placeholder="请输入测量值" type="number" step="0.01" clearable size="small" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准值" prop="matlenghsizebiaozhun">
              <el-input v-model.number="form.matlenghsizebiaozhun" placeholder="请输入标准值" type="number" step="0.01" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结果" prop="matlenghresult">
              <el-select v-model="form.matlenghresult" placeholder="请选择检测结果" clearable size="small">
                <el-option label="合格" value="合格"></el-option>
                <el-option label="不合格" value="不合格"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
  
          <!-- 线径检测 -->
          <el-col :span="24">
            <el-divider content-position="left">线径检测</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="4.8" v-for="i in 5" :key="'xianjing' + i">
                <el-form-item :label="'测量值 ' + i" :prop="'matxianjing' + i">
                  <el-input v-model.number="form['matxianjing' + i]" placeholder="请输入测量值" type="number" step="0.01" clearable size="small" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准值" prop="matxianjingbiaozhun">
              <el-input v-model.number="form.matxianjingbiaozhun" placeholder="请输入标准值" type="number" step="0.01" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结果" prop="matxianjingresult">
              <el-select v-model="form.matxianjingresult" placeholder="请选择检测结果" clearable size="small">
                <el-option label="合格" value="合格"></el-option>
                <el-option label="不合格" value="不合格"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
  
          <!-- 厚度检测 -->
          <el-col :span="24">
            <el-divider content-position="left">厚度检测</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="4.8" v-for="i in 5" :key="'height' + i">
                <el-form-item :label="'测量值 ' + i" :prop="'matheightsize' + i">
                  <el-input v-model.number="form['matheightsize' + i]" placeholder="请输入测量值" type="number" step="0.01" clearable size="small" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准值" prop="matheightsizebiaozhun">
              <el-input v-model.number="form.matheightsizebiaozhun" placeholder="请输入标准值" type="number" step="0.01" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结果" prop="matheightsizeresult">
              <el-select v-model="form.matheightsizeresult" placeholder="请选择检测结果" clearable size="small">
                <el-option label="合格" value="合格"></el-option>
                <el-option label="不合格" value="不合格"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
  
          <!-- 柱径检测 -->
          <el-col :span="24">
            <el-divider content-position="left">柱径检测</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="4.8" v-for="i in 5" :key="'zhujing' + i">
                <el-form-item :label="'测量值 ' + i" :prop="'matzhujingsize' + i">
                  <el-input v-model.number="form['matzhujingsize' + i]" placeholder="请输入测量值" type="number" step="0.01" clearable size="small" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准值" prop="matzhujingsizebiaozhun">
              <el-input v-model.number="form.matzhujingsizebiaozhun" placeholder="请输入标准值" type="number" step="0.01" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结果" prop="matzhujingsizeresult">
              <el-select v-model="form.matzhujingsizeresult" placeholder="请选择检测结果" clearable size="small">
                <el-option label="合格" value="合格"></el-option>
                <el-option label="不合格" value="不合格"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
  
          <!-- 柱高检测 -->
          <el-col :span="24">
            <el-divider content-position="left">柱高检测</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="4.8" v-for="i in 5" :key="'zhugao' + i">
                <el-form-item :label="'测量值 ' + i" :prop="'matzhugaosize' + i">
                  <el-input v-model.number="form['matzhugaosize' + i]" placeholder="请输入测量值" type="number" step="0.01" clearable size="small" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准值" prop="matzhugaosizebiaozhun">
              <el-input v-model.number="form.matzhugaosizebiaozhun" placeholder="请输入标准值" type="number" step="0.01" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结果" prop="matzhugaosizeresult">
              <el-select v-model="form.matzhugaosizeresult" placeholder="请选择检测结果" clearable size="small">
                <el-option label="合格" value="合格"></el-option>
                <el-option label="不合格" value="不合格"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
  
          <!-- 机械性能 -->
          <el-col :span="24">
            <el-divider content-position="left">机械性能</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="硬度值" prop="matjixiexingnengvalue">
              <el-input v-model.number="form.matjixiexingnengvalue" placeholder="硬度（邵儿）67-73" type="number" step="0.01" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="硬度检测结果" prop="matjixiexingnengresult">
              <el-select v-model="form.matjixiexingnengresult" placeholder="请选择检测结果" clearable size="small">
                <el-option label="合格" value="合格"></el-option>
                <el-option label="不合格" value="不合格"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
  
          <!-- 质量证明书上传 -->
          <el-col :span="24">
            <el-divider content-position="left">质量证明书</el-divider>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传文件">
              <el-upload
                ref="certificateUpload"
                action="/api/file/upload"
                :on-success="handleFileSuccess"
                :on-error="handleFileError"
                :on-remove="handleDeleteFile"
                :file-list="certificateFileList"
                :limit="1"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                :headers="{ 'Authorization': 'Bearer ' + userStore.token }"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    支持上传 pdf, doc, docx, jpg, jpeg, png 格式文件，最多上传1个文件
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
  
          <!-- 总结论 -->
          <el-col :span="24">
            <el-divider content-position="left">总结论</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验人" prop="checker">
              <el-input v-model="form.checker" placeholder="请输入检验人" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="memo">
              <el-input v-model="form.memo" placeholder="请输入备注" type="textarea" rows="3" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
  
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="$emit('update:visible', false)" size="small">取消</el-button>
          <el-button type="primary" @click="submitForm" size="small" :loading="submitting">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, reactive, watch, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { updateXj } from '@/api/clmanage/cl-xj'
  import { useUserStore } from '@/store/user' 
  const userStore = useUserStore()
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    initialData: { 
      type: Object,
      default: () => ({})
    }
  })
  
  const emit = defineEmits(['update:visible', 'success'])
  
  const formRef = ref(null)
  const submitting = ref(false)
  const certificateUpload = ref(null)
  const certificateFileList = ref([])
  
  const form = reactive({
    id: undefined,
    inNo: '',
    mafactoryno: '',
    mafactoryname: '',
    detectionTime: '',
    matname: '',
    material: '',
    mattype: '',
    testno: '',
    quantity: '',
    sampleQuantity: '',
    matdepartment: '',
    matRecheckNo: '',
    standard: '',
    leavefactoryDate: '',
    appearanceSize: '',
    appearanceResult: '',
    certificate: '',
    matlongsize1: '',
    matlongsize2: '',
    matlongsize3: '',
    matlongsize4: '',
    matlongsize5: '',
    matlongresult: '',
    matlenghsize1: '',
    matlenghsize2: '',
    matlenghsize3: '',
    matlenghsize4: '',
    matlenghsize5: '',
    matlenghresult: '',
    matxianjing1: '',
    matxianjing2: '',
    matxianjing3: '',
    matxianjing4: '',
    matxianjing5: '',
    matxianjingresult: '',
    matheightsize1: '',
    matheightsize2: '',
    matheightsize3: '',
    matheightsize4: '',
    matheightsize5: '',
    matheightsizeresult: '',
    matzhujingsize1: '',
    matzhujingsize2: '',
    matzhujingsize3: '',
    matzhujingsize4: '',
    matzhujingsize5: '',
    matzhujingsizeresult: '',
    matzhugaosize1: '',
    matzhugaosize2: '',
    matzhugaosize3: '',
    matzhugaosize4: '',
    matzhugaosize5: '',
    matzhugaosizeresult: '',
    matjixiexingnengvalue: '',
    matjixiexingnengresult: '',
    writeTime: '',
    status: '40',
    memo: '',
    basno: '',
    writer: userStore.realName,
    auditor: '',
    checker: userStore.realName, // 初始默认值设为登录用户
    matlongsizebiaozhun: '',
    matlenghsizebiaozhun: '',
    matxianjingbiaozhun: '',
    matheightsizebiaozhun: '',
    matzhujingsizebiaozhun: '',
    matzhugaosizebiaozhun: '',
    contractno: '',
    shijidanjia: '',
    shijiamount: '',
    danzhong: '',
    zongzhong: ''
  })
  
  // 表单验证规则
  const rules = reactive({
    detectionTime: [
      { required: true, message: '请选择检验日期', trigger: 'change' }
    ],
    standard: [
      { required: true, message: '请输入执行标准', trigger: 'blur' },
      { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
    ],
    appearanceResult: [
      { required: true, message: '请选择外形检测结果', trigger: 'change' }
    ],
    matjixiexingnengvalue: [
      { type: 'number', message: '必须为数字', trigger: 'blur' }
    ],
    matjixiexingnengresult: [
      { required: true, message: '请选择硬度检测结果', trigger: 'change' }
    ],
    checker: [
      { required: true, message: '请输入检验人', trigger: 'blur' },
      { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
    ],
    memo: [
      { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
    ]
  })
  
  // 为各尺寸检测结果添加验证规则
  for (let i = 1; i <= 5; i++) {
    rules[`matlongsize${i}`] = [
      { type: 'number', message: '必须为数字', trigger: 'blur' }
    ]
    rules[`matlenghsize${i}`] = [
      { type: 'number', message: '必须为数字', trigger: 'blur' }
    ]
    rules[`matxianjing${i}`] = [
      { type: 'number', message: '必须为数字', trigger: 'blur' }
    ]
    rules[`matheightsize${i}`] = [
      { type: 'number', message: '必须为数字', trigger: 'blur' }
    ]
    rules[`matzhujingsize${i}`] = [
      { type: 'number', message: '必须为数字', trigger: 'blur' }
    ]
    rules[`matzhugaosize${i}`] = [
      { type: 'number', message: '必须为数字', trigger: 'blur' }
    ]
  }
  
  // 标准值验证规则
  rules.matlongsizebiaozhun = [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ]
  rules.matlenghsizebiaozhun = [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ]
  rules.matxianjingbiaozhun = [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ]
  rules.matheightsizebiaozhun = [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ]
  rules.matzhujingsizebiaozhun = [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ]
  rules.matzhugaosizebiaozhun = [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ]
  
  // 各检测结果验证规则
  rules.matlongresult = [
    { required: true, message: '请选择检测结果', trigger: 'change' }
  ]
  rules.matlenghresult = [
    { required: true, message: '请选择检测结果', trigger: 'change' }
  ]
  rules.matxianjingresult = [
    { required: true, message: '请选择检测结果', trigger: 'change' }
  ]
  rules.matheightsizeresult = [
    { required: true, message: '请选择检测结果', trigger: 'change' }
  ]
  rules.matzhujingsizeresult = [
    { required: true, message: '请选择检测结果', trigger: 'change' }
  ]
  rules.matzhugaosizeresult = [
    { required: true, message: '请选择检测结果', trigger: 'change' }
  ]
  
  // 监听初始数据变化
  watch(() => props.initialData, (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      Object.assign(form, newData)
      
      // 处理证书文件
      if (newData.certificate) {
        try {
          const files = JSON.parse(newData.certificate)
          certificateFileList.value = files
        } catch (e) {
          certificateFileList.value = []
        }
      }
      if (!form.checker) {
      form.checker = userStore.realName
    }
    }
  }, { immediate: true })
  
  // 文件上传成功处理
  const handleFileSuccess = (res, file) => {
    if (res.code === 200) {
      certificateFileList.value = [
        {
          name: file.name,
          url: res.data.url
        }
      ]
      form.certificate = JSON.stringify(certificateFileList.value)
    } else {
      ElMessage.error('文件上传失败: ' + res.msg)
    }
  }
  
  // 文件上传失败处理
  const handleFileError = (err) => {
    console.error('文件上传失败', err)
    ElMessage.error('文件上传失败')
  }
  
  // 删除上传的文件
  const handleDeleteFile = () => {
    certificateFileList.value = []
    form.checker = userStore.realName
    form.certificate = ''
  }
  
  // 提交表单
  const submitForm = async () => {
    if (!formRef.value) return
    try {
      await formRef.value.validate()
      submitting.value = true
      
      // 更新状态为待审核
      form.status = '40'
      // 更新录入人
      form.writer = userStore.realName
      
      const res = await updateXj(form)
      if (res.code === 200) {
        ElMessage.success('橡胶检验记录保存成功')
        emit('success')
        emit('update:visible', false)
      } else {
        ElMessage.error(res.msg || '保存失败')
      }
    } catch (error) {
      console.error('保存橡胶检验记录失败', error)
      if (error.name !== 'Error') {
        ElMessage.error('表单验证失败，请检查输入')
      } else {
        ElMessage.error('保存橡胶检验记录失败')
      }
    } finally {
      submitting.value = false
    }
  }
  
  // 重置表单
  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
    if (certificateUpload.value) {
      certificateUpload.value.clearFiles()
    }
    certificateFileList.value = []
  }
  </script>
  
  <style scoped>
  .custom-form {
    max-height: 600px;
    overflow-y: auto;
    padding-right: 10px;
  }
  
  :deep(.el-upload-list) {
    margin-top: 5px;
  }
  </style>