<template>
    <el-dialog
      title="查看橡胶检验数据"
      :model-value="visible"
      width="1300px"
      :center="true"
      :close-on-click-modal="false"
      @update:model-value="$emit('update:visible', $event)"
    >
      <el-form :model="initialData" label-width="120px" class="custom-form">
        <el-row :gutter="20">
          <!-- 基础信息 -->
          <el-col :span="24">
            <el-divider content-position="left">基础信息</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据号">
              <span>{{ initialData.basno || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验单号">
              <span>{{ initialData.inNo || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商编码">
              <span>{{ initialData.mafactoryno || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <span>{{ initialData.mafactoryname || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材料名称">
              <span>{{ initialData.matname || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材质">
              <span>{{ initialData.material || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格">
              <span>{{ initialData.mattype || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试验编号">
              <span>{{ initialData.testno || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用单位">
              <span>{{ initialData.matdepartment || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来料检验批次号">
              <span>{{ initialData.matRecheckNo || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行标准">
              <span>{{ initialData.standard || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来料数量">
              <span>{{ initialData.quantity || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="抽检数量">
              <span>{{ initialData.sampleQuantity || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原材料出厂检测日期">
              <span>{{ initialData.leavefactoryDate || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验日期">
              <span>{{ initialData.detectionTime || '-' }}</span>
            </el-form-item>
          </el-col>
  
          <!-- 外形检测 -->
          <el-col :span="24">
            <el-divider content-position="left">外形检测</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外形检测说明">
              <span>{{ initialData.appearanceSize || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外形检测结果">
              <el-tag :type="initialData.appearanceResult === '合格' ? 'success' : 'danger'">
                {{ initialData.appearanceResult || '-' }}
              </el-tag>
            </el-form-item>
          </el-col>
  
          <!-- 长度检测 -->
          <el-col :span="24">
            <el-divider content-position="left">长度检测</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="4.8" v-for="i in 5" :key="'long' + i">
                <el-form-item :label="'测量值 ' + i">
                  <span>{{ initialData[`matlongsize${i}`] || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准值">
              <span>{{ initialData.matlongsizebiaozhun || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结果">
              <el-tag :type="initialData.matlongresult === '合格' ? 'success' : 'danger'">
                {{ initialData.matlongresult || '-' }}
              </el-tag>
            </el-form-item>
          </el-col>
  
          <!-- 宽度检测 -->
          <el-col :span="24">
            <el-divider content-position="left">宽度检测</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="4.8" v-for="i in 5" :key="'lengh' + i">
                <el-form-item :label="'测量值 ' + i">
                  <span>{{ initialData[`matlenghsize${i}`] || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准值">
              <span>{{ initialData.matlenghsizebiaozhun || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结果">
              <el-tag :type="initialData.matlenghresult === '合格' ? 'success' : 'danger'">
                {{ initialData.matlenghresult || '-' }}
              </el-tag>
            </el-form-item>
          </el-col>
  
          <!-- 线径检测 -->
          <el-col :span="24">
            <el-divider content-position="left">线径检测</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="4.8" v-for="i in 5" :key="'xianjing' + i">
                <el-form-item :label="'测量值 ' + i">
                  <span>{{ initialData[`matxianjing${i}`] || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准值">
              <span>{{ initialData.matxianjingbiaozhun || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结果">
              <el-tag :type="initialData.matxianjingresult === '合格' ? 'success' : 'danger'">
                {{ initialData.matxianjingresult || '-' }}
              </el-tag>
            </el-form-item>
          </el-col>
  
          <!-- 厚度检测 -->
          <el-col :span="24">
            <el-divider content-position="left">厚度检测</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="4.8" v-for="i in 5" :key="'height' + i">
                <el-form-item :label="'测量值 ' + i">
                  <span>{{ initialData[`matheightsize${i}`] || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准值">
              <span>{{ initialData.matheightsizebiaozhun || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结果">
              <el-tag :type="initialData.matheightsizeresult === '合格' ? 'success' : 'danger'">
                {{ initialData.matheightsizeresult || '-' }}
              </el-tag>
            </el-form-item>
          </el-col>
  
          <!-- 柱径检测 -->
          <el-col :span="24">
            <el-divider content-position="left">柱径检测</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="4.8" v-for="i in 5" :key="'zhujing' + i">
                <el-form-item :label="'测量值 ' + i">
                  <span>{{ initialData[`matzhujingsize${i}`] || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准值">
              <span>{{ initialData.matzhujingsizebiaozhun || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结果">
              <el-tag :type="initialData.matzhujingsizeresult === '合格' ? 'success' : 'danger'">
                {{ initialData.matzhujingsizeresult || '-' }}
              </el-tag>
            </el-form-item>
          </el-col>
  
          <!-- 柱高检测 -->
          <el-col :span="24">
            <el-divider content-position="left">柱高检测</el-divider>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="4.8" v-for="i in 5" :key="'zhugao' + i">
                <el-form-item :label="'测量值 ' + i">
                  <span>{{ initialData[`matzhugaosize${i}`] || '-' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准值">
              <span>{{ initialData.matzhugaosizebiaozhun || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检测结果">
              <el-tag :type="initialData.matzhugaosizeresult === '合格' ? 'success' : 'danger'">
                {{ initialData.matzhugaosizeresult || '-' }}
              </el-tag>
            </el-form-item>
          </el-col>
  
          <!-- 机械性能 -->
          <el-col :span="24">
            <el-divider content-position="left">机械性能</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="硬度值">
              <span>{{ initialData.matjixiexingnengvalue || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="硬度检测结果">
              <el-tag :type="initialData.matjixiexingnengresult === '合格' ? 'success' : 'danger'">
                {{ initialData.matjixiexingnengresult || '-' }}
              </el-tag>
            </el-form-item>
          </el-col>
  
          <!-- 质量证明书 -->
          <el-col :span="24">
            <el-divider content-position="left">质量证明书</el-divider>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文件">
              <template v-if="initialData.certificate">
                <template v-for="(file, index) in JSON.parse(initialData.certificate)" :key="index">
                  <a 
                    :href="baseURL + file.url" 
                    target="_blank" 
                    class="file-link"
                  >
                    {{ file.name }}
                  </a>
                </template>
              </template>
              <template v-else>-</template>
            </el-form-item>
          </el-col>
  
          <!-- 总结论 -->
          <el-col :span="24">
            <el-divider content-position="left">总结论</el-divider>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验人">
              <span>{{ initialData.checker || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录入人">
              <span>{{ initialData.writer || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核人">
              <span>{{ initialData.auditor || '-' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <span>{{ initialData.memo || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
  
      <template #footer>
        <el-button @click="$emit('update:visible', false)" size="small">关闭</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  import { baseURL } from '@/utils/request'
  
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
  
  const emit = defineEmits(['update:visible'])
  </script>
  
  <style scoped>
  .custom-form {
    max-height: 600px;
    overflow-y: auto;
    padding-right: 10px;
  }
  
  .file-link {
    color: #409eff;
    text-decoration: none;
    margin-right: 10px;
  }
  
  .file-link:hover {
    text-decoration: underline;
  }
  </style>