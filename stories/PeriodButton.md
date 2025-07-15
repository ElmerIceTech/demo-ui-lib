# PeriodButton 組件

## 概述

`PeriodButton` 是一個基於 `Button` 組件的高階組件，專門用於時間週期選擇。它提供了預配置的時間週期選項、多種顯示變體和靈活的選擇模式。

## 設計原則

### SOLID 原則應用

1. **單一職責原則 (SRP)**

   - `PeriodConfigManager`: 專門管理週期配置和驗證
   - `PeriodButtonStyler`: 專門處理按鈕樣式和變體
   - 每個類別都有明確的單一職責

2. **開放封閉原則 (OCP)**

   - 可以輕鬆添加新的週期類型而不修改現有代碼
   - 通過配置管理實現擴展性

3. **依賴倒置原則 (DIP)**
   - 依賴於抽象的 `Button` 組件接口
   - 使用管理器類別處理具體邏輯

## 功能特點

### 🕒 時間週期選擇

預配置的週期選項，適用於各種時間相關的應用場景：

```vue
<PeriodButton v-model="selectedPeriod" />
<!-- 可選週期: 日、週、月、季、年、自定義 -->
```

### 🎨 多種顯示變體

三種不同的視覺風格，適應不同的設計需求：

```vue
<!-- 標準按鈕組 -->
<PeriodButton variant="buttons" />

<!-- 標籤頁風格 -->
<PeriodButton variant="tabs" />

<!-- 膠囊風格 -->
<PeriodButton variant="pills" />
```

### 🔄 選擇模式

支持單選和多選模式：

```vue
<!-- 單選模式 (預設) -->
<PeriodButton v-model="selectedPeriod" />

<!-- 多選模式 -->
<PeriodButton
  v-model:selectedPeriods="selectedPeriods"
  :allow-multiple="true"
/>
```

### 📱 響應式設計

自動適配不同螢幕尺寸，在移動設備上提供良好的用戶體驗。

## API 參考

### Props

| 屬性              | 類型           | 預設值                                        | 說明                      |
| ----------------- | -------------- | --------------------------------------------- | ------------------------- |
| `modelValue`      | `string`       | `'month'`                                     | 選中的週期值 (v-model)    |
| `periods`         | `PeriodType[]` | `['day', 'week', 'month', 'quarter', 'year']` | 可用的週期選項            |
| `size`            | `string`       | `'medium'`                                    | 按鈕大小                  |
| `disabled`        | `boolean`      | `false`                                       | 是否禁用所有按鈕          |
| `variant`         | `string`       | `'buttons'`                                   | 顯示變體                  |
| `allowMultiple`   | `boolean`      | `false`                                       | 是否允許多選              |
| `selectedPeriods` | `PeriodType[]` | `[]`                                          | 選中的週期陣列 (多選模式) |

### Events

| 事件                     | 參數                                                                       | 說明                 |
| ------------------------ | -------------------------------------------------------------------------- | -------------------- |
| `update:modelValue`      | `period`                                                                   | 單選模式下的週期變更 |
| `update:selectedPeriods` | `periods[]`                                                                | 多選模式下的週期變更 |
| `change`                 | `{ type, selectedPeriod, previousPeriod, selectedPeriods, clickedPeriod }` | 週期選擇變更事件     |

### 週期類型

| 週期類型  | 標籤   | 圖標                   | 說明           |
| --------- | ------ | ---------------------- | -------------- |
| `day`     | 日     | `fas fa-calendar-day`  | 按日查看       |
| `week`    | 週     | `fas fa-calendar-week` | 按週查看       |
| `month`   | 月     | `fas fa-calendar-alt`  | 按月查看       |
| `quarter` | 季     | `fas fa-calendar-plus` | 按季查看       |
| `year`    | 年     | `fas fa-calendar`      | 按年查看       |
| `custom`  | 自定義 | `fas fa-cog`           | 自定義時間範圍 |

### 顯示變體

| 變體      | 說明       | 適用場景                 |
| --------- | ---------- | ------------------------ |
| `buttons` | 標準按鈕組 | 一般用途，清晰的視覺分離 |
| `tabs`    | 標籤頁風格 | 內容切換，底部邊框指示器 |
| `pills`   | 膠囊風格   | 現代化設計，圓角按鈕     |

## 使用範例

### 基本用法

```vue
<template>
  <div>
    <h3>銷售數據分析</h3>
    <PeriodButton
      v-model="selectedPeriod"
      @change="handlePeriodChange"
    />

    <div class="chart-container">
      <!-- 根據選中的週期顯示相應的圖表 -->
      <SalesChart :period="selectedPeriod" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PeriodButton from "./PeriodButton.vue";
import SalesChart from "./SalesChart.vue";

const selectedPeriod = ref("month");

const handlePeriodChange = (changeData) => {
  console.log("週期變更:", changeData);
  // 處理週期變更邏輯
};
</script>
```

### 標籤頁風格

```vue
<template>
  <div>
    <PeriodButton
      v-model="selectedPeriod"
      variant="tabs"
      :periods="['day', 'week', 'month', 'quarter']"
      @change="handlePeriodChange"
    />

    <div class="content-area">
      <div v-if="selectedPeriod === 'day'">日報內容</div>
      <div v-else-if="selectedPeriod === 'week'">週報內容</div>
      <div v-else-if="selectedPeriod === 'month'">月報內容</div>
      <div v-else-if="selectedPeriod === 'quarter'">季報內容</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const selectedPeriod = ref("month");

const handlePeriodChange = (changeData) => {
  // 載入對應週期的數據
  loadDataForPeriod(changeData.selectedPeriod);
};
</script>
```

### 多選模式

```vue
<template>
  <div>
    <h3>比較分析</h3>
    <p>選擇要比較的週期：</p>

    <PeriodButton
      v-model:selectedPeriods="selectedPeriods"
      :allow-multiple="true"
      variant="pills"
      @change="handleMultipleChange"
    />

    <div class="comparison-charts">
      <div
        v-for="period in selectedPeriods"
        :key="period"
        class="chart-item"
      >
        <h4>{{ getPeriodLabel(period) }} 數據</h4>
        <ComparisonChart :period="period" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const selectedPeriods = ref(["month", "quarter"]);

const handleMultipleChange = (changeData) => {
  console.log("多選變更:", changeData.selectedPeriods);
  // 更新比較圖表
  updateComparisonCharts(changeData.selectedPeriods);
};

const getPeriodLabel = (period) => {
  const labels = {
    day: "日",
    week: "週",
    month: "月",
    quarter: "季",
    year: "年",
  };
  return labels[period] || period;
};
</script>
```

### 自定義週期配置

```vue
<template>
  <div>
    <PeriodButton
      v-model="selectedPeriod"
      :periods="customPeriods"
      variant="buttons"
      @change="handleCustomChange"
    >
      <template #period-content="{ period }">
        <span class="custom-period-content">
          <i :class="period.icon"></i>
          <span class="period-label">{{ period.label }}</span>
          <span class="period-desc">{{ period.description }}</span>
        </span>
      </template>
    </PeriodButton>
  </div>
</template>

<script setup>
import { ref } from "vue";

const selectedPeriod = ref("realtime");

const customPeriods = ["realtime", "hourly", "daily", "weekly"];

const handleCustomChange = (changeData) => {
  // 處理自定義週期變更
  console.log("自定義週期:", changeData.selectedPeriod);
};
</script>

<style scoped>
.custom-period-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.period-label {
  font-weight: 500;
}

.period-desc {
  font-size: 12px;
  opacity: 0.7;
}
</style>
```

### 響應式設計

```vue
<template>
  <div class="dashboard">
    <div class="period-selector">
      <PeriodButton
        v-model="selectedPeriod"
        variant="pills"
        size="medium"
        @change="handlePeriodChange"
      />
    </div>

    <div class="dashboard-content">
      <!-- 響應式內容 -->
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.period-selector {
  margin-bottom: 20px;
}

/* 移動設備適配 */
@media (max-width: 768px) {
  .dashboard {
    padding: 10px;
  }

  .period-selector {
    margin-bottom: 15px;
  }
}
</style>
```

## 最佳實踐

### 1. 語義化週期選擇

根據實際業務需求選擇合適的週期：

```vue
<!-- ✅ 正確：根據業務需求選擇週期 -->
<PeriodButton :periods="['day', 'week', 'month']" v-model="selectedPeriod" />

<!-- ❌ 錯誤：包含不相關的週期 -->
<PeriodButton
  :periods="['day', 'week', 'month', 'quarter', 'year', 'custom']"
  v-model="selectedPeriod"
/>
```

### 2. 變體選擇

根據使用場景選擇合適的顯示變體：

```vue
<!-- 內容切換場景 -->
<PeriodButton variant="tabs" />

<!-- 數據篩選場景 -->
<PeriodButton variant="pills" />

<!-- 一般操作場景 -->
<PeriodButton variant="buttons" />
```

### 3. 多選模式使用

謹慎使用多選模式，確保用戶體驗：

```vue
<!-- ✅ 正確：明確的多選用途 -->
<PeriodButton
  :allow-multiple="true"
  v-model:selectedPeriods="comparisonPeriods"
/>

<!-- ❌ 錯誤：不必要的多選 -->
<PeriodButton :allow-multiple="true" v-model:selectedPeriods="singlePeriod" />
```

### 4. 事件處理

提供適當的事件處理和用戶反饋：

```vue
<script setup>
const handlePeriodChange = (changeData) => {
  // 顯示載入狀態
  showLoading();

  // 載入新數據
  loadDataForPeriod(changeData.selectedPeriod)
    .then(() => {
      hideLoading();
      showSuccess("數據已更新");
    })
    .catch((error) => {
      hideLoading();
      showError("載入失敗：" + error.message);
    });
};
</script>
```

### 5. 無障礙性

確保組件的無障礙性：

```vue
<PeriodButton
  v-model="selectedPeriod"
  aria-label="選擇時間週期"
  role="tablist"
/>
```

## 擴展指南

### 添加新的週期類型

1. 在 `PeriodConfigManager` 中添加新的配置：

```javascript
static defaultPeriods = {
  // 現有週期...
  biweekly: {
    value: 'biweekly',
    label: '雙週',
    icon: 'fas fa-calendar-week',
    description: '按雙週查看'
  }
};
```

2. 更新 TypeScript 類型定義：

```typescript
type PeriodType =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "custom"
  | "biweekly";
```

### 自定義樣式

創建自定義的 CSS 變體：

```vue
<style scoped>
.period-button-group--custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 8px;
}

.period-button--custom {
  border-radius: 8px;
  border: none;
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.period-button--custom.period-button--selected {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
```

### 國際化支持

支持多語言週期標籤：

```javascript
class PeriodConfigManager {
  static getLocalizedPeriods(locale = "zh-TW") {
    const localizedLabels = {
      "zh-TW": {
        day: "日",
        week: "週",
        month: "月",
        quarter: "季",
        year: "年",
      },
      "en-US": {
        day: "Day",
        week: "Week",
        month: "Month",
        quarter: "Quarter",
        year: "Year",
      },
    };

    const labels = localizedLabels[locale] || localizedLabels["zh-TW"];

    return Object.keys(this.defaultPeriods).map((period) => ({
      ...this.defaultPeriods[period],
      label: labels[period] || period,
    }));
  }
}
```

## 測試指南

### 單元測試

```javascript
import { mount } from "@vue/test-utils";
import PeriodButton from "./PeriodButton.vue";

describe("PeriodButton", () => {
  it("應該正確渲染預設週期", () => {
    const wrapper = mount(PeriodButton);
    const buttons = wrapper.findAll(".period-button");

    expect(buttons).toHaveLength(5); // day, week, month, quarter, year
  });

  it("應該在單選模式下正確更新值", async () => {
    const wrapper = mount(PeriodButton, {
      props: { modelValue: "month" },
    });

    await wrapper.find('[data-period="week"]').trigger("click");

    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["week"]);
  });

  it("應該在多選模式下正確處理選擇", async () => {
    const wrapper = mount(PeriodButton, {
      props: {
        allowMultiple: true,
        selectedPeriods: ["month"],
      },
    });

    await wrapper.find('[data-period="week"]').trigger("click");

    expect(wrapper.emitted("update:selectedPeriods")[0][0]).toContain("week");
    expect(wrapper.emitted("update:selectedPeriods")[0][0]).toContain("month");
  });

  it("應該在禁用狀態下不響應點擊", async () => {
    const wrapper = mount(PeriodButton, {
      props: { disabled: true, modelValue: "month" },
    });

    await wrapper.find('[data-period="week"]').trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  });
});
```

### 整合測試

```javascript
describe("PeriodButton Integration", () => {
  it("應該與圖表組件正確整合", async () => {
    const wrapper = mount({
      components: { PeriodButton, Chart },
      template: `
        <div>
          <PeriodButton v-model="period" @change="handleChange" />
          <Chart :period="period" />
        </div>
      `,
      data() {
        return { period: "month" };
      },
      methods: {
        handleChange(changeData) {
          this.period = changeData.selectedPeriod;
        },
      },
    });

    await wrapper.find('[data-period="week"]').trigger("click");

    expect(wrapper.vm.period).toBe("week");
    expect(wrapper.findComponent(Chart).props("period")).toBe("week");
  });
});
```

## 總結

`PeriodButton` 組件提供了一個強大而靈活的解決方案，用於時間週期選擇。它通過預配置的週期選項、多種顯示變體和靈活的選擇模式，大大簡化了時間相關功能的開發，同時保持了與基礎 `Button` 組件的完全兼容性。

遵循 SOLID 原則的設計使得組件具有良好的可維護性和擴展性，可以輕鬆適應不同的使用場景和需求。響應式設計確保了在不同設備上的一致體驗。
