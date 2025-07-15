<!-- ActionButton.vue -->
<template>
    <Button :type="buttonType" :size="size" :disabled="disabled || loading"
        :left-icon="loading ? loadingIcon : leftIcon" :right-icon="rightIcon" :backgroundColor="backgroundColor"
        @click="handleAction">
        <slot>
            {{ loading ? loadingText : label }}
        </slot>
    </Button>
</template>

<script setup>
import { computed } from 'vue';
import Button from './Button.vue';

/**
 * Single Responsibility Principle (SRP): Action type validation logic
 * @typedef {'submit' | 'delete' | 'save' | 'cancel' | 'confirm' | 'default'} ActionType
 */

/**
 * Interface Segregation Principle (ISP): Define specific interfaces for ActionButton
 * @typedef {Object} ActionButtonProps
 * @property {string} [label] - Button text
 * @property {ActionType} [action] - Action type (submit, delete, save, cancel, confirm, default)
 * @property {boolean} [loading] - Whether button is in loading state
 * @property {string} [loadingText] - Text to show during loading
 * @property {string} [loadingIcon] - Icon to show during loading
 * @property {string} [type] - Button type override
 * @property {string} [size] - Button size
 * @property {string} [backgroundColor] - Custom background color
 * @property {boolean} [disabled] - Whether button is disabled
 * @property {string} [leftIcon] - CSS class for left icon
 * @property {string} [rightIcon] - CSS class for right icon
 */

/**
 * Single Responsibility Principle (SRP): Action type mapping logic
 * Open/Closed Principle (OCP): Easy to extend with new action types
 */
class ActionTypeMapper {
    /**
     * Map of action types to button types
     * @type {Object.<ActionType, string>}
     */
    static actionTypeMap = {
        submit: 'primary',
        delete: 'danger',
        save: 'success',
        cancel: 'secondary',
        confirm: 'primary',
        default: 'secondary'
    };

    /**
     * Get button type for a specific action
     * @param {ActionType} action - The action type
     * @param {string} fallbackType - Fallback button type
     * @returns {string} The corresponding button type
     */
    static getButtonType(action, fallbackType = 'secondary') {
        return this.actionTypeMap[action] || fallbackType;
    }

    /**
     * Get all available action types
     * @returns {ActionType[]} Array of available action types
     */
    static getAvailableActions() {
        return Object.keys(this.actionTypeMap);
    }

    /**
     * Check if an action type is valid
     * @param {string} action - Action to validate
     * @returns {boolean} Whether the action is valid
     */
    static isValidAction(action) {
        return this.getAvailableActions().includes(action);
    }
}

/**
 * Single Responsibility Principle (SRP): Loading state management
 */
class LoadingStateManager {
    /**
     * Default loading icon
     * @type {string}
     */
    static defaultLoadingIcon = 'fas fa-spinner fa-spin';

    /**
     * Default loading text
     * @type {string}
     */
    static defaultLoadingText = '載入中...';

    /**
     * Get loading icon
     * @param {string} customIcon - Custom loading icon
     * @returns {string} Loading icon class
     */
    static getLoadingIcon(customIcon = '') {
        return customIcon || this.defaultLoadingIcon;
    }

    /**
     * Get loading text
     * @param {string} customText - Custom loading text
     * @returns {string} Loading text
     */
    static getLoadingText(customText = '') {
        return customText || this.defaultLoadingText;
    }
}

// Props definition
const props = defineProps({
    // Action type
    action: {
        type: String,
        default: 'default',
        validator: (value) => ActionTypeMapper.isValidAction(value)
    },
    // Loading state
    loading: {
        type: Boolean,
        default: false
    },
    // Loading text
    loadingText: {
        type: String,
        default: LoadingStateManager.defaultLoadingText
    },
    // Loading icon
    loadingIcon: {
        type: String,
        default: LoadingStateManager.defaultLoadingIcon
    },
    // Inherit all Button props
    label: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'secondary'
    },
    size: {
        type: String,
        default: 'medium'
    },
    backgroundColor: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    leftIcon: {
        type: String,
        default: ''
    },
    rightIcon: {
        type: String,
        default: ''
    },
    primary: {
        type: Boolean,
        default: false
    }
});

// Emits definition
const emit = defineEmits(['action', 'click']);

// Computed properties
const buttonType = computed(() => {
    // If primary prop is true, use 'primary' type
    if (props.primary) {
        return 'primary';
    }

    // Map action to button type, fallback to props.type
    return ActionTypeMapper.getButtonType(props.action, props.type);
});

// Methods
const handleAction = (event) => {
    if (!props.loading && !props.disabled) {
        // Emit action event with action type and original event
        emit('action', {
            action: props.action,
            event,
            timestamp: new Date().toISOString()
        });

        // Emit click event for backward compatibility
        emit('click', event);
    }
};
</script>