import { fn } from 'storybook/test';
import { ref, reactive } from 'vue';

import PeriodButton from './PeriodButton.vue';

/**
 * PeriodButton Component Stories
 * 
 * This component extends the base Button component to create period selection buttons:
 * - Time period selection (day, week, month, quarter, year, custom)
 * - Multiple display variants (buttons, tabs, pills)
 * - Single and multiple selection modes
 * - Responsive design
 * - Customizable period configurations
 */

export default {
  title: 'Components/PeriodButton',
  component: PeriodButton,
  parameters: {
    docs: {
      description: {
        component: `
## PeriodButton Component

A high-level button group component for time period selection that extends the base Button component.

### Key Features:
- **Time Period Selection**: Pre-configured periods (day, week, month, quarter, year, custom)
- **Multiple Variants**: Buttons, tabs, and pills display styles
- **Selection Modes**: Single and multiple selection support
- **Responsive Design**: Adapts to different screen sizes
- **Customizable**: Easy to configure periods and styling

### Period Types:
- \`day\` → 日 (Daily view)
- \`week\` → 週 (Weekly view)
- \`month\` → 月 (Monthly view)
- \`quarter\` → 季 (Quarterly view)
- \`year\` → 年 (Yearly view)
- \`custom\` → 自定義 (Custom range)

### Display Variants:
- \`buttons\` → Standard button group
- \`tabs\` → Tab-style interface
- \`pills\` → Pill-style buttons

### Usage Examples:
\`\`\`vue
<!-- Basic usage -->
<PeriodButton v-model="selectedPeriod" @change="handlePeriodChange" />

<!-- With custom periods -->
<PeriodButton 
  v-model="selectedPeriod"
  :periods="['day', 'week', 'month']"
  variant="tabs"
  @change="handlePeriodChange"
/>

<!-- Multiple selection -->
<PeriodButton 
  v-model:selectedPeriods="selectedPeriods"
  :allow-multiple="true"
  variant="pills"
  @change="handleMultipleChange"
/>
\`\`\`
        `
      }
    }
  },
  argTypes: {
    modelValue: {
      control: { type: 'select' },
      options: ['day', 'week', 'month', 'quarter', 'year', 'custom'],
      description: 'Selected period value (v-model)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'month' }
      }
    },
    periods: {
      control: { type: 'object' },
      description: 'Available periods to show',
      table: {
        type: { summary: 'PeriodType[]' },
        defaultValue: { summary: "['day', 'week', 'month', 'quarter', 'year']" }
      }
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Button size',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' }
      }
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether buttons are disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    variant: {
      control: { type: 'select' },
      options: ['buttons', 'tabs', 'pills'],
      description: 'Display variant',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'buttons' }
      }
    },
    allowMultiple: {
      control: { type: 'boolean' },
      description: 'Allow multiple selection',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    selectedPeriods: {
      control: { type: 'object' },
      description: 'Selected periods (for multiple mode)',
      table: {
        type: { summary: 'PeriodType[]' },
        defaultValue: { summary: '[]' }
      }
    },
    onChange: {
      action: 'changed',
      description: 'Emitted when period selection changes',
      table: {
        type: { summary: 'function' }
      }
    },
    onUpdateModelValue: {
      action: 'update:modelValue',
      description: 'Emitted when single selection changes',
      table: {
        type: { summary: 'function' }
      }
    },
    onUpdateSelectedPeriods: {
      action: 'update:selectedPeriods',
      description: 'Emitted when multiple selection changes',
      table: {
        type: { summary: 'function' }
      }
    }
  },
  // Use `fn` to spy on the action args, which will appear in the actions panel once invoked
  args: { 
    onChange: fn(),
    onUpdateModelValue: fn(),
    onUpdateSelectedPeriods: fn()
  }
};

// Base template for all stories
const Template = (args) => ({
  components: { PeriodButton },
  setup() {
    return { args };
  },
  template: `
    <PeriodButton 
      v-bind="args" 
      @change="args.onChange"
      @update:modelValue="args.onUpdateModelValue"
      @update:selectedPeriods="args.onUpdateSelectedPeriods"
    />
  `
});

// Story 1: Default PeriodButton
export const Default = Template.bind({});
Default.args = {
  modelValue: 'month',
  periods: ['day', 'week', 'month', 'quarter', 'year']
};
Default.parameters = {
  docs: {
    description: {
      story: 'Basic PeriodButton with default configuration. Shows day, week, month, quarter, and year options with month selected by default.'
    }
  }
};

// Story 2: Buttons Variant
export const Buttons = Template.bind({});
Buttons.args = {
  modelValue: 'week',
  variant: 'buttons',
  periods: ['day', 'week', 'month', 'quarter', 'year']
};
Buttons.parameters = {
  docs: {
    description: {
      story: 'PeriodButton in buttons variant. Standard button group layout with clear visual separation.'
    }
  }
};

// Story 3: Tabs Variant
export const Tabs = Template.bind({});
Tabs.args = {
  modelValue: 'month',
  variant: 'tabs',
  periods: ['day', 'week', 'month', 'quarter', 'year']
};
Tabs.parameters = {
  docs: {
    description: {
      story: 'PeriodButton in tabs variant. Tab-style interface with bottom border indicator for selected period.'
    }
  }
};

// Story 4: Pills Variant
export const Pills = Template.bind({});
Pills.args = {
  modelValue: 'quarter',
  variant: 'pills',
  periods: ['day', 'week', 'month', 'quarter', 'year']
};
Pills.parameters = {
  docs: {
    description: {
      story: 'PeriodButton in pills variant. Rounded pill-style buttons with smooth transitions.'
    }
  }
};

// Story 5: Multiple Selection
export const MultipleSelection = (args) => ({
  components: { PeriodButton },
  setup() {
    const selectedPeriods = ref(['month', 'quarter']);
    
    const handleChange = (changeData) => {
      console.log('Period change:', changeData);
    };
    
    return { 
      args, 
      selectedPeriods, 
      handleChange 
    };
  },
  template: `
    <div>
      <h4>Multiple Selection Mode</h4>
      <p>Selected periods: {{ selectedPeriods.join(', ') }}</p>
      <PeriodButton 
        v-model:selectedPeriods="selectedPeriods"
        :allow-multiple="true"
        variant="pills"
        @change="handleChange"
      />
    </div>
  `
});
MultipleSelection.args = {
  periods: ['day', 'week', 'month', 'quarter', 'year']
};
MultipleSelection.parameters = {
  docs: {
    description: {
      story: 'PeriodButton with multiple selection enabled. Users can select multiple periods simultaneously.'
    }
  }
};

// Story 6: Custom Periods
export const CustomPeriods = Template.bind({});
CustomPeriods.args = {
  modelValue: 'custom',
  periods: ['day', 'week', 'month', 'custom']
};
CustomPeriods.parameters = {
  docs: {
    description: {
      story: 'PeriodButton with custom period configuration. Shows only specific periods including custom option.'
    }
  }
};

// Story 7: Different Sizes
export const Sizes = (args) => ({
  components: { PeriodButton },
  setup() {
    return { args };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div>
        <h4>Small Size</h4>
        <PeriodButton 
          v-bind="args"
          size="small"
          model-value="month"
        />
      </div>
      
      <div>
        <h4>Medium Size (Default)</h4>
        <PeriodButton 
          v-bind="args"
          size="medium"
          model-value="month"
        />
      </div>
      
      <div>
        <h4>Large Size</h4>
        <PeriodButton 
          v-bind="args"
          size="large"
          model-value="month"
        />
      </div>
    </div>
  `
});
Sizes.args = {
  periods: ['day', 'week', 'month']
};
Sizes.parameters = {
  docs: {
    description: {
      story: 'PeriodButton in different sizes: small, medium, and large. All maintain consistent styling and behavior.'
    }
  }
};

// Story 8: Disabled State
export const Disabled = Template.bind({});
Disabled.args = {
  modelValue: 'month',
  disabled: true,
  periods: ['day', 'week', 'month', 'quarter', 'year']
};
Disabled.parameters = {
  docs: {
    description: {
      story: 'Disabled PeriodButton. All buttons are visually disabled and cannot be clicked.'
    }
  }
};

// Story 9: All Variants
export const AllVariants = (args) => ({
  components: { PeriodButton },
  setup() {
    return { args };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 30px;">
      <div>
        <h3>Buttons Variant</h3>
        <PeriodButton 
          v-bind="args"
          variant="buttons"
          model-value="month"
        />
      </div>
      
      <div>
        <h3>Tabs Variant</h3>
        <PeriodButton 
          v-bind="args"
          variant="tabs"
          model-value="month"
        />
      </div>
      
      <div>
        <h3>Pills Variant</h3>
        <PeriodButton 
          v-bind="args"
          variant="pills"
          model-value="month"
        />
      </div>
    </div>
  `
});
AllVariants.args = {
  periods: ['day', 'week', 'month', 'quarter', 'year']
};
AllVariants.parameters = {
  docs: {
    description: {
      story: 'All available display variants: buttons, tabs, and pills. Each variant has its own unique styling and behavior.'
    }
  }
};

// Story 10: Interactive Example
export const Interactive = (args) => ({
  components: { PeriodButton },
  setup() {
    const state = reactive({
      selectedPeriod: 'month',
      selectedPeriods: ['month', 'quarter'],
      message: '',
      isMultipleMode: false
    });

    const handleSingleChange = (changeData) => {
      state.message = `切換到: ${changeData.selectedPeriod}`;
      console.log('Single selection change:', changeData);
    };

    const handleMultipleChange = (changeData) => {
      state.message = `已選擇: ${changeData.selectedPeriods.join(', ')}`;
      console.log('Multiple selection change:', changeData);
    };

    const toggleMode = () => {
      state.isMultipleMode = !state.isMultipleMode;
      state.message = `切換到 ${state.isMultipleMode ? '多選' : '單選'} 模式`;
    };

    return { 
      args, 
      state, 
      handleSingleChange, 
      handleMultipleChange, 
      toggleMode 
    };
  },
  template: `
    <div style="max-width: 800px;">
      <div style="margin-bottom: 20px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
        <h3 style="margin: 0 0 12px 0;">互動演示</h3>
        <p style="margin: 0 0 16px 0; color: #666;">點擊按鈕查看週期選擇功能</p>
        
        <div style="margin-bottom: 16px;">
          <button 
            @click="toggleMode"
            style="padding: 8px 16px; background: #1ea7fd; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            切換到 {{ state.isMultipleMode ? '單選' : '多選' }} 模式
          </button>
        </div>
        
        <div v-if="state.message" style="padding: 8px; background: #e8f5e8; border-radius: 4px; color: #2d5a2d;">
          {{ state.message }}
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4>當前模式: {{ state.isMultipleMode ? '多選' : '單選' }}</h4>
        <p v-if="!state.isMultipleMode">選擇的週期: {{ state.selectedPeriod }}</p>
        <p v-else>選擇的週期: {{ state.selectedPeriods.join(', ') }}</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <PeriodButton 
          v-if="!state.isMultipleMode"
          v-model="state.selectedPeriod"
          variant="pills"
          @change="handleSingleChange"
        />
        <PeriodButton 
          v-else
          v-model:selectedPeriods="state.selectedPeriods"
          :allow-multiple="true"
          variant="pills"
          @change="handleMultipleChange"
        />
      </div>
      
      <div style="font-size: 14px; color: #666;">
        <p><strong>功能特點：</strong></p>
        <ul>
          <li>支持單選和多選模式</li>
          <li>三種顯示變體：按鈕、標籤頁、膠囊</li>
          <li>響應式設計，適配不同螢幕尺寸</li>
          <li>可自定義週期配置</li>
          <li>基於 Button 組件，保持一致的設計語言</li>
        </ul>
      </div>
    </div>
  `
});
Interactive.args = {
  periods: ['day', 'week', 'month', 'quarter', 'year']
};
Interactive.parameters = {
  docs: {
    description: {
      story: 'Interactive demonstration showing PeriodButton functionality. Toggle between single and multiple selection modes.'
    }
  }
};

// Story 11: Custom Content
export const CustomContent = (args) => ({
  components: { PeriodButton },
  setup() {
    return { args };
  },
  template: `
    <div>
      <h4>Custom Period Content</h4>
      <PeriodButton 
        v-bind="args"
        model-value="month"
      >
        <template #period-content="{ period }">
          <span style="display: flex; align-items: center; gap: 6px;">
            <i :class="period.icon" style="font-size: 14px;"></i>
            <span>{{ period.label }}</span>
            <span style="font-size: 12px; opacity: 0.7;">({{ period.description }})</span>
          </span>
        </template>
      </PeriodButton>
    </div>
  `
});
CustomContent.args = {
  periods: ['day', 'week', 'month', 'quarter', 'year']
};
CustomContent.parameters = {
  docs: {
    description: {
      story: 'PeriodButton with custom slot content. Demonstrates how to customize the display of each period button.'
    }
  }
};

// Story 12: Responsive Design
export const Responsive = (args) => ({
  components: { PeriodButton },
  setup() {
    return { args };
  },
  template: `
    <div style="max-width: 100%;">
      <h4>Responsive Design Test</h4>
      <p>調整瀏覽器視窗大小來查看響應式效果</p>
      
      <div style="margin-bottom: 20px;">
        <h5>Buttons Variant</h5>
        <PeriodButton 
          v-bind="args"
          variant="buttons"
          model-value="month"
        />
      </div>
      
      <div style="margin-bottom: 20px;">
        <h5>Tabs Variant</h5>
        <PeriodButton 
          v-bind="args"
          variant="tabs"
          model-value="month"
        />
      </div>
      
      <div style="margin-bottom: 20px;">
        <h5>Pills Variant</h5>
        <PeriodButton 
          v-bind="args"
          variant="pills"
          model-value="month"
        />
      </div>
    </div>
  `
});
Responsive.args = {
  periods: ['day', 'week', 'month', 'quarter', 'year', 'custom']
};
Responsive.parameters = {
  docs: {
    description: {
      story: 'Responsive design demonstration. PeriodButton adapts to different screen sizes with appropriate layout changes.'
    }
  }
}; 