<template>
  <div class="compact-form-container">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="compact-form">
      <!-- 入库主要信息 -->
      <div class="form-section">
        <div class="section-title">入库主要信息</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="单据号" prop="orderno">
              <el-input v-model="form.orderno" placeholder="单据号" readonly size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收发日期" prop="receivedate">
              <el-date-picker v-model="form.receivedate" type="datetime" placeholder="选择日期" value-format="YYYY-MM-DD HH:mm:ss" size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="送货单位" prop="deliverunit">
              <el-input v-model="form.deliverunit" placeholder="送货单位" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="仓库" prop="store">
              <el-select v-model="form.store" placeholder="选择仓库" clearable size="small" style="width: 100%">
                <el-option v-for="store in storeOptions" :key="store" :label="store" :value="store" />
              </el-select>
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
            <el-form-item label="经手人" prop="handleperson">
              <el-input v-model="form.handleperson" placeholder="经手人" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 物料信息 -->
      <div class="form-section">
        <div class="section-title">物料信息</div>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="物料编号" prop="currentMaterial.materialno">
              <el-input v-model="currentMaterial.materialno" placeholder="物料编号" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料名称" prop="currentMaterial.materialname">
              <el-input v-model="currentMaterial.materialname" placeholder="点击选择物料" readonly @click="selectProduct">
                <template #append>
                  <el-button @click="selectProduct">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格型号" prop="currentMaterial.spec">
              <el-input v-model="currentMaterial.spec" placeholder="规格型号" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计量单位" prop="currentMaterial.unit">
              <el-select v-model="currentMaterial.unit" placeholder="单位" clearable size="small" style="width: 100%" allow-create filterable>
                <el-option v-for="unit in unitOptions" :key="unit" :label="unit" :value="unit" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-form-item label="数量" prop="currentMaterial.quantity">
              <el-input-number v-model="currentMaterial.quantity" :min="0" :precision="2" controls-position="right" size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单价" prop="currentMaterial.price">
              <el-input-number v-model="currentMaterial.price" :min="0" :precision="2" controls-position="right" size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="金额" prop="currentMaterial.totalmoney">
              <el-input-number v-model="currentMaterial.totalmoney" :min="0" :precision="2" controls-position="right" disabled size="small" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="addMaterial">添加物料</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 物料列表 -->
      <div class="form-section">
        <div class="section-title">物料列表</div>
        <el-table :data="form.materials" border style="width: 100%">
          <el-table-column prop="materialno" label="物料编号" width="120" />
          <el-table-column prop="materialname" label="物料名称" width="150" />
          <el-table-column prop="spec" label="规格型号" width="120" />
          <el-table-column prop="unit" label="计量单位" width="100" />
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column prop="price" label="单价" width="100" />
          <el-table-column prop="totalmoney" label="金额" width="100" />
          <el-table-column label="操作" width="100">
            <template #default="{ $index }">
              <el-button type="danger" size="small" @click="removeMaterial($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button v-if="showSaveAsDraft" type="info" @click="handleSaveDraft">保存草稿</el-button>
      </div>
    </el-form>

    <ProductSelector v-model="productSelectorVisible" @select="handleProductSelect" />
  </div>
</template>

<script>
import { useTermStore } from '@/store/term.js';
import { cloneDeep } from 'lodash';
import ProductSelector from './ProductSelector.vue';

export default {
  components: { ProductSelector },
  name: 'InboundForm',
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
      productSelectorVisible: false,
      form: {},
      currentMaterial: {
        materialno: '',
        materialname: '',
        spec: '',
        unit: '',
        quantity: 0,
        price: 0,
        totalmoney: 0
      },
      unitOptions: ['件', '套', '个', '块', '根', '袋', '箱', '捆', '托', '纸箱'],
      storeOptions: ['原材料库', '成品库', '半成品库', '废品库', '其他库'],
      flagOptions: [
        { value: 1, label: '采购入库' },
        { value: 2, label: '调拨入库' },
        { value: 3, label: '其他入库' }
      ],
      rules: {
        orderno: [{ required: true, message: '单据号不能为空', trigger: 'blur' }],
        receivedate: [{ required: true, message: '收发日期不能为空', trigger: 'change' }],
        deliverunit: [{ required: true, message: '送货单位不能为空', trigger: 'blur' }],
        store: [{ required: true, message: '请选择仓库', trigger: 'change' }],
        flag: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
        'currentMaterial.materialno': [{ required: true, message: '物料编号不能为空', trigger: 'blur' }],
        'currentMaterial.materialname': [{ required: true, message: '物料名称不能为空', trigger: 'blur' }],
        'currentMaterial.quantity': [{ required: true, message: '数量不能为空', trigger: 'blur' }],
        'currentMaterial.price': [{ required: true, message: '单价不能为空', trigger: 'blur' }]
      }
    };
  },
  methods: {
    // 生成单据号
    generateOrderNo() {
      const now = new Date();
      const timestamp = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');
      return `SFDH${timestamp}`;
    },
    // 默认表单值
    getDefaultForm() {
      const termStore = useTermStore();
      return {
        orderno: this.generateOrderNo(),
        receivedate: '',
        deliverunit: '',
        store: '',
        flag: '',
        handleperson: '',
        materials: []
      };
    },
    // 初始化表单数据
    initFormData(data) {
      if (this.edit) {
        this.form = cloneDeep(data);
      } else {
        this.form = { ...this.getDefaultForm() };
      }
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate();
        }
      });
    },
    // 选择物料
    selectProduct() {
      this.productSelectorVisible = true;
    },
    handleProductSelect(product) {
      this.currentMaterial.materialno = product.no;
      this.currentMaterial.materialname = product.name;
      this.currentMaterial.spec = product.spec;
      this.currentMaterial.price = product.planned_price;
      this.currentMaterial.unit = product.unit;
    },
    // 添加物料
    addMaterial() {
      this.$refs.formRef.validateField(['currentMaterial.materialno', 'currentMaterial.materialname', 'currentMaterial.quantity', 'currentMaterial.price'], (valid) => {
        if (valid) {
          this.currentMaterial.totalmoney = parseFloat((this.currentMaterial.quantity * this.currentMaterial.price).toFixed(2));
          this.form.materials.push(cloneDeep(this.currentMaterial));
          this.resetCurrentMaterial();
        }
      });
    },
    // 删除物料
    removeMaterial(index) {
      this.form.materials.splice(index, 1);
    },
    // 重置当前物料
    resetCurrentMaterial() {
      this.currentMaterial = {
        materialno: '',
        materialname: '',
        spec: '',
        unit: '',
        quantity: 0,
        price: 0,
        totalmoney: 0
      };
      this.$refs.formRef.clearValidate(['currentMaterial.materialno', 'currentMaterial.materialname', 'currentMaterial.quantity', 'currentMaterial.price']);
    },
    // 表单提交
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid && this.form.materials.length > 0) {
          this.$emit('submit', cloneDeep(this.form));
        } else {
          this.$message.error('请填写完整表单内容并添加至少一个物料');
        }
      });
    },
    // 重置表单
    handleReset() {
      this.initFormData({});
      this.resetCurrentMaterial();
    },
    // 保存草稿
    handleSaveDraft() {
      this.$emit('save-draft', cloneDeep(this.form));
    }
  },
  created() {
    this.initFormData(this.formData);
  },
  watch: {
    formData: {
      handler(newVal) {
        this.initFormData(newVal);
      },
      deep: true,
      immediate: true
    },
    'currentMaterial.quantity'() {
      this.currentMaterial.totalmoney = parseFloat((this.currentMaterial.quantity * this.currentMaterial.price).toFixed(2)) || 0;
    },
    'currentMaterial.price'() {
      this.currentMaterial.totalmoney = parseFloat((this.currentMaterial.quantity * this.currentMaterial.price).toFixed(2)) || 0;
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

.el-form-item {
  margin-bottom: 12px;
}

.el-form-item__label {
  font-size: 13px;
  color: #606266;
}

.el-input--small .el-input__inner,
.el-select--small .el-input__inner {
  height: 32px;
  line-height: 32px;
}

.el-input-number--small {
  width: 100%;
}

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