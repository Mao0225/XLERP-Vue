<template>
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="1400px"
      @closed="resetForm"
      destroy-on-close
    >
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-width="150px" 
        size="small"
      >
        <!-- 销售合同关联字段 -->
        <div class="form-section">
          <div class="section-title">销售合同关联字段</div>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="销售合同ID" prop="xiaoshouhetongid">
                <el-input 
                  v-model="form.xiaoshouhetongid" 
                  placeholder="请输入销售合同ID" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国网合同号" prop="guowanghetonghao">
                <el-input 
                  v-model="form.guowanghetonghao" 
                  placeholder="请输入国网合同号" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国网合同行项目号" prop="poitemid">
                <el-input 
                  v-model="form.poitemid" 
                  placeholder="请输入国网合同行项目号" 
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
  
        <!-- 生产相关字段 -->
        <div class="form-section">
          <div class="section-title">生产相关字段</div>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="生产订单编号" prop="prodorderno">
                <el-input 
                  v-model="form.prodorderno" 
                  placeholder="请输入生产订单编号" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产批次号" prop="batch">
                <el-input 
                  v-model="form.batch" 
                  placeholder="请输入生产批次号" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产工单号" prop="prodworkorder">
                <el-input 
                  v-model="form.prodworkorder" 
                  placeholder="请输入生产工单号" 
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
  
        <!-- 抽检公共信息 -->
        <div class="form-section">
          <div class="section-title">抽检公共信息</div>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="抽检批次号" prop="spotcheckbatch">
                <el-input 
                  v-model="form.spotcheckbatch" 
                  placeholder="抽检批次号" 
                  readonly
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="抽样数量(PCS)" prop="checknumber">
                <el-input 
                  v-model.number="form.checknumber" 
                  placeholder="请输入抽样数量" 
                  type="number"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批次生产总量(PCS)" prop="quantity">
                <el-input 
                  v-model.number="form.quantity" 
                  placeholder="请输入批次生产总量" 
                  type="number"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="供应商编码" prop="suppliercode">
                <el-input 
                  v-model="form.suppliercode" 
                  placeholder="请输入供应商编码" 
                  readonly
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出厂试验工序编号" prop="matflg">
                <el-input 
                  v-model="form.matflg" 
                  placeholder="请输入出厂试验工序编号" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="质量追溯码" prop="tracecode">
                <el-input 
                  v-model="form.tracecode" 
                  placeholder="请输入质量追溯码" 
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="产品名称" prop="partname">
                <el-input 
                  v-model="form.partname" 
                  placeholder="请输入产品名称" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品型号" prop="partcode">
                <el-input 
                  v-model="form.partcode" 
                  placeholder="请输入产品型号" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="规则编码" prop="rulecode">
                <el-input 
                  v-model="form.rulecode" 
                  placeholder="请输入规则编码" 
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="数据唯一标识" prop="datauniqueidentifier">
                <el-input 
                  v-model="form.datauniqueidentifier" 
                  placeholder="请输入数据唯一标识" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据上报时间" prop="acqtime">
                <el-date-picker
                  v-model="form.acqtime"
                  type="datetime"
                  placeholder="选择数据上报时间"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="remark">
                <el-input 
                  v-model="form.remark" 
                  placeholder="请输入备注" 
                  type="textarea"
                  rows="2"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
  
        <!-- 通用检测字段 -->
        <div class="form-section">
          <div class="section-title">通用检测字段</div>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="尺寸(mm)" prop="sizemm">
                <el-input 
                  v-model.number="form.sizemm" 
                  placeholder="请输入尺寸" 
                  type="number"
                  step="0.01"
                />
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="外观、表面质量" prop="appearancequality">
                <el-input 
                  v-model="form.appearancequality" 
                  placeholder="请输入外观、表面质量描述" 
                  type="textarea"
                  rows="2"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
  
        <!-- 镀锌质量检测字段 -->
        <div class="form-section">
          <div class="section-title">镀锌质量检测字段</div>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="锌层厚度(μm)" prop="zinclayerthickness">
                <el-input 
                  v-model.number="form.zinclayerthickness" 
                  placeholder="请输入锌层厚度" 
                  type="number"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="镀锌检测时间" prop="galvanizingchecktime">
                <el-date-picker
                  v-model="form.galvanizingchecktime"
                  type="datetime"
                  placeholder="选择镀锌检测时间"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="镀锌检测人" prop="galvanizingchecker">
                <el-input 
                  v-model="form.galvanizingchecker" 
                  placeholder="检测人" 
                  :value="userInfo.username"
                  readonly
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
  
        <!-- 悬垂线夹和连接金具机械试验字段 -->
        <div class="form-section">
          <div class="section-title">悬垂线夹和连接金具机械试验字段</div>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="破坏载荷(标准值,kN)" prop="breakingloadstd">
                <el-input 
                  v-model.number="form.breakingloadstd" 
                  placeholder="请输入破坏载荷标准值" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="破坏载荷(实测值,kN)" prop="breakingloadactual">
                <el-input 
                  v-model.number="form.breakingloadactual" 
                  placeholder="请输入破坏载荷实测值" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="悬垂线夹机械检测时间" prop="suspensionmechchecktime">
                <el-date-picker
                  v-model="form.suspensionmechchecktime"
                  type="datetime"
                  placeholder="选择检测时间"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="悬垂线夹机械检测人" prop="suspensionmechchecker">
                <el-input 
                  v-model="form.suspensionmechchecker" 
                  placeholder="检测人" 
                  :value="userInfo.username"
                  readonly
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
  
        <!-- 防振锤机械试验字段 -->
        <div class="form-section">
          <div class="section-title">防振锤机械试验字段</div>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="导线标称外径(mm)" prop="conductornominaldiameter">
                <el-input 
                  v-model.number="form.conductornominaldiameter" 
                  placeholder="请输入导线标称外径" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="锤头对钢绞线握力(要求值,kN)" prop="hammegripforcereq">
                <el-input 
                  v-model="form.hammegripforcereq" 
                  placeholder="请输入要求值" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="锤头对钢绞线握力(实测值,kN)" prop="hammegripforceactual">
                <el-input 
                  v-model.number="form.hammegripforceactual" 
                  placeholder="请输入实测值" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="线夹对钢绞线握力(要求值,kN)" prop="clampgripforcereq">
                <el-input 
                  v-model="form.clampgripforcereq" 
                  placeholder="请输入要求值" 
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="线夹对钢绞线握力(实测值,kN)" prop="clampgripforceactual">
                <el-input 
                  v-model.number="form.clampgripforceactual" 
                  placeholder="请输入实测值" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="防振锤机械检测时间" prop="dampermechchecktime">
                <el-date-picker
                  v-model="form.dampermechchecktime"
                  type="datetime"
                  placeholder="选择检测时间"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="防振锤机械检测人" prop="dampermechchecker">
                <el-input 
                  v-model="form.dampermechchecker" 
                  placeholder="检测人" 
                  :value="userInfo.username"
                  readonly
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
  
        <!-- 间隔棒机械试验字段 -->
        <div class="form-section">
          <div class="section-title">间隔棒机械试验字段</div>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="顺线握力(kN)" prop="axialgripforce">
                <el-input 
                  v-model.number="form.axialgripforce" 
                  placeholder="请输入顺线握力" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="扭握力矩(要求值,N.m)" prop="torquereq">
                <el-input 
                  v-model.number="form.torquereq" 
                  placeholder="请输入要求值" 
                  type="number"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="扭握力矩(实测值,N.m)" prop="torqueactual">
                <el-input 
                  v-model.number="form.torqueactual" 
                  placeholder="请输入实测值" 
                  type="number"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="线夹本体破坏载荷(要求值,kN)" prop="clampbodyloadreq">
                <el-input 
                  v-model.number="form.clampbodyloadreq" 
                  placeholder="请输入要求值" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="线夹本体破坏载荷(实测值,kN)" prop="clampbodyloadactual">
                <el-input 
                  v-model.number="form.clampbodyloadactual" 
                  placeholder="请输入实测值" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="线夹间拉力(要求值,kN)" prop="clamptensionreq">
                <el-input 
                  v-model.number="form.clamptensionreq" 
                  placeholder="请输入要求值" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="线夹间拉力(实测值,kN)" prop="clamptensionactual">
                <el-input 
                  v-model.number="form.clamptensionactual" 
                  placeholder="请输入实测值" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="线夹间压力(要求值,kN)" prop="clamppressurereq">
                <el-input 
                  v-model.number="form.clamppressurereq" 
                  placeholder="请输入要求值" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="线夹间压力(实测值,kN)" prop="clamppressureactual">
                <el-input 
                  v-model.number="form.clamppressureactual" 
                  placeholder="请输入实测值" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="向心力(要求值,kN)" prop="centripetalforcereq">
                <el-input 
                  v-model.number="form.centripetalforcereq" 
                  placeholder="请输入要求值" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="向心力(实测值,kN)" prop="centripetalforceactual">
                <el-input 
                  v-model.number="form.centripetalforceactual" 
                  placeholder="请输入实测值" 
                  type="number"
                  step="0.1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="间隔棒机械检测时间" prop="spacermechchecktime">
                <el-date-picker
                  v-model="form.spacermechchecktime"
                  type="datetime"
                  placeholder="选择检测时间"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="间隔棒机械检测人" prop="spacermechchecker">
                <el-input 
                  v-model="form.spacermechchecker" 
                  placeholder="检测人" 
                  :value="userInfo.username"
                  readonly
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
  
        <!-- 通用检测时间和检测人 -->
        <div class="form-section">
          <div class="section-title">通用检测时间和检测人</div>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item label="通用检测时间" prop="generalchecktime">
                <el-date-picker
                  v-model="form.generalchecktime"
                  type="datetime"
                  placeholder="选择通用检测时间"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="通用检测人" prop="generalchecker">
                <el-input 
                  v-model="form.generalchecker" 
                  placeholder="检测人" 
                  :value="userInfo.username"
                  readonly
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">保存</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, reactive, computed, watch, nextTick } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { addchuchangchoujian, updatechuchangchoujian } from '@/api/plchuchangchoujian/plchuchangchoujian'
  import { useUserStore } from '@/store/user'
  import { getNewNoNyName } from '@/api/system/basno'
  
  // 用户信息
  const userStore = useUserStore()
  const userInfo = computed(() => ({
    username: userStore.descr || '未知'
  }))
  
  // Props定义
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add',
      validator: (value) => ['add', 'edit'].includes(value)
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  })
  
  // Emits定义
  const emit = defineEmits(['update:visible', 'cancel'])
  
  // 弹窗显示状态
  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })
  
  // 弹窗标题
  const dialogTitle = computed(() => {
    return props.type === 'add' ? '新增出厂抽检记录' : '编辑出厂抽检记录'
  })
  
  // 响应式数据
  const formRef = ref(null)
  const submitting = ref(false)
  
  // 生成抽检批次号
  const generateSpotcheckBatch = async () => {
    try {
      const res = await getNewNoNyName('cccjjj');
      
      if (res?.code === 200) {
        console.log("获取出厂抽检检验编码成功", res.data.fullNoNyName);
        return res.data.fullNoNyName;
      }
      
      ElMessage.error(res?.msg || '获取编码失败');
      return '';
      
    } catch (error) {
      console.error('生成出厂抽检检验编码出错:', error);
      ElMessage.error('请求出厂抽检检验编码服务时发生错误');
      return '';
    }
  };
  
  // 表单数据
  const form = reactive({
    id: undefined,
    // 销售合同关联字段
    xiaoshouhetongid: '',
    guowanghetonghao: '',
    poitemid: '',
    // 生产相关字段
    prodorderno: '',
    batch: '',
    // 抽检公共信息
    spotcheckbatch: '',
    checknumber: 0,
    quantity: 0,
    suppliercode: '1000014491',
    prodworkorder: '',
    msubclassname: '电力金具', // 固定值
    msubclasscode: '60004', // 固定值
    matflg: '',
    infotypecode: 'J1002', // 固定值
    tracecode: '',
    partname: '',
    partcode: '',
    rulecode: '',
    ecode: 'NotImp', // 固定值
    sgentityid: 'NotImp', // 固定值
    datauniqueidentifier: '',
    acqtime: '',
    remark: '',
    // 通用检测字段
    sizemm: null,
    appearancequality: '',
    // 镀锌质量检测字段
    zinclayerthickness: null,
    galvanizingchecktime: '',
    galvanizingchecker: userInfo.value.username,
    // 悬垂线夹和连接金具机械试验字段
    breakingloadstd: null,
    breakingloadactual: null,
    suspensionmechchecktime: '',
    suspensionmechchecker: userInfo.value.username,
    // 防振锤机械试验字段
    conductornominaldiameter: null,
    hammegripforcereq: '',
    hammegripforceactual: null,
    clampgripforcereq: '',
    clampgripforceactual: null,
    dampermechchecktime: '',
    dampermechchecker: userInfo.value.username,
    // 间隔棒机械试验字段
    axialgripforce: null,
    torquereq: null,
    torqueactual: null,
    clampbodyloadreq: null,
    clampbodyloadactual: null,
    clamptensionreq: null,
    clamptensionactual: null,
    clamppressurereq: null,
    clamppressureactual: null,
    centripetalforcereq: null,
    centripetalforceactual: null,
    spacermechchecktime: '',
    spacermechchecker: userInfo.value.username,
    // 通用检测时间和检测人
    generalchecktime: '',
    generalchecker: userInfo.value.username
  })
  
  // 表单验证规则
  const rules = {
    xiaoshouhetongid: [
      { required: true, message: '请输入销售合同ID', trigger: 'blur' }
    ],
    guowanghetonghao: [
      { required: true, message: '请输入国网合同号', trigger: 'blur' }
    ],
    poitemid: [
      { required: true, message: '请输入国网合同行项目号', trigger: 'blur' }
    ],
    prodorderno: [
      { required: true, message: '请输入生产订单编号', trigger: 'blur' }
    ],
    batch: [
      { required: true, message: '请输入生产批次号', trigger: 'blur' }
    ],
    prodworkorder: [
      { required: true, message: '请输入生产工单号', trigger: 'blur' }
    ],
    spotcheckbatch: [
      { required: true, message: '抽检批次号不能为空', trigger: 'blur' }
    ],
    checknumber: [
      { required: true, message: '请输入抽样数量', trigger: 'blur' },
      { type: 'number', min: 1, message: '抽样数量必须大于0', trigger: 'blur' }
    ],
    quantity: [
      { required: true, message: '请输入批次生产总量', trigger: 'blur' },
      { type: 'number', min: 1, message: '批次生产总量必须大于0', trigger: 'blur' }
    ],
    suppliercode: [
      { required: true, message: '请输入供应商编码', trigger: 'blur' }
    ],
    matflg: [
      { required: true, message: '请输入出厂试验工序编号', trigger: 'blur' }
    ],
    tracecode: [
      { required: true, message: '请输入质量追溯码', trigger: 'blur' }
    ],
    partname: [
      { required: true, message: '请输入产品名称', trigger: 'blur' }
    ],
    partcode: [
      { required: true, message: '请输入产品型号', trigger: 'blur' }
    ],
    rulecode: [
      { required: true, message: '请输入规则编码', trigger: 'blur' }
    ],
    datauniqueidentifier: [
      { required: true, message: '请输入数据唯一标识', trigger: 'blur' }
    ],
    acqtime: [
      { required: true, message: '请选择数据上报时间', trigger: 'blur' }
    ]
  }
  
  // 监听表单数据变化
  // 修改表单数据监听逻辑
  watch(
  () => props.formData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      // 深拷贝数据避免引用问题
      const processedData = JSON.parse(JSON.stringify(newData));
      
      // 确保所有字段都被正确赋值
      Object.keys(form).forEach(key => {
        if (processedData.hasOwnProperty(key)) {
          form[key] = processedData[key];
        }
      });
    }
  },
  { immediate: true, deep: true }
)
  
  // 监听弹窗显示状态
  watch(
    () => props.visible,
    async (visible) => {
      if (visible && props.type === 'add') {
        // 新增时生成抽检批次号
        const batchNo = await generateSpotcheckBatch()
        form.spotcheckbatch = batchNo
        // 设置当前用户为默认检测人
        form.galvanizingchecker = userInfo.value.username
        form.suspensionmechchecker = userInfo.value.username
        form.dampermechchecker = userInfo.value.username
        form.spacermechchecker = userInfo.value.username
        form.generalchecker = userInfo.value.username
      }
    }
  )
  
  // 重置表单
  const resetForm = () => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
    
    // 重置为初始值
    Object.assign(form, {
      id: undefined,
      xiaoshouhetongid: '',
      guowanghetonghao: '',
      poitemid: '',
      prodorderno: '',
      batch: '',
      spotcheckbatch: '',
      checknumber: 0,
      quantity: 0,
      suppliercode: '1000014491',
      prodworkorder: '',
      msubclassname: '电力金具',
      msubclasscode: '60004',
      matflg: '',
      infotypecode: 'J1002',
      tracecode: '',
      partname: '',
      partcode: '',
      rulecode: '',
      ecode: 'NotImp',
      sgentityid: 'NotImp',
      datauniqueidentifier: '',
      acqtime: '',
      remark: '',
      sizemm: null,
      appearancequality: '',
      zinclayerthickness: null,
      galvanizingchecktime: '',
      galvanizingchecker: userInfo.value.username,
      breakingloadstd: null,
      breakingloadactual: null,
      suspensionmechchecktime: '',
      suspensionmechchecker: userInfo.value.username,
      conductornominaldiameter: null,
      hammegripforcereq: '',
      hammegripforceactual: null,
      clampgripforcereq: '',
      clampgripforceactual: null,
      dampermechchecktime: '',
      dampermechchecker: userInfo.value.username,
      axialgripforce: null,
      torquereq: null,
      torqueactual: null,
      clampbodyloadreq: null,
      clampbodyloadactual: null,
      clamptensionreq: null,
      clamptensionactual: null,
      clamppressurereq: null,
      clamppressureactual: null,
      centripetalforcereq: null,
      centripetalforceactual: null,
      spacermechchecktime: '',
      spacermechchecker: userInfo.value.username,
      generalchecktime: '',
      generalchecker: userInfo.value.username
    })
  }
  
  // 提交表单
  // 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    const formData = { ...form }
    
    if (props.type === 'add') {
      await addchuchangchoujian(formData)
      ElMessage.success('新增出厂抽检记录成功')
      // 新增成功后刷新父组件数据
      emit('refreshData')
    } else {
      await updatechuchangchoujian(formData)
      ElMessage.success('更新出厂抽检记录成功')
      // 编辑成功后也可以刷新一下
      emit('refreshData')
    }
    
    dialogVisible.value = false
  } catch (error) {
    console.error('保存出厂抽检记录失败:', error)
    if (error.name !== 'ValidationError') {
      ElMessage.error('保存出厂抽检记录失败')
    }
  } finally {
    submitting.value = false
  }
}
  
  // 取消按钮处理
  const handleCancel = () => {
    emit('cancel')
  }
  </script>
  
  <style scoped>
  .form-section {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
  }
  
  .section-title {
    font-weight: bold;
    margin-bottom: 15px;
    color: #1890ff;
    padding-bottom: 5px;
    border-bottom: 1px solid #e4e7ed;
  }
  
  .el-row {
    margin-bottom: 15px;
  }
  </style>