<template>
  <div ref="iconSelectRef" :style="{ width: props.width }">
    <el-popover :visible="popoverVisible" :width="props.width" placement="bottom-end">
      <template #reference>
        <div @click="popoverVisible = !popoverVisible">
          <slot>
            <el-input v-model="selectedIcon" readonly placeholder="点击选择图标" class="reference">
              <template #prepend>
                <el-icon v-if="selectedIcon">
                  <component :is="selectedIcon.replace('el-icon-', '')" />
                </el-icon>
              </template>
              <template #suffix>
                <!-- 清空按钮 -->
                <el-icon
                  v-if="selectedIcon"
                  style="margin-right: 8px"
                  @click.stop="clearSelectedIcon"
                >
                  <CircleClose />
                </el-icon>

                <el-icon
                  :style="{
                    transform: popoverVisible ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform .5s',
                  }"
                >
                  <ArrowDown @click.stop="togglePopover" />
                </el-icon>
              </template>
            </el-input>
          </slot>
        </div>
      </template>

      <!-- 图标选择弹窗 -->
      <div ref="popoverContentRef">
        <el-input v-model="filterText" placeholder="搜索图标" clearable @input="filterIcons" />
        <el-scrollbar height="300px">
          <ul class="icon-grid">
            <li
              v-for="icon in filteredElementIcons"
              :key="icon"
              class="icon-grid-item"
              @click="selectIcon(icon)"
            >
              <el-tooltip :content="'el-icon-' + icon" placement="bottom" effect="light">
                <el-icon>
                  <component :is="icon" />
                </el-icon>
              </el-tooltip>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "500px",
  },
});

const emit = defineEmits(["update:modelValue"]);

const iconSelectRef = ref();
const popoverContentRef = ref();
const popoverVisible = ref(false);
const elementIcons = ref<string[]>(Object.keys(ElementPlusIconsVue));
const selectedIcon = defineModel("modelValue", {
  type: String,
  required: true,
  default: "",
});

const filterText = ref("");
const filteredElementIcons = ref<string[]>(elementIcons.value);

function filterIcons() {
  filteredElementIcons.value = filterText.value
    ? elementIcons.value.filter((icon) =>
        icon.toLowerCase().includes(filterText.value.toLowerCase())
      )
    : elementIcons.value;
}

function selectIcon(icon: string) {
  const iconName = "el-icon-" + icon;
  emit("update:modelValue", iconName);
  popoverVisible.value = false;
}

function togglePopover() {
  popoverVisible.value = !popoverVisible.value;
}

// 点击外部关闭弹窗
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  if (
    popoverVisible.value &&
    iconSelectRef.value &&
    !iconSelectRef.value.contains(target) &&
    popoverContentRef.value &&
    !popoverContentRef.value.contains(target)
  ) {
    popoverVisible.value = false;
  }
}

/**
 * 清空已选图标
 */
function clearSelectedIcon() {
  selectedIcon.value = "";
  emit("update:modelValue", "");
}

onMounted(() => {
  // 添加点击外部监听器
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  // 清理事件监听器
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="scss">
.reference :deep(.el-input__wrapper),
.reference :deep(.el-input__inner) {
  cursor: pointer;
}

.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 0;
}

.icon-grid-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  transition: all 0.3s ease;
  background-color: #fff;

  &:hover {
    border-color: #409eff;
    background-color: #ecf5ff;
    transform: scale(1.05);
  }
}
</style>