<template>
  <el-dialog
    title="录入镀锌螺栓检验数据"
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
          <el-form-item label="抽检数量(件)" prop="sampleQuantity">
            <el-input v-model.number="form.sampleQuantity" placeholder="总抽检数量" readonly size="small" />
          </el-form-item>
        </el-col>

          <!-- 化学性能 -->
          <el-col :span="24">
            <el-divider content-position="left">化学性能 (%)</el-divider>
          </el-col>

          <!-- C元素组 - 精确匹配以C开头且后面不是其他字母的元素 -->
          <el-col :span="24" class="mb-4">
            <h4 class="text-lg font-medium mb-2">C元素</h4>
            <el-row :gutter="16">
              <el-col :span="6" v-for="item in chemicals.filter(i => /^C\D?/.test(i.key) && !/^Ca|Cb|Cc/.test(i.key))" :key="item.key">
                <el-form-item :label="item.label">
                  <el-form-item :prop="item.actualProp" :rules="rules[item.actualProp]">
                    <el-input 
                      v-model.number="form[item.actualProp]" 
                      :placeholder="item.label" 
                      clearable 
                      size="small" 
                    />
                  </el-form-item>
                </el-form-item>
              </el-col>
              <!-- C的要求值 -->
              <el-col :span="6">
                <el-form-item label="C的要求值">
                  <el-form-item prop="chemCRequired" :rules="rules.chemCRequired">
                    <el-input 
                      v-model.number="form.chemCRequired" 
                      placeholder="C的要求值" 
                      clearable 
                      size="small" 
                    />
                  </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <!-- Si元素组 - 精确匹配以Si开头的元素 -->
          <el-col :span="24" class="mb-4">
            <h4 class="text-lg font-medium mb-2">Si元素</h4>
            <el-row :gutter="16">
              <el-col :span="6" v-for="item in chemicals.filter(i => /^Si/.test(i.key))" :key="item.key">
                <el-form-item :label="item.label">
                  <el-form-item :prop="item.actualProp" :rules="rules[item.actualProp]">
                    <el-input 
                      v-model.number="form[item.actualProp]" 
                      :placeholder="item.label" 
                      clearable 
                      size="small" 
                    />
                  </el-form-item>
                </el-form-item>
              </el-col>
              <!-- Si的要求值 -->
              <el-col :span="6">
                <el-form-item label="Si的要求值">
                  <el-form-item prop="chemSiRequired" :rules="rules.chemSiRequired">
                    <el-input 
                      v-model.number="form.chemSiRequired" 
                      placeholder="Si的要求值" 
                      clearable 
                      size="small" 
                    />
                  </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <!-- Mn元素组 - 精确匹配以Mn开头的元素 -->
          <el-col :span="24" class="mb-4">
            <h4 class="text-lg font-medium mb-2">Mn元素</h4>
            <el-row :gutter="16">
              <el-col :span="6" v-for="item in chemicals.filter(i => /^Mn/.test(i.key))" :key="item.key">
                <el-form-item :label="item.label">
                  <el-form-item :prop="item.actualProp" :rules="rules[item.actualProp]">
                    <el-input 
                      v-model.number="form[item.actualProp]" 
                      :placeholder="item.label" 
                      clearable 
                      size="small" 
                    />
                  </el-form-item>
                </el-form-item>
              </el-col>
              <!-- Mn的要求值 -->
              <el-col :span="6">
                <el-form-item label="Mn的要求值">
                  <el-form-item prop="chemMnRequired" :rules="rules.chemMnRequired">
                    <el-input 
                      v-model.number="form.chemMnRequired" 
                      placeholder="Mn的要求值" 
                      clearable 
                      size="small" 
                    />
                  </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <!-- P元素组 - 精确匹配以P开头且后面不是其他字母的元素 -->
          <el-col :span="24" class="mb-4">
            <h4 class="text-lg font-medium mb-2">P元素</h4>
            <el-row :gutter="16">
              <el-col :span="6" v-for="item in chemicals.filter(i => /^P\D?/.test(i.key) && !/^Pa|Pb|Pc/.test(i.key))" :key="item.key">
                <el-form-item :label="item.label">
                  <el-form-item :prop="item.actualProp" :rules="rules[item.actualProp]">
                    <el-input 
                      v-model.number="form[item.actualProp]" 
                      :placeholder="item.label" 
                      clearable 
                      size="small" 
                    />
                  </el-form-item>
                </el-form-item>
              </el-col>
              <!-- P的要求值 -->
              <el-col :span="6">
                <el-form-item label="P的要求值">
                  <el-form-item prop="chemPRequired" :rules="rules.chemPRequired">
                    <el-input 
                      v-model.number="form.chemPRequired" 
                      placeholder="P的要求值" 
                      clearable 
                      size="small" 
                    />
                  </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <!-- S元素组 - 精确匹配以S开头且后面不是i的元素 -->
          <el-col :span="24" class="mb-4">
            <h4 class="text-lg font-medium mb-2">S元素</h4>
            <el-row :gutter="16">
              <el-col :span="6" v-for="item in chemicals.filter(i => /^S(?!i)/.test(i.key))" :key="item.key">
                <el-form-item :label="item.label">
                  <el-form-item :prop="item.actualProp" :rules="rules[item.actualProp]">
                    <el-input 
                      v-model.number="form[item.actualProp]" 
                      :placeholder="item.label" 
                      clearable 
                      size="small" 
                    />
                  </el-form-item>
                </el-form-item>
              </el-col>
              <!-- S的要求值 -->
              <el-col :span="6">
                <el-form-item label="S的要求值">
                  <el-form-item prop="chemSRequired" :rules="rules.chemSRequired">
                    <el-input 
                      v-model.number="form.chemSRequired" 
                      placeholder="S的要求值" 
                      clearable 
                      size="small" 
                    />
                  </el-form-item>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
    
    
         <!-- 硬度 -->
        <el-col :span="24">
          <el-divider content-position="left">硬度</el-divider>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="16">
            <el-col :span="6" v-for="hardness in hardnessItems" :key="hardness.key">
              <el-form-item :label="hardness.label">
                <el-form-item :prop="hardness.actualProp" :rules="rules[hardness.actualProp]">
                  <el-input 
                    v-model.number="form[hardness.actualProp]" 
                    :placeholder="hardness.label" 
                    clearable 
                    size="small" 
                  />
                </el-form-item>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="要求值">
                <el-form-item prop="hardnessRequired" :rules="rules.hardnessRequired">
                  <el-input 
                    v-model.number="form.hardnessRequired" 
                    placeholder="要求值" 
                    clearable 
                    size="small" 
                  />
                </el-form-item>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <!-- 锌层厚度 -->
        <el-col :span="24">
          <el-divider content-position="left">锌层厚度</el-divider>
        </el-col>

        <!-- 单体锌层厚度组 -->
        <el-col :span="24" class="mb-4">
          <h4 class="text-lg font-medium mb-2">单体锌层厚度</h4>
          <el-row :gutter="16">
            <!-- 单体锌层厚度的实测值 -->
            <el-col :span="6" v-for="item in zincItems.filter(i => i.type === 'single')" :key="item.key">
              <el-form-item :label="item.label">
                <el-form-item :prop="item.actualProp" :rules="rules[item.actualProp]">
                  <el-input 
                    v-model.number="form[item.actualProp]" 
                    :placeholder="item.label" 
                    clearable 
                    size="small" 
                  />
                </el-form-item>
              </el-form-item>
            </el-col>
            <!-- 单体锌层厚度的要求值 -->
            <el-col :span="6">
              <el-form-item label="单体锌层厚度要求值">
                <el-form-item prop="zincLayerThicknessSingleRequired" :rules="rules.zincLayerThicknessSingleRequired">
                  <el-input 
                    v-model.number="form.zincLayerThicknessSingleRequired" 
                    placeholder="单体锌层厚度要求值" 
                    clearable 
                    size="small" 
                  />
                </el-form-item>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 总体锌层厚度组 -->
        <el-col :span="24" class="mb-4">
          <h4 class="text-lg font-medium mb-2">总体锌层厚度</h4>
          <el-row :gutter="16">
            <!-- 总体锌层厚度的实测值 -->
            <el-col :span="6" v-for="item in zincItems.filter(i => i.type === 'total')" :key="item.key">
              <el-form-item :label="item.label">
                <el-form-item :prop="item.actualProp" :rules="rules[item.actualProp]">
                  <el-input 
                    v-model.number="form[item.actualProp]" 
                    :placeholder="item.label" 
                    clearable 
                    size="small" 
                  />
                </el-form-item>
              </el-form-item>
            </el-col>
            <!-- 总体锌层厚度的要求值 -->
            <el-col :span="6">
              <el-form-item label="总体锌层厚度要求值">
                <el-form-item prop="zincLayerThicknessTotalRequired" :rules="rules.zincLayerThicknessTotalRequired">
                  <el-input 
                    v-model.number="form.zincLayerThicknessTotalRequired" 
                    placeholder="总体锌层厚度要求值" 
                    clearable 
                    size="small" 
                  />
                </el-form-item>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
    
        <!--机械性能 -->
        <el-col :span="24">
          <el-divider content-position="left">机械性能</el-divider>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="16">
            <el-col :span="6" v-for="mechanicalProperties in mechanicalItems" :key="mechanicalProperties.key">
              <el-form-item :label="mechanicalProperties.label">
                <el-form-item :prop="mechanicalProperties.actualProp" :rules="rules[mechanicalProperties.actualProp]">
                  <el-input 
                    v-model.number="form[mechanicalProperties.actualProp]" 
                    :placeholder="mechanicalProperties.label" 
                    clearable 
                    size="small" 
                  />
                </el-form-item>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="要求值">
                <el-form-item prop="mechanicalPropertiesRequired" :rules="rules.mechanicalPropertiesRequired">
                  <el-input 
                    v-model.number="form.mechanicalPropertiesRequired" 
                    placeholder="要求值" 
                    clearable 
                    size="small" 
                  />
                </el-form-item>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <!-- 尺寸 -->
        <el-col :span="24">
          <el-divider content-position="left">尺寸</el-divider>
        </el-col>

        <!-- d尺寸组 -->
        <el-col :span="24" class="mb-4">
          <h4 class="text-lg font-medium mb-2">d尺寸</h4>
          <el-row :gutter="16">
            <el-col :span="6" v-for="item in sizeItem.filter(i => i.key.includes('d') || i.label.includes('d'))" :key="item.key">
              <el-form-item :label="item.label">
                <el-form-item :prop="item.actualProp" :rules="rules[item.actualProp]">
                  <el-input 
                    v-model.number="form[item.actualProp]" 
                    :placeholder="item.label" 
                    clearable 
                    size="small" 
                  />
                </el-form-item>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- L尺寸组 -->
        <el-col :span="24" class="mb-4">
          <h4 class="text-lg font-medium mb-2">L尺寸</h4>
          <el-row :gutter="16">
            <el-col :span="6" v-for="item in sizeItem.filter(i => i.key.includes('L') || i.label.includes('L'))" :key="item.key">
              <el-form-item :label="item.label">
                <el-form-item :prop="item.actualProp" :rules="rules[item.actualProp]">
                  <el-input 
                    v-model.number="form[item.actualProp]" 
                    :placeholder="item.label" 
                    clearable 
                    size="small" 
                  />
                </el-form-item>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- b尺寸组 -->
        <el-col :span="24" class="mb-4">
          <h4 class="text-lg font-medium mb-2">b尺寸</h4>
          <el-row :gutter="16">
            <el-col :span="6" v-for="item in sizeItem.filter(i => i.key.includes('b') || i.label.includes('b'))" :key="item.key">
              <el-form-item :label="item.label">
                <el-form-item :prop="item.actualProp" :rules="rules[item.actualProp]">
                  <el-input 
                    v-model.number="form[item.actualProp]" 
                    :placeholder="item.label" 
                    clearable 
                    size="small" 
                  />
                </el-form-item>
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
import { updateDxls } from '@/api/clmanage/cl-dxls'
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
  { key: 'C1', label: 'C的实测值一', actualProp: 'chemC1' },
  { key: 'C2', label: 'C的实测值二', actualProp: 'chemC2' },
  { key: 'C3', label: 'C的实测值三', actualProp: 'chemC3' },
  { key: 'Si1', label: 'Si的实测值一', actualProp: 'chemSi1' },
  { key: 'Si2', label: 'Si的实测值二', actualProp: 'chemSi2' },
  { key: 'Si3', label: 'Si的实测值三', actualProp: 'chemSi3' },
  { key: 'Mn1', label: 'Mn的实测值一', actualProp: 'chemMn1' },
  { key: 'Mn2', label: 'Mn的实测值二', actualProp: 'chemMn2' },
  { key: 'Mn3', label: 'Mn的实测值三', actualProp: 'chemMn3' },
  { key: 'P1', label: 'P的实测值一', actualProp: 'chemP1' },
  { key: 'P2', label: 'P的实测值二', actualProp: 'chemP2' },
  { key: 'P3', label: 'P的实测值三', actualProp: 'chemP3' },
  { key: 'S1', label: 'S的实测值一', actualProp: 'chemS1' },
  { key: 'S2', label: 'S的实测值二', actualProp: 'chemS2' },
  { key: 'S3', label: 'S的实测值三', actualProp: 'chemS3' },
]
const hardnessItems = [
  { key: 'hardness1', label: '硬度实测值一', actualProp: 'hardness1' },
  { key: 'hardness2', label: '硬度实测值二', actualProp: 'hardness2' },
  { key: 'hardness3', label: '硬度实测值三', actualProp: 'hardness3' },
  { key: 'hardness4', label: '硬度实测值四', actualProp: 'hardness4' },
  { key: 'hardness5', label: '硬度实测值五', actualProp: 'hardness5' },
]
const zincItems = [
  { key: 'Single1', label: '单体锌层厚度实测值一', actualProp: 'zincLayerThicknessSingle1' ,type: 'single'},
  { key: 'Single2', label: '单体锌层厚度实测值二', actualProp: 'zincLayerThicknessSingle2' ,type: 'single'},
  { key: 'Single3', label: '单体锌层厚度实测值三', actualProp: 'zincLayerThicknessSingle3' ,type: 'single'},
  { key: 'Single4', label: '单体锌层厚度实测值四', actualProp: 'zincLayerThicknessSingle4' ,type: 'single'},
  { key: 'Single5', label: '单体锌层厚度实测值五', actualProp: 'zincLayerThicknessSingle5' ,type: 'single'},
  { key: 'Total', label: '总体锌层厚度实测值', actualProp: 'zincLayerThicknessTotal' , type: 'total'},
]
const mechanicalItems = [
  { key: 'mechanicalProperties1', label: '机械性能实测值一', actualProp: 'mechanicalProperties1' },
  { key: 'mechanicalProperties2', label: '机械性能实测值二', actualProp: 'mechanicalProperties2' },
  { key: 'mechanicalProperties3', label: '机械性能实测值三', actualProp: 'mechanicalProperties3' },
]
const sizeItem = [
  { key: 'd1', label: 'd的实测值一', actualProp: 'sized1' },
  { key: 'd2', label: 'd的实测值二', actualProp: 'sized2' },
  { key: 'd3', label: 'd的实测值三', actualProp: 'sized3' },
  { key: 'd4', label: 'd的实测值四', actualProp: 'sized4' },
  { key: 'd5', label: 'd的实测值五', actualProp: 'sized5' },
  { key: 'L1', label: 'L的实测值一', actualProp: 'sizeL1' },
  { key: 'L2', label: 'L的实测值二', actualProp: 'sizeL2' },
  { key: 'L3', label: 'L的实测值三', actualProp: 'sizeL3' },
  { key: 'L4', label: 'L的实测值四', actualProp: 'sizeL4' },
  { key: 'L5', label: 'L的实测值五', actualProp: 'sizeL5' },
  { key: 'b1', label: 'b的实测值一', actualProp: 'sizeb1' },
  { key: 'b2', label: 'b的实测值二', actualProp: 'sizeb2' },
  { key: 'b3', label: 'b的实测值三', actualProp: 'sizeb3' },
  { key: 'b4', label: 'b的实测值四', actualProp: 'sizeb4' },
  { key: 'b5', label: 'b的实测值五', actualProp: 'sizeb5' },
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
  chemC1: '',
  chemC2: '',
  chemC3: '',
  chemSi1: '',
  chemSi2: '',
  chemSi3: '',
  chemMn1: '',
  chemMn2: '',
  chemMn3: '',
  chemP1: '',
  chemP2: '',
  chemP3: '',
  chemS1: '',
  chemS2: '',
  chemS3: '',
  hardness1: '',
  hardness2: '',
  hardness3: '',
  hardness4: '',
  hardness5: '',
  zincLayerThicknessSingle1: '',
  zincLayerThicknessSingle2: '',
  zincLayerThicknessSingle3: '',
  zincLayerThicknessSingle4: '',
  zincLayerThicknessSingle5: '',
  zincLayerThicknessTotal: '',
  mechanicalProperties1: '',
  mechanicalProperties2: '',
  mechanicalProperties3: '',
  sized1: '',
  sized2: '',
  sized3: '',
  sized4: '',
  sized5: '',
  sizeL1: '',
  sizeL2: '',
  sizeL3: '',
  sizeL4: '',
  sizeL5: '',
  sizeb1: '',
  sizeb2: '',
  sizeb3: '',
  sizeb4: '',
  sizeb5: '',
  hardnessRequired: '',
  zincLayerThicknessSingleRequired: '',
  zincLayerThicknessTotalRequired: '',
  mechanicalPropertiesRequired: '',
  leaveFactoryDate: '',
  detectionTime: '',
  status: '40',
  memo: '',
  checkMemo: '',
  basNo: '',
  batchNo: '',
  batchNum: '',
  quantity: '',
  sampleQuantity: 5,
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
  chemC1: [
    { required: true, message: '请输入C的第一次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemC2: [
    { required: true, message: '请输入C的第二次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemC3: [
    { required: true, message: '请输入C的第三次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemSi1: [
    { required: true, message: '请输入Si的第一次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemSi2: [
    { required: true, message: '请输入Si的第二次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemSi3: [
    { required: true, message: '请输入Si的第三次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemMn1: [
    { required: true, message: '请输入Mn的第一次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemMn2: [
    { required: true, message: '请输入Mn的第二次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemMn3: [
    { required: true, message: '请输入Mn的第三次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemP1: [
    { required: true, message: '请输入P的第一次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemP2: [
    { required: true, message: '请输入P的第二次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemP3: [
    { required: true, message: '请输入P的第三次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemS1: [
    { required: true, message: '请输入S的第一次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemS2: [
    { required: true, message: '请输入S的第二次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  chemS3: [
    { required: true, message: '请输入S的第三次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  hardness1: [
    { required: true, message: '请输入硬度的第一次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  hardness2: [
    { required: true, message: '请输入硬度的第二次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  hardness3: [
    { required: true, message: '请输入硬度的第三次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  hardness4: [
    { required: true, message: '请输入硬度的第四次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  hardness5: [
    { required: true, message: '请输入硬度的第五次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  zincLayerThicknessSingle1: [
    { required: true, message: '请输入单体锌层厚度的第一次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  zincLayerThicknessSingle2: [
    { required: true, message: '请输入单体锌层厚度的第二次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  zincLayerThicknessSingle3: [
    { required: true, message: '请输入单体锌层厚度的第三次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  zincLayerThicknessSingle4: [
    { required: true, message: '请输入单体锌层厚度的第四次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  zincLayerThicknessSingle5: [
    { required: true, message: '请输入单体锌层厚度的第五次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  zincLayerThicknessTotal: [
    { required: true, message: '请输入总体锌层厚度含量', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechanicalProperties1: [
    { required: true, message: '请输入机械性能的第一次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechanicalProperties2: [
    { required: true, message: '请输入机械性能的第二次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechanicalProperties3: [
    { required: true, message: '请输入机械性能的第三次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sized1: [
    { required: true, message: '请输入d的第一次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sized2: [
    { required: true, message: '请输入d的第二次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sized3: [
    { required: true, message: '请输入d的第三次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sized4: [
    { required: true, message: '请输入d的第四次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sized5: [
    { required: true, message: '请输入d的第五次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sizeL1: [
    { required: true, message: '请输入L的第一次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sizeL2: [
    { required: true, message: '请输入L的第二次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sizeL3: [
    { required: true, message: '请输入L的第三次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sizeL4: [
    { required: true, message: '请输入L的第四次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sizeL5: [
    { required: true, message: '请输入L的第五次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sizeb1: [
    { required: true, message: '请输入sizeb的第一次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sizeb2: [
    { required: true, message: '请输入b的第二次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sizeb3: [
    { required: true, message: '请输入b的第三次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sizeb4: [
    { required: true, message: '请输入b的第四次实测值', trigger: 'blur' },
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  sizeb5: [
    { required: true, message: '请输入b的第五次实测值', trigger: 'blur' },
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
  hardnessRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  zincLayerThicknessSingleRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  zincLayerThicknessTotalRequired: [
    { type: 'number', message: '必须为数字', trigger: 'blur' }
  ],
  mechanicalPropertiesRequired: [
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
      chemC1: newData.chemC1 || '',
      chemC2: newData.chemC2 || '',
      chemC3: newData.chemC3 || '',
      chemSi1: newData.chemSi1 || '',
      chemSi2: newData.chemSi2 || '',
      chemSi3: newData.chemSi3 || '',
      chemMn1: newData.chemMn1 || '',
      chemMn2: newData.chemMn2 || '',
      chemMn3: newData.chemMn3 || '',
      chemP1: newData.chemP1 || '',
      chemP2: newData.chemP2 || '',
      chemP3: newData.chemP3 || '',
      chemS1: newData.chemS1 || '',
      chemS2: newData.chemS2 || '',
      chemS3: newData.chemS3 || '',
      hardness1: newData.hardness1 || '',
      hardness2: newData.hardness2 || '',
      hardness3: newData.hardness3 || '',
      hardness4: newData.hardness4 || '',
      hardness5: newData.hardness5 || '',
      zincLayerThicknessSingle1: newData.zincLayerThicknessSingle1 || '',
      zincLayerThicknessSingle2: newData.zincLayerThicknessSingle2 || '',
      zincLayerThicknessSingle3: newData.zincLayerThicknessSingle3 || '',
      zincLayerThicknessSingle4: newData.zincLayerThicknessSingle4 || '',
      zincLayerThicknessSingle5: newData.zincLayerThicknessSingle5 || '',
      zincLayerThicknessTotal: newData.zincLayerThicknessTotal || '',
      mechanicalProperties1: newData.mechanicalProperties1 || '',
      mechanicalProperties2: newData.mechanicalProperties2 || '',
      mechanicalProperties3: newData.mechanicalProperties3 || '',
      sized1: newData.sized1 || '',
      sized2: newData.sized2 || '',
      sized3: newData.sized3 || '',
      sized4: newData.sized4 || '',
      sized5: newData.sized5 || '',
      sizeL1: newData.sizeL1 || '',
      sizeL2: newData.sizeL2 || '',
      sizeL3: newData.sizeL3 || '',
      sizeL4: newData.sizeL4 || '',
      sizeL5: newData.sizeL5 || '',
      sizeb1: newData.sizeb1 || '',
      sizeb2: newData.sizeb2 || '',
      sizeb3: newData.sizeb3 || '',
      sizeb4: newData.sizeb4 || '',
      sizeb5: newData.sizeb5 || '',
      chemCRequired: newData.chemCRequired || '', 
      chemSiRequired: newData.chemSiRequired || '',
      chemMnRequired: newData.chemMnRequired || '',
      chemPRequired: newData.chemPRequired || '',
      chemSRequired: newData.chemSRequired || '',
      hardnessRequired: newData.hardnessRequired || '',
      zincLayerThicknessSingleRequired: newData.zincLayerThicknessSingleRequired || '',
      zincLayerThicknessTotalRequired: newData.zincLayerThicknessTotalRequired || '',
      mechanicalPropertiesRequired: newData.mechanicalPropertiesRequired || '',
      leaveFactoryDate: newData.leaveFactoryDate || '',
      detectionTime: newData.detectionTime || '',
      status: newData.status || '40',
      memo: newData.memo || '',
      checkMemo: newData.checkMemo || '',
      basNo: newData.basNo || '',
      batchNo: newData.batchNo || '',
      batchNum: newData.batchNum || '',
      quantity: newData.quantity || '',
      sampleQuantity: newData.sampleQuantity || 5,
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
    chemC1: '',
    chemC2: '',
    chemC3: '',
    chemSi1: '',
    chemSi2: '',
    chemSi3: '',
    chemMn1: '',
    chemMn2: '',
    chemMn3: '',
    chemP1: '',
    chemP2: '',
    chemP3: '',
    chemS1: '',
    chemS2: '',
    chemS3: '',
    hardness1: '',
    hardness2: '',
    hardness3: '',
    hardness4: '',
    hardness5: '',
    zincLayerThicknessSingle1: '',
    zincLayerThicknessSingle2: '',
    zincLayerThicknessSingle3: '',
    zincLayerThicknessSingle4: '',
    zincLayerThicknessSingle5: '',
    zincLayerThicknessTotal: '',
    mechanicalProperties1: '',
    mechanicalProperties2: '',
    mechanicalProperties3: '',
    sized1: '',
    sized2: '',
    sized3: '',
    sized4: '',
    sized5: '',
    sizeL1: '',
    sizeL2: '',
    sizeL3: '',
    sizeL4: '',
    sizeL5: '',
    sizeb1: '',
    sizeb2: '',
    sizeb3: '',
    sizeb4: '',
    sizeb5: '',
    chemCRequired: '',
    chemSiRequired: '',
    chemMnRequired: '',
    chemPRequired: '',
    chemSRequired: '',
    hardnessRequired: '',
    zincLayerThicknessSingleRequired: '',
    zincLayerThicknessTotalRequired: '',
    mechanicalPropertiesRequired: '',
    leaveFactoryDate: '',
    detectionTime: '',
    status: '40',
    memo: '',
    checkMemo: '',
    basNo: '',
    batchNo: '',
    batchNum: '',
    sampleQuantity: 5,
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
    await formRef.value.validate()
    if (!form.basNo) {
      ElMessage.error('单据号不能为空，请检查')
      return
    }
    await updateDxls(form)
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