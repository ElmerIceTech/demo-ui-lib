<template>
  <button type="button" :class="buttonClasses" @click="handleClick" :style="buttonStyles" :disabled="disabled">
    <!-- Left Icon Slot -->
    <span v-if="$slots.leftIcon || leftIcon" class="button-icon button-icon--left">
      <slot name="leftIcon">
        <i v-if="leftIcon" :class="leftIcon"></i>
      </slot>
    </span>

    <!-- Button Content -->
    <span class="button-content">
      <slot>{{ label }}</slot>
    </span>

    <!-- Right Icon Slot -->
    <span v-if="$slots.rightIcon || rightIcon" class="button-icon button-icon--right">
      <slot name="rightIcon">
        <i v-if="rightIcon" :class="rightIcon"></i>
      </slot>
    </span>
  </button>
</template>

<script>
import { computed, reactive } from 'vue';
import './button.css';

/**
 * Single Responsibility Principle (SRP): Separate size validation logic
 * @typedef {'small' | 'medium' | 'large'} ButtonSize
 */

/**
 * Single Responsibility Principle (SRP): Separate button type validation logic
 * @typedef {'primary' | 'secondary' | 'danger' | 'success' | 'warning'} ButtonType
 */

/**
 * Interface Segregation Principle (ISP): Define specific interfaces for different concerns
 * @typedef {Object} ButtonProps
 * @property {string} [label] - Button text
 * @property {ButtonType} [type] - Button type (primary, secondary, danger, success, warning)
 * @property {ButtonSize} [size] - Button size
 * @property {string} [backgroundColor] - Custom background color
 * @property {boolean} [disabled] - Whether button is disabled
 * @property {string} [leftIcon] - CSS class for left icon (e.g., 'fas fa-arrow-left')
 * @property {string} [rightIcon] - CSS class for right icon (e.g., 'fas fa-arrow-right')
 */

/**
 * @typedef {Object} ButtonStyles
 * @property {string} [backgroundColor] - Background color
 * @property {string} [padding] - Button padding
 * @property {string} [fontSize] - Font size
 * @property {string} [minHeight] - Minimum height
 * @property {string} [display] - Display property for flex layout
 * @property {string} [alignItems] - Align items for flex layout
 * @property {string} [gap] - Gap between elements
 * @property {string} [color] - Text color
 * @property {string} [borderColor] - Border color
 * @property {*} [key] - Additional style properties
 */

/**
 * @typedef {Object.<string, boolean>} ButtonClasses
 */

/**
 * @typedef {Object} ButtonDimensions
 * @property {string} padding - CSS padding value
 * @property {string} fontSize - CSS font-size value
 * @property {string} minHeight - CSS min-height value
 * @property {string} iconSize - CSS size for icons
 * @property {string} gap - CSS gap between elements
 */

/**
 * Single Responsibility Principle (SRP): Size mapping logic separated from button component
 * Open/Closed Principle (OCP): Easy to extend with new sizes without modifying existing code
 */
class ButtonSizeMapper {
  /**
   * Map of button sizes to their corresponding dimensions
   * @type {Object.<ButtonSize, ButtonDimensions>}
   */
  static sizeMap = {
    small: {
      padding: '8px 16px',
      fontSize: '12px',
      minHeight: '32px',
      iconSize: '12px',
      gap: '6px'
    },
    medium: {
      padding: '12px 24px',
      fontSize: '14px',
      minHeight: '40px',
      iconSize: '14px',
      gap: '8px'
    },
    large: {
      padding: '16px 32px',
      fontSize: '16px',
      minHeight: '48px',
      iconSize: '16px',
      gap: '10px'
    }
  };

  /**
   * Get dimensions for a specific button size
   * @param {ButtonSize} size - The button size
   * @returns {ButtonDimensions} The corresponding dimensions
   */
  static getDimensions(size) {
    return this.sizeMap[size] || this.sizeMap.medium;
  }

  /**
   * Get all available button sizes
   * @returns {ButtonSize[]} Array of available sizes
   */
  static getAvailableSizes() {
    return Object.keys(this.sizeMap);
  }

  /**
   * Check if a size is valid
   * @param {string} size - Size to validate
   * @returns {boolean} Whether the size is valid
   */
  static isValidSize(size) {
    return this.getAvailableSizes().includes(size);
  }
}

/**
 * Single Responsibility Principle (SRP): Button type validation logic
 * Open/Closed Principle (OCP): Easy to extend with new types without modifying existing code
 */
class ButtonTypeValidator {
  /**
   * Available button types
   * @type {ButtonType[]}
   */
  static availableTypes = ['primary', 'secondary', 'danger', 'success', 'warning'];

  /**
   * Check if a button type is valid
   * @param {string} type - Type to validate
   * @returns {boolean} Whether the type is valid
   */
  static isValidType(type) {
    return this.availableTypes.includes(type);
  }

  /**
   * Get all available button types
   * @returns {ButtonType[]} Array of available types
   */
  static getAvailableTypes() {
    return [...this.availableTypes];
  }
}

/**
 * Single Responsibility Principle (SRP): Icon management logic
 */
class ButtonIconManager {
  /**
   * Check if button has any icons
   * @param {ButtonProps} props - Button properties
   * @param {Object} slots - Vue slots
   * @returns {boolean} Whether button has icons
   */
  static hasIcons(props, slots) {
    return !!(props.leftIcon || props.rightIcon || slots.leftIcon || slots.rightIcon);
  }

  /**
   * Get icon-specific classes
   * @param {ButtonProps} props - Button properties
   * @param {Object} slots - Vue slots
   * @returns {ButtonClasses} Icon-related classes
   */
  static getIconClasses(props, slots) {
    const hasIcons = this.hasIcons(props, slots);
    return {
      'button--with-icons': hasIcons,
      'button--left-icon': !!(props.leftIcon || slots.leftIcon),
      'button--right-icon': !!(props.rightIcon || slots.rightIcon),
    };
  }
}

/**
 * Open/Closed Principle (OCP): Create a strategy pattern for button variants
 * @interface ButtonVariantStrategy
 */
class ButtonVariantStrategy {
  /**
   * Get CSS classes for the button
   * @param {ButtonProps} props - Button properties
   * @param {Object} slots - Vue slots
   * @returns {ButtonClasses} CSS classes object
   */
  getClasses(props, slots) {
    throw new Error('getClasses must be implemented');
  }

  /**
   * Get inline styles for the button
   * @param {ButtonProps} props - Button properties
   * @returns {ButtonStyles} Styles object
   */
  getStyles(props) {
    throw new Error('getStyles must be implemented');
  }
}

/**
 * Single Responsibility Principle (SRP): Primary button strategy implementation
 */
class PrimaryButtonStrategy extends ButtonVariantStrategy {
  /**
   * @param {ButtonProps} props - Button properties
   * @param {Object} slots - Vue slots
   * @returns {ButtonClasses} CSS classes for primary button
   */
  getClasses(props, slots) {
    const iconClasses = ButtonIconManager.getIconClasses(props, slots);
    return {
      'storybook-button': true,
      'storybook-button--primary': true,
      [`storybook-button--${props.size || 'medium'}`]: true,
      ...iconClasses,
    };
  }

  /**
   * @param {ButtonProps} props - Button properties
   * @returns {ButtonStyles} Styles for primary button
   */
  getStyles(props) {
    const dimensions = ButtonSizeMapper.getDimensions(props.size || 'medium');
    return {
      backgroundColor: props.backgroundColor || '#1ea7fd',
      color: '#ffffff',
      padding: dimensions.padding,
      fontSize: dimensions.fontSize,
      minHeight: dimensions.minHeight,
      display: 'flex',
      alignItems: 'center',
      gap: dimensions.gap,
      border: '1px solid #1ea7fd',
    };
  }
}

/**
 * Single Responsibility Principle (SRP): Secondary button strategy implementation
 */
class SecondaryButtonStrategy extends ButtonVariantStrategy {
  /**
   * @param {ButtonProps} props - Button properties
   * @param {Object} slots - Vue slots
   * @returns {ButtonClasses} CSS classes for secondary button
   */
  getClasses(props, slots) {
    const iconClasses = ButtonIconManager.getIconClasses(props, slots);
    return {
      'storybook-button': true,
      'storybook-button--secondary': true,
      [`storybook-button--${props.size || 'medium'}`]: true,
      ...iconClasses,
    };
  }

  /**
   * @param {ButtonProps} props - Button properties
   * @returns {ButtonStyles} Styles for secondary button
   */
  getStyles(props) {
    const dimensions = ButtonSizeMapper.getDimensions(props.size || 'medium');
    return {
      backgroundColor: props.backgroundColor || 'transparent',
      color: '#333333',
      padding: dimensions.padding,
      fontSize: dimensions.fontSize,
      minHeight: dimensions.minHeight,
      display: 'flex',
      alignItems: 'center',
      gap: dimensions.gap,
      border: '1px solid #333333',
    };
  }
}

/**
 * Single Responsibility Principle (SRP): Danger button strategy implementation
 */
class DangerButtonStrategy extends ButtonVariantStrategy {
  /**
   * @param {ButtonProps} props - Button properties
   * @param {Object} slots - Vue slots
   * @returns {ButtonClasses} CSS classes for danger button
   */
  getClasses(props, slots) {
    const iconClasses = ButtonIconManager.getIconClasses(props, slots);
    return {
      'storybook-button': true,
      'storybook-button--danger': true,
      [`storybook-button--${props.size || 'medium'}`]: true,
      ...iconClasses,
    };
  }

  /**
   * @param {ButtonProps} props - Button properties
   * @returns {ButtonStyles} Styles for danger button
   */
  getStyles(props) {
    const dimensions = ButtonSizeMapper.getDimensions(props.size || 'medium');
    return {
      backgroundColor: props.backgroundColor || '#dc3545',
      color: '#ffffff',
      padding: dimensions.padding,
      fontSize: dimensions.fontSize,
      minHeight: dimensions.minHeight,
      display: 'flex',
      alignItems: 'center',
      gap: dimensions.gap,
      border: '1px solid #dc3545',
    };
  }
}

/**
 * Single Responsibility Principle (SRP): Success button strategy implementation
 */
class SuccessButtonStrategy extends ButtonVariantStrategy {
  /**
   * @param {ButtonProps} props - Button properties
   * @param {Object} slots - Vue slots
   * @returns {ButtonClasses} CSS classes for success button
   */
  getClasses(props, slots) {
    const iconClasses = ButtonIconManager.getIconClasses(props, slots);
    return {
      'storybook-button': true,
      'storybook-button--success': true,
      [`storybook-button--${props.size || 'medium'}`]: true,
      ...iconClasses,
    };
  }

  /**
   * @param {ButtonProps} props - Button properties
   * @returns {ButtonStyles} Styles for success button
   */
  getStyles(props) {
    const dimensions = ButtonSizeMapper.getDimensions(props.size || 'medium');
    return {
      backgroundColor: props.backgroundColor || '#28a745',
      color: '#ffffff',
      padding: dimensions.padding,
      fontSize: dimensions.fontSize,
      minHeight: dimensions.minHeight,
      display: 'flex',
      alignItems: 'center',
      gap: dimensions.gap,
      border: '1px solid #28a745',
    };
  }
}

/**
 * Single Responsibility Principle (SRP): Warning button strategy implementation
 */
class WarningButtonStrategy extends ButtonVariantStrategy {
  /**
   * @param {ButtonProps} props - Button properties
   * @param {Object} slots - Vue slots
   * @returns {ButtonClasses} CSS classes for warning button
   */
  getClasses(props, slots) {
    const iconClasses = ButtonIconManager.getIconClasses(props, slots);
    return {
      'storybook-button': true,
      'storybook-button--warning': true,
      [`storybook-button--${props.size || 'medium'}`]: true,
      ...iconClasses,
    };
  }

  /**
   * @param {ButtonProps} props - Button properties
   * @returns {ButtonStyles} Styles for warning button
   */
  getStyles(props) {
    const dimensions = ButtonSizeMapper.getDimensions(props.size || 'medium');
    return {
      backgroundColor: props.backgroundColor || '#ffc107',
      color: '#212529',
      padding: dimensions.padding,
      fontSize: dimensions.fontSize,
      minHeight: dimensions.minHeight,
      display: 'flex',
      alignItems: 'center',
      gap: dimensions.gap,
      border: '1px solid #ffc107',
    };
  }
}

/**
 * Dependency Inversion Principle (DIP): Use factory pattern for strategy creation
 * Open/Closed Principle (OCP): Easy to extend with new button types
 */
class ButtonVariantFactory {
  /**
   * Strategy map for different button types
   * @type {Object.<ButtonType, ButtonVariantStrategy>}
   */
  static strategyMap = {
    primary: PrimaryButtonStrategy,
    secondary: SecondaryButtonStrategy,
    danger: DangerButtonStrategy,
    success: SuccessButtonStrategy,
    warning: WarningButtonStrategy,
  };

  /**
   * Create appropriate button strategy based on type
   * @param {ButtonType} type - The button type
   * @returns {ButtonVariantStrategy} Button strategy instance
   */
  static createStrategy(type) {
    const StrategyClass = this.strategyMap[type] || SecondaryButtonStrategy;
    return new StrategyClass();
  }

  /**
   * Get all available button types
   * @returns {ButtonType[]} Array of available types
   */
  static getAvailableTypes() {
    return Object.keys(this.strategyMap);
  }
}

export default {
  name: 'my-button',

  props: {
    label: {
      type: String,
      required: false,
      default: '',
    },
    type: {
      type: String,
      validator: function (value) {
        return ButtonTypeValidator.isValidType(value);
      },
      default: 'secondary',
    },
    size: {
      type: String,
      validator: function (value) {
        return ButtonSizeMapper.isValidSize(value);
      },
      default: 'medium',
    },
    backgroundColor: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    leftIcon: {
      type: String,
      default: '',
    },
    rightIcon: {
      type: String,
      default: '',
    },
    // Backward compatibility - deprecated, use 'type' instead
    primary: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['click'],

  setup(props, { emit, slots }) {
    // Single Responsibility Principle (SRP): Separate concerns into focused functions
    const getButtonType = () => {
      // Backward compatibility: if primary is true, use 'primary' type
      if (props.primary) {
        return 'primary';
      }
      return props.type || 'secondary';
    };

    const createButtonStrategy = () => {
      const buttonType = getButtonType();
      return ButtonVariantFactory.createStrategy(buttonType);
    };

    const buttonStrategy = computed(() => createButtonStrategy());

    // Single Responsibility Principle (SRP): Each computed property has a single purpose
    const buttonClasses = computed(() => {
      return buttonStrategy.value.getClasses(props, slots);
    });

    const buttonStyles = computed(() => {
      return buttonStrategy.value.getStyles(props);
    });

    // Single Responsibility Principle (SRP): Click handler has single responsibility
    const handleClick = (event) => {
      if (!props.disabled) {
        emit('click', event);
      }
    };

    return {
      buttonClasses,
      buttonStyles,
      handleClick,
    };
  },
};
</script>
