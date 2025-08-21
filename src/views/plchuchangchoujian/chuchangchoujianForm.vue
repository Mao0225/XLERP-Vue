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
            <el-form-item label="销售合同编号" prop="xiaoshouhetongno">
              <el-input 
                v-model="form.xiaoshouhetongno" 
                placeholder="请输入销售合同编号" 
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="国网合同号" prop="guowanghetonghao">
              <el-row :gutter="8" style="display: flex; align-items: center;">
                <el-col :span="18">
                  <el-input 
                    v-model="form.guowanghetonghao" 
                    placeholder="请输入国网合同号" 
                    readonly
                  />
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" size="small" @click="openContractSelector">
                    选择合同
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="国网合同行项id" prop="poitemid">
              <el-input 
                v-model="form.poitemid" 
                placeholder="请输入国网合同行项id" 
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="国网合同行项目号" prop="poitemno">
              <el-row :gutter="8" style="display: flex; align-items: center;">
                <el-col :span="18">
                  <el-input 
                    v-model="form.poitemno" 
                    placeholder="请输入国网合同行项目号" 
                    readonly
                  />
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" size="small" @click="openPoitemnoDialog">
                    选择
                  </el-button>
                </el-col>
              </el-row>
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
              <el-row :gutter="8" style="display: flex; align-items: center;">
                <el-col :span="18">
                  <el-input 
                    v-model="form.prodworkorder" 
                    placeholder="请输入生产工单号" 
                  />
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" size="small" @click="openWorkorderSelector">
                    选择
                  </el-button>
                </el-col>
              </el-row>
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
    <!-- 合同选择器组件 -->
    <ContractSelector 
      v-model="contractSelectorVisible" 
      @onSelect="handleContractSelect"
    />
    
    <!-- 合同行项目选择器 -->
    <HangXiangMuHaoSelector   
      v-model="itemSelectorVisible"
      :contract-no="form.xiaoshouhetongno"   
      @on-select="handleItemSelect"
    />
    
    <!-- 国网合同行项目号选择对话框 -->
    <el-dialog
      title="选择国网合同行项目号"
      v-model="poitemnoDialogVisible"
      width="70%"
      :before-close="handleDialogClose"
    >
      <div v-if="loading" class="loading-container">
        <el-loading :visible="loading" text="正在加载数据..."></el-loading>
      </div>
      
      <div v-if="errorMessage" class="error-message">
        <el-alert
          title="错误提示"
          :message="errorMessage"
          type="error"
          show-icon
        />
      </div>
      
      <el-table
        v-if="!loading && !errorMessage"
        :data="contractItems"
        border
        style="width: 100%; margin-bottom: 15px;"
        @row-click="handleRowClick"
        highlight-current-row
      >
        <el-table-column
          prop="itemname"
          label="产品名称"
          width="150"
        />
        <el-table-column
          prop="itemno"
          label="产品编号"
          width="150"
        />
        <el-table-column
          prop="spec"
          label="规格型号"
          width="150"
        />
        <el-table-column
          prop="inclass"
          label="类别"
          width="100"
        />
        <el-table-column
          prop="itemnum"
          label="数量"
          width="100"
        />
        <el-table-column
          prop="itemunit"
          label="单位"
          width="80"
        />
        <el-table-column
          prop="poItemno"
          label="国网合同行项目号"
          width="180"
        />
        <el-table-column
          prop="poItemId"
          label="国网合同行项id"
          width="180"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
        >
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              @click="handleSelectItem(scope.row)"
            >
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <template #footer>
        <el-button @click="poitemnoDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 生产工单选择对话框 -->
    <el-dialog
      title="选择生产工单"
      v-model="workorderSelectorVisible"
      width="80%"
      :before-close="handleWorkorderDialogClose"
    >
      <!-- 操作栏 -->
      <div class="action-bar">
        <el-input 
          v-model="workorderQueryParams.ipoNo" 
          placeholder="请输入供应商生产订单序号查询" 
          style="width: 200px; margin-right: 10px;"
          clearable 
          @clear="getWorkorderList" 
          @keyup.enter="getWorkorderList" 
        />
        <el-input 
          v-model="workorderQueryParams.woNo" 
          placeholder="请输入生产工单编码查询" 
          style="width: 200px; margin-right: 10px;"
          clearable 
          @clear="getWorkorderList" 
          @keyup.enter="getWorkorderList" 
        />
        <el-button type="primary" @click="getWorkorderList">搜索</el-button>
        <el-button type="warning" @click="handleWorkorderRefresh">
          <el-icon><Refresh /></el-icon> 刷新
        </el-button>
      </div>
      
      <!-- 表格展示 -->
      <el-table 
        :data="workorderList" 
        border 
        v-loading="workorderLoading" 
        style="width: 100%; margin-top: 15px;"
        @row-click="handleWorkorderRowClick"
        highlight-current-row
      >
        <!-- 序号 -->
        <el-table-column type="index" label="序号" width="80" />
        
        <el-table-column prop="contractNo" label="合同编号" />
        <el-table-column prop="ipoNo" label="生产订单号" />
        <el-table-column prop="woNo" label="生产工单号" />
        
        <el-table-column prop="planStartDate" label="计划开始日期" width="180">
          <template #default="{ row }">
            {{ formatDate(row.planStartDate) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="planFinishDate" label="计划完成日期" width="180">
          <template #default="{ row }">
            {{ formatDate(row.planFinishDate) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="woStatus" label="工单状态" width="120">
          <template #default="{ row }">
            {{ getWorkorderStatusLabel(row.woStatus) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="dataSource" label="数据来源" />
        
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              @click="handleSelectWorkorder(scope.row)"
            >
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container" style="margin-top: 15px; text-align: right;">
        <el-pagination
          v-model:current-page="workorderQueryParams.pageNumber"
          v-model:page-size="workorderQueryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="workorderTotal"
          @size-change="handleWorkorderSizeChange"
          @current-change="handleWorkorderCurrentChange"
        />
      </div>
      
      <template #footer>
        <el-button @click="workorderSelectorVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { addchuchangchoujian, updatechuchangchoujian } from '@/api/plchuchangchoujian/plchuchangchoujian'
import { useUserStore } from '@/store/user'
import { getNewNoNyName } from '@/api/system/basno'
// 引入合同选择器组件
import ContractSelector from './components/ContractSelector.vue'
// 引入获取合同行项目接口
import { getcontractitems } from '@/api/plchuchangchoujian/plchuchangchoujian'
// 引入生产工单相关接口
import { getPlshengchangongdanList } from '@/api/plmanage/plshengchangongdan'

// 用户信息
const userStore = useUserStore()
const userInfo = computed(() => ({
  username: userStore.descr || '未知'
}))

// 合同选择器相关
const contractSelectorVisible = ref(false)
const itemSelectorVisible = ref(false)

// 打开合同选择器
const openContractSelector = () => {
  contractSelectorVisible.value = true
}

// 处理合同选择结果
const handleContractSelect = (contract) => {
  form.xiaoshouhetongno = contract.no // 合同no赋值给销售合同编号
  form.guowanghetonghao = contract.gridno // 合同gridno赋值给国网合同号
}

// 合同行项目选择相关
const poitemnoDialogVisible = ref(false);
const contractItems = ref([]);
const loading = ref(false);
const errorMessage = ref('');

// 打开国网合同行项目号对话框
const openPoitemnoDialog = async () => {
  // 验证销售合同编号是否存在
  if (!form.xiaoshouhetongno) {
    ElMessage.warning('请先选择销售合同');
    return;
  }
  
  // 显示加载状态
  loading.value = true;
  errorMessage.value = '';
  contractItems.value = [];
  
  try {
    // 调用接口获取合同行项目数据
    const response = await getcontractitems(form.xiaoshouhetongno);
    
    if (response.code === 200 && response.success) {
      contractItems.value = response.data.items || [];
      
      // 如果没有数据，显示提示信息
      if (contractItems.value.length === 0) {
        errorMessage.value = '未查询到相关合同行项目数据';
      }
    } else {
      errorMessage.value = response.msg || '查询合同行项目失败';
    }
  } catch (error) {
    console.error('获取合同行项目数据失败:', error);
    errorMessage.value = '获取数据时发生错误，请稍后重试';
  } finally {
    // 隐藏加载状态
    loading.value = false;
  }
  
  // 显示对话框
  poitemnoDialogVisible.value = true;
};

// 处理表格行点击
const handleRowClick = (row) => {
  // 可以在这里处理行点击逻辑，如高亮等
};

// 选择合同行项目
const handleSelectItem = (row) => {
  // 赋值选中的数据到表单
  form.poitemno = row.poItemno || '';
  form.poitemid = row.poItemId || '';
  
  // 关闭对话框
  poitemnoDialogVisible.value = false;
  
  // 显示选择成功提示
  ElMessage.success('已选择合同行项目');
};

// 对话框关闭前的处理
const handleDialogClose = () => {
  // 清空错误信息
  errorMessage.value = '';
  poitemnoDialogVisible.value = false;
};

// 生产工单选择相关
const workorderSelectorVisible = ref(false);
const workorderList = ref([]);
const workorderTotal = ref(0);
const workorderLoading = ref(false);

// 工单状态配置
const WORKORDER_STATUS_CONFIG = {
  1: { label: '待处理', type: 'info' },
  2: { label: '处理中', type: 'warning' },
  3: { label: '已完成', type: 'success' },
  4: { label: '已取消', type: 'danger' },
  5: { label: '已过期', type: 'danger' }
}

// 获取工单状态标签
const getWorkorderStatusLabel = (status) => {
  return WORKORDER_STATUS_CONFIG[status]?.label || '未知状态'
}

// 生产工单查询参数
const workorderQueryParams = reactive({
  ipoNo: '',
  woNo: '',
  pageNumber: 1,
  pageSize: 10
})

// 打开生产工单选择对话框
const openWorkorderSelector = () => {
  workorderSelectorVisible.value = true;
  // 重置查询参数并加载数据
  workorderQueryParams.pageNumber = 1;
  workorderQueryParams.pageSize = 10;
  getWorkorderList();
}

// 获取生产工单列表
const getWorkorderList = async () => {
  workorderLoading.value = true;
  try {
    const res = await getPlshengchangongdanList(workorderQueryParams);
    workorderList.value = res.data.page.list || [];
    workorderTotal.value = res.data.page.totalRow || 0;
  } catch (error) {
    console.error('获取生产工单列表失败:', error);
    ElMessage.error('获取生产工单列表失败');
  } finally {
    workorderLoading.value = false;
  }
}

// 刷新生产工单列表
const handleWorkorderRefresh = () => {
  workorderQueryParams.ipoNo = '';
  workorderQueryParams.woNo = '';
  workorderQueryParams.pageNumber = 1;
  getWorkorderList();
}

// 分页处理
const handleWorkorderSizeChange = (size) => {
  workorderQueryParams.pageSize = size;
  workorderQueryParams.pageNumber = 1;
  getWorkorderList();
}

const handleWorkorderCurrentChange = (page) => {
  workorderQueryParams.pageNumber = page;
  getWorkorderList();
}

// 处理工单表格行点击
const handleWorkorderRowClick = (row) => {
  // 行点击逻辑
}

// 选择生产工单
const handleSelectWorkorder = (row) => {
  form.prodworkorder = row.woNo || '';
  form.batch = row.woNo || '';
  // 可以同时设置生产订单编号 
  form.prodorderno = row.ipoNo || '';
  workorderSelectorVisible.value = false;
  ElMessage.success('已选择生产工单');
}

// 关闭生产工单对话框
const handleWorkorderDialogClose = () => {
  workorderSelectorVisible.value = false;
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

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
const emit = defineEmits(['update:visible', 'cancel', 'refreshData'])

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
  xiaoshouhetongno: '',
  guowanghetonghao: '',
  poitemid: '', // 国网合同行项id
  poitemno: '', // 国网合同行项目号
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
  galvanvanizingchecktime: '',
  galvanizingchecker: userInfo.value.username,
  // 悬垂线夹和连接金具机械试验字段
  breakingloadstd: null,
  breakingloadactual: null,
  suspensionmechchecktime: '',
  suspensionmechchecker: userInfo,
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
  xiaoshouhetongno: [
    { required: true, message: '请输入销售合同编号', trigger: 'blur' }
  ],
  guowanghetonghao: [
    { required: true, message: '请输入国网合同号', trigger: 'blur' }
  ] 
}

// 监听表单数据变化
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
    xiaoshouhetongno: '',
    guowanghetonghao: '',
    poitemid: '',
    poitemno: '',
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

.loading-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-message {
  margin-bottom: 15px;
}

.action-bar {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.pagination-container {
  text-align: right;
}
</style>
