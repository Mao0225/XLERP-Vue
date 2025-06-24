<template>
  <div class="compact-form-container">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="compact-form">
      
      <!-- 物料基本信息 -->
      <div class="form-section">
        <div class="section-title">物料基本信息</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="物料编号" prop="materialno">
              <el-input v-model="form.materialno" placeholder="物料编号" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料名称" prop="materialname">
              <el-input v-model="form.materialname" placeholder="物料名称" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格型号" prop="spec">
              <el-input v-model="form.spec" placeholder="规格型号" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="计量单位" prop="unit">
              <el-select v-model="form.unit" placeholder="单位" clearable size="small" style="width: 100%">
                <el-option v-for="unit in unitOptions" :key="unit" :label="unit" :value="unit" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类别" prop="leibie">
              <el-input v-model="form.leibie" placeholder="类别" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="图号" prop="tuhao">
              <el-input v-model="form.tuhao" placeholder="图号" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单重" prop="weight">
              <el-input-number v-model="form.weight" :min="0" :precision="2" controls-position="right" size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 数量价格信息 -->
      <div class="form-section">
        <div class="section-title">数量价格信息</div>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="数量" prop="quantity">
              <el-input-number v-model="form.quantity" :min="0" :precision="2" controls-position="right" size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单价" prop="price">
              <el-input-number v-model="form.price" :min="0" :precision="2" controls-position="right" size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="金额" prop="totalmoney">
              <el-input-number v-model="form.totalmoney" :min="0" :precision="2" controls-position="right" disabled size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="现行价格" prop="nowprice">
              <el-input-number v-model="form.nowprice" :min="0" :precision="2" controls-position="right" size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="请领数量" prop="qingling">
              <el-input-number v-model="form.qingling" :min="0" :precision="2" controls-position="right" size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票状态" prop="fapiao">
              <el-radio-group v-model="form.fapiao" size="small">
                <el-radio :label="0">无发票</el-radio>
                <el-radio :label="1">有发票</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="盘点状态" prop="pandian">
              <el-select v-model="form.pandian" placeholder="盘点状态" clearable size="small" style="width: 100%">
                <el-option v-for="item in pandianOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 出入库信息 -->
      <div class="form-section">
        <div class="section-title">出入库信息</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="出入类型" prop="isin">
              <el-radio-group v-model="form.isin" size="small">
                <el-radio :label="1">入库</el-radio>
                <el-radio :label="2">出库</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类型" prop="flag">
              <el-select v-model="form.flag" placeholder="业务类型" clearable size="small" style="width: 100%">
                <el-option v-for="item in flagOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库" prop="store">
              <el-select v-model="form.store" placeholder="选择仓库" clearable size="small" style="width: 100%">
                <el-option v-for="store in storeOptions" :key="store" :label="store" :value="store" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="收发日期" prop="receivedate">
              <el-date-picker v-model="form.receivedate" type="datetime" placeholder="选择日期" value-format="YYYY-MM-DD HH:mm:ss" size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据号" prop="orderno">
              <el-input v-model="form.orderno" placeholder="单据号" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="子单据号" prop="childorderno">
              <el-input v-model="form.childorderno" placeholder="子单据号" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 单位人员信息 -->
      <div class="form-section">
        <div class="section-title">单位人员信息</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="送货单位" prop="deliverunit">
              <el-input v-model="form.deliverunit" placeholder="送货单位" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货单位" prop="receiveunit">
              <el-input v-model="form.receiveunit" placeholder="收货单位" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="购货单位" prop="gouhuounitname">
              <el-input v-model="form.gouhuounitname" placeholder="购货单位" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="经手人" prop="handleperson">
              <el-input v-model="form.handleperson" placeholder="经手人" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库保员" prop="username">
              <el-input v-model="form.username" placeholder="库保员" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料人" prop="lingliaoperson">
              <el-input v-model="form.lingliaoperson" placeholder="领料人" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="负责人" prop="fuzeren">
              <el-input v-model="form.fuzeren" placeholder="负责人" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检查部门" prop="jianchaunit">
              <el-input v-model="form.jianchaunit" placeholder="检查部门" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 占位 -->
          </el-col>
        </el-row>
      </div>

      <!-- 项目合同信息 -->
      <div class="form-section">
        <div class="section-title">项目合同信息</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="工程名称" prop="projectname">
              <el-input v-model="form.projectname" placeholder="工程名称" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同号" prop="contactno">
              <el-input v-model="form.contactno" placeholder="合同号" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="期间" prop="term">
              <el-input v-model="form.term" placeholder="期间" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 其他信息 -->
      <div class="form-section">
        <div class="section-title">其他信息</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="订单状态" prop="orderstatus">
              <el-select v-model="form.orderstatus" placeholder="订单状态" clearable size="small" style="width: 100%">
                <el-option v-for="item in orderStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型" prop="type">
              <el-input v-model="form.type" placeholder="类型" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运输方式" prop="transportway">
              <el-input v-model="form.transportway" placeholder="运输方式" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="备注" prop="memo">
              <el-input v-model="form.memo" type="textarea" :rows="2" placeholder="备注信息" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 占位 -->
          </el-col>
        </el-row>
      </div>

      <!-- 注释的字段（暂时隐藏） -->
      <!-- 
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="状态" clearable size="small" style="width: 100%">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规则" prop="rule">
            <el-input v-model="form.rule" placeholder="规则" clearable size="small" />
          </el-form-item>
        </el-col>
      </el-row>
      -->

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button v-if="showSaveAsDraft" type="info" @click="handleSaveDraft">保存草稿</el-button>
      </div>
      
    </el-form>
  </div>
</template>

<script>
import { useTermStore } from '@/store/term.js';
import { ElMessage } from 'element-plus';
import { cloneDeep } from 'lodash';

export default {
  name: 'PlinoutstoreForm',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    showSaveAsDraft: {
      type: Boolean,
      default: false
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {}, // Form will be initialized in initFormData
      unitOptions: ['件', '套', '个', '块', '根', '袋', '箱', '捆', '托', '纸箱'],
      storeOptions: ['原材料库', '成品库', '半成品库', '废品库', '其他库'],
      flagOptions: [
        { value: 1, label: '销售出库' },
        { value: 2, label: '领用出库' },
        { value: 3, label: '调拨出库' },
        { value: 4, label: '其它出库' },
        { value: 10, label: '一进一出帐' }
      ],
      statusOptions: [
        { value: 0, label: '正常' },
        { value: 1, label: '待审核' },
        { value: 2, label: '已完成' }
      ],
      orderStatusOptions: [
        { value: '录入', label: '录入' },
        { value: '确认', label: '确认' },
        { value: '入库', label: '入库' }
      ],
      pandianOptions: [
        { value: 0, label: '正常' },
        { value: 1, label: '盘赢' },
        { value: 2, label: '盘亏' }
      ],
      rules: {
        materialno: [{ required: true, message: '物料编号不能为空', trigger: 'blur' }],
        materialname: [{ required: true, message: '物料名称不能为空', trigger: 'blur' }],
        quantity: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
        price: [{ required: true, message: '单价不能为空', trigger: 'blur' }],
        receivedate: [{ required: true, message: '收发日期不能为空', trigger: 'change' }],
        isin: [{ required: true, message: '请选择出入类型', trigger: 'change' }],
        flag: [{ required: true, message: '请选择业务类型', trigger: 'change' }]
      }
    };
  },
  methods: {
    // 定义默认表单值（仅用于新增模式）
    getDefaultForm() {
      const termStore = useTermStore();
      console.log('termStore.term:', termStore.term);
      return {
        materialno: '',
        materialname: '',
        spec: '',
        unit: '',
        quantity: 0,
        price: 0,
        totalmoney: 0,
        isin: 1, // 默认入库
        flag: '',
        store: '',
        receivedate: '',
        status: 0, // 默认正常
        orderno: '',
        deliverunit: '',
        receiveunit: '',
        handleperson: '',
        username: '',
        projectname: '',
        contactno: '',
        leibie: '',
        tuhao: '',
        weight: 0,
        term: termStore.term || '', // 使用 store 的 term 值
        childorderno: '',
        orderstatus: '',
        type: '',
        rule: '',
        lingliaoperson: '',
        jianchaunit: '',
        qingling: 0,
        nowprice: 0,
        transportway: '',
        fuzeren: '',
        gouhuounitname: '',
        fapiao: 0, // 默认无发票
        pandian: 0, // 默认正常
        memo: ''
      };
    },
    // 初始化表单数据
    initFormData(data) {
      if (this.edit) {
        // 编辑模式：直接使用传入的 formData
        this.form = cloneDeep(data);
      } else {
        // 新增模式：使用默认值并覆盖部分传入的 formData（如果有）
        this.form = { ...this.getDefaultForm()};
      }
      this.calculateTotalMoney();
      // 重置表单验证
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate();
        }
      });
    },
    // 表单提交
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.calculateTotalMoney();
          this.$emit('submit', cloneDeep(this.form));
        } else {
          this.$message.error('请填写完整表单内容');
          return false;
        }
      });
    },
    // 重置表单
    handleReset() {
      this.initFormData({}); // 根据模式重置
    },
    // 保存草稿
    handleSaveDraft() {
      this.calculateTotalMoney();
      this.$emit('save-draft', cloneDeep(this.form));
    },
    // 计算总金额
    calculateTotalMoney() {
      if (this.form.quantity && this.form.price) {
        this.form.totalmoney = parseFloat(
          (this.form.quantity * this.form.price).toFixed(2)
        );
      } else {
        this.form.totalmoney = 0;
      }
    }
  },
  async created() {
    // 使用传入的 formData 初始化表单
    this.initFormData(this.formData);
  },
  watch: {
    formData: {
      handler(newVal) {
        this.initFormData(newVal); // formData 变化时重新初始化表单
      },
      deep: true,
      immediate: true
    },
    'form.quantity'() {
      this.calculateTotalMoney();
    },
    'form.price'() {
      this.calculateTotalMoney();
    }
  }
};
</script>

<style scoped>
.compact-form-container {
  max-width: 1000px;
  padding: 16px;
  background: #fff;
}

.compact-form {
  background: #fff;
}

.form-section {
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #fafafa;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.form-actions {
  margin-top: 20px;
  padding: 16px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 4px;
}

.form-actions .el-button {
  margin: 0 6px;
  min-width: 80px;
}

/* 表单项样式 */
.el-form-item {
  margin-bottom: 12px;
}

.el-form-item__label {
  font-size: 13px;
  color: #606266;
}

/* 紧凑样式 */
.el-input--small .el-input__inner,
.el-select--small .el-input__inner {
  height: 32px;
  line-height: 32px;
}

.el-input-number--small {
  width: 100%;
}

.el-radio {
  margin-right: 16px;
}

/* 响应式 */
@media (max-width: 768px) {
  .compact-form-container {
    padding: 12px;
  }
  
  .form-actions .el-button {
    margin: 4px 2px;
    min-width: 70px;
  }
  
  .form-section {
    padding: 12px;
  }
}
</style>