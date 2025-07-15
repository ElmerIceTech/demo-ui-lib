<template>
    <div class="period-button-group" :class="groupClasses">
        <Button v-for="period in availablePeriods" :key="period.value" :type="getButtonType(period.value)" :size="size"
            :disabled="disabled" :class="getButtonClasses(period.value)" @click="handlePeriodClick(period.value)">
            <slot name="period-content" :period="period">
                {{ period.label }}
            </slot>
        </Button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import Button from './Button.vue';

/**
 * Single Responsibility Principle (SRP): Period type validation logic
 * @typedef {'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom'} PeriodType
 */

/**
 * Interface Segregation Principle (ISP): Define specific interfaces for PeriodButton
 * @typedef {Object} PeriodOption
 * @property {PeriodType} value - Period value
 * @property {string} label - Display label
 * @property {string} [icon] - Optional icon class
 * @property {string} [description] - Optional description
 */

/**
 * @typedef {Object} PeriodButtonProps
 * @property {PeriodType} [modelValue] - Selected period value
 * @property {PeriodType[]} [periods] - Available periods to show
 * @property {string} [size] - Button size
 * @property {boolean} [disabled] - Whether buttons are disabled
 * @property {string} [variant] - Display variant (tabs, pills, buttons)
 * @property {boolean} [allowMultiple] - Allow multiple selection
 * @property {PeriodType[]} [selectedPeriods] - Selected periods (for multiple mode)
 */

/**
 * Single Responsibility Principle (SRP): Period configuration management
 * Open/Closed Principle (OCP): Easy to extend with new period types
 */
class PeriodConfigManager {
    /**
     * Default period configurations
     * @type {Object.<PeriodType, PeriodOption>}
     */
    static defaultPeriods = {
        day: {
            value: 'day',
            label: '日',
            icon: 'fas fa-calendar-day',
            description: '按日查看'
        },
        week: {
            value: 'week',
            label: '週',
            icon: 'fas fa-calendar-week',
            description: '按週查看'
        },
        month: {
            value: 'month',
            label: '月',
            icon: 'fas fa-calendar-alt',
            description: '按月查看'
        },
        quarter: {
            value: 'quarter',
            label: '季',
            icon: 'fas fa-calendar-plus',
            description: '按季查看'
        },
        year: {
            value: 'year',
            label: '年',
            icon: 'fas fa-calendar',
            description: '按年查看'
        },
        custom: {
            value: 'custom',
            label: '自定義',
            icon: 'fas fa-cog',
            description: '自定義時間範圍'
        }
    };

    /**
     * Get period configuration
     * @param {PeriodType} period - Period type
     * @returns {PeriodOption} Period configuration
     */
    static getPeriodConfig(period) {
        return this.defaultPeriods[period] || {
            value: period,
            label: period,
            icon: 'fas fa-clock'
        };
    }

    /**
     * Get all available period configurations
     * @param {PeriodType[]} periods - Period types to include
     * @returns {PeriodOption[]} Array of period configurations
     */
    static getPeriodConfigs(periods = ['day', 'week', 'month', 'quarter', 'year']) {
        return periods.map(period => this.getPeriodConfig(period));
    }

    /**
     * Check if a period type is valid
     * @param {string} period - Period to validate
     * @returns {boolean} Whether the period is valid
     */
    static isValidPeriod(period) {
        return Object.keys(this.defaultPeriods).includes(period);
    }

    /**
     * Get all available period types
     * @returns {PeriodType[]} Array of available period types
     */
    static getAvailablePeriods() {
        return Object.keys(this.defaultPeriods);
    }
}

/**
 * Single Responsibility Principle (SRP): Button styling logic
 */
class PeriodButtonStyler {
    /**
     * Get button type based on selection state
     * @param {boolean} isSelected - Whether button is selected
     * @param {string} variant - Display variant
     * @returns {string} Button type
     */
    static getButtonType(isSelected, variant = 'buttons') {
        if (variant === 'tabs') {
            return isSelected ? 'primary' : 'secondary';
        }
        return isSelected ? 'primary' : 'secondary';
    }

    /**
     * Get button classes based on variant and state
     * @param {boolean} isSelected - Whether button is selected
     * @param {string} variant - Display variant
     * @returns {Object} CSS classes object
     */
    static getButtonClasses(isSelected, variant = 'buttons') {
        const baseClasses = {
            'period-button': true,
            'period-button--selected': isSelected
        };

        switch (variant) {
            case 'tabs':
                return {
                    ...baseClasses,
                    'period-button--tabs': true
                };
            case 'pills':
                return {
                    ...baseClasses,
                    'period-button--pills': true
                };
            case 'buttons':
            default:
                return {
                    ...baseClasses,
                    'period-button--buttons': true
                };
        }
    }

    /**
     * Get group classes based on variant
     * @param {string} variant - Display variant
     * @returns {Object} CSS classes object
     */
    static getGroupClasses(variant = 'buttons') {
        return {
            'period-button-group': true,
            [`period-button-group--${variant}`]: true
        };
    }
}

// Props definition
const props = defineProps({
    // Selected period value (v-model)
    modelValue: {
        type: String,
        default: 'month',
        validator: (value) => ['day', 'week', 'month', 'quarter', 'year', 'custom'].includes(value)
    },
    // Available periods to show
    periods: {
        type: Array,
        default: () => ['day', 'week', 'month', 'quarter', 'year'],
        validator: (value) => value.every(period => ['day', 'week', 'month', 'quarter', 'year', 'custom'].includes(period))
    },
    // Button size
    size: {
        type: String,
        default: 'medium',
        validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    // Whether buttons are disabled
    disabled: {
        type: Boolean,
        default: false
    },
    // Display variant
    variant: {
        type: String,
        default: 'buttons',
        validator: (value) => ['buttons', 'tabs', 'pills'].includes(value)
    },
    // Allow multiple selection
    allowMultiple: {
        type: Boolean,
        default: false
    },
    // Selected periods (for multiple mode)
    selectedPeriods: {
        type: Array,
        default: () => [],
        validator: (value) => value.every(period => ['day', 'week', 'month', 'quarter', 'year', 'custom'].includes(period))
    }
});

// Emits definition
const emit = defineEmits(['update:modelValue', 'update:selectedPeriods', 'change']);

// Computed properties
const availablePeriods = computed(() => {
    const defaultPeriods = {
        day: {
            value: 'day',
            label: '日',
            icon: 'fas fa-calendar-day',
            description: '按日查看'
        },
        week: {
            value: 'week',
            label: '週',
            icon: 'fas fa-calendar-week',
            description: '按週查看'
        },
        month: {
            value: 'month',
            label: '月',
            icon: 'fas fa-calendar-alt',
            description: '按月查看'
        },
        quarter: {
            value: 'quarter',
            label: '季',
            icon: 'fas fa-calendar-plus',
            description: '按季查看'
        },
        year: {
            value: 'year',
            label: '年',
            icon: 'fas fa-calendar',
            description: '按年查看'
        },
        custom: {
            value: 'custom',
            label: '自定義',
            icon: 'fas fa-cog',
            description: '自定義時間範圍'
        }
    };

    return props.periods.map(period =>
        defaultPeriods[period] || {
            value: period,
            label: period,
            icon: 'fas fa-clock'
        }
    );
});

const groupClasses = computed(() => {
    const baseClasses = {
        'period-button-group': true,
        [`period-button-group--${props.variant}`]: true
    };
    return baseClasses;
});

// Methods
const isSelected = (periodValue) => {
    if (props.allowMultiple) {
        return props.selectedPeriods.includes(periodValue);
    }
    return props.modelValue === periodValue;
};

const getButtonType = (periodValue) => {
    const selected = isSelected(periodValue);
    if (props.variant === 'tabs') {
        return selected ? 'primary' : 'secondary';
    }
    return selected ? 'primary' : 'secondary';
};

const getButtonClasses = (periodValue) => {
    const selected = isSelected(periodValue);
    const baseClasses = {
        'period-button': true,
        'period-button--selected': selected
    };

    switch (props.variant) {
        case 'tabs':
            return {
                ...baseClasses,
                'period-button--tabs': true
            };
        case 'pills':
            return {
                ...baseClasses,
                'period-button--pills': true
            };
        case 'buttons':
        default:
            return {
                ...baseClasses,
                'period-button--buttons': true
            };
    }
};

const handlePeriodClick = (periodValue) => {
    if (props.disabled) return;

    if (props.allowMultiple) {
        // Multiple selection mode
        const newSelectedPeriods = [...props.selectedPeriods];
        const index = newSelectedPeriods.indexOf(periodValue);

        if (index > -1) {
            newSelectedPeriods.splice(index, 1);
        } else {
            newSelectedPeriods.push(periodValue);
        }

        emit('update:selectedPeriods', newSelectedPeriods);
        emit('change', {
            type: 'multiple',
            selectedPeriods: newSelectedPeriods,
            clickedPeriod: periodValue
        });
    } else {
        // Single selection mode
        if (props.modelValue !== periodValue) {
            emit('update:modelValue', periodValue);
            emit('change', {
                type: 'single',
                selectedPeriod: periodValue,
                previousPeriod: props.modelValue
            });
        }
    }
};
</script>

<style scoped>
.period-button-group {
    display: flex;
    gap: 8px;
    align-items: center;
}

.period-button-group--tabs {
    border-bottom: 1px solid #e0e0e0;
    gap: 0;
}

.period-button-group--pills {
    gap: 4px;
}

.period-button-group--buttons {
    gap: 8px;
}

.period-button {
    transition: all 0.2s ease;
}

.period-button--tabs {
    border-radius: 0;
    border-bottom: 2px solid transparent;
}

.period-button--tabs.period-button--selected {
    border-bottom-color: #1ea7fd;
    background-color: transparent;
    color: #1ea7fd;
}

.period-button--pills {
    border-radius: 20px;
    padding: 6px 16px;
}

.period-button--pills.period-button--selected {
    background-color: #1ea7fd;
    color: white;
    border-color: #1ea7fd;
}

.period-button--buttons {
    border-radius: 6px;
}

.period-button--buttons.period-button--selected {
    background-color: #1ea7fd;
    color: white;
    border-color: #1ea7fd;
}

/* Responsive design */
@media (max-width: 768px) {
    .period-button-group {
        flex-wrap: wrap;
        gap: 4px;
    }

    .period-button-group--tabs {
        gap: 0;
    }
}
</style>