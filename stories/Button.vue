<template>
  <button type="button" :class="buttonClasses" @click="handleClick" :style="buttonStyles" :disabled="disabled">
    <slot>{{ label }}</slot>
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
 * Interface Segregation Principle (ISP): Define specific interfaces for different concerns
 * @typedef {Object} ButtonProps
 * @property {string} [label] - Button text
 * @property {boolean} [primary] - Whether button is primary variant
 * @property {ButtonSize} [size] - Button size
 * @property {string} [backgroundColor] - Custom background color
 * @property {boolean} [disabled] - Whether button is disabled
 */

/**
 * @typedef {Object} ButtonStyles
 * @property {string} [backgroundColor] - Background color
 * @property {string} [padding] - Button padding
 * @property {string} [fontSize] - Font size
 * @property {string} [minHeight] - Minimum height
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
      minHeight: '32px'
    },
    medium: {
      padding: '12px 24px',
      fontSize: '14px',
      minHeight: '40px'
    },
    large: {
      padding: '16px 32px',
      fontSize: '16px',
      minHeight: '48px'
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
 * Open/Closed Principle (OCP): Create a strategy pattern for button variants
 * @interface ButtonVariantStrategy
 */
class ButtonVariantStrategy {
  /**
   * Get CSS classes for the button
   * @param {ButtonProps} props - Button properties
   * @returns {ButtonClasses} CSS classes object
   */
  getClasses(props) {
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
   * @returns {ButtonClasses} CSS classes for primary button
   */
  getClasses(props) {
    return {
      'storybook-button': true,
      'storybook-button--primary': true,
      [`storybook-button--${props.size || 'medium'}`]: true,
    };
  }

  /**
   * @param {ButtonProps} props - Button properties
   * @returns {ButtonStyles} Styles for primary button
   */
  getStyles(props) {
    const dimensions = ButtonSizeMapper.getDimensions(props.size || 'medium');
    return {
      backgroundColor: props.backgroundColor,
      padding: dimensions.padding,
      fontSize: dimensions.fontSize,
      minHeight: dimensions.minHeight,
    };
  }
}

/**
 * Single Responsibility Principle (SRP): Secondary button strategy implementation
 */
class SecondaryButtonStrategy extends ButtonVariantStrategy {
  /**
   * @param {ButtonProps} props - Button properties
   * @returns {ButtonClasses} CSS classes for secondary button
   */
  getClasses(props) {
    return {
      'storybook-button': true,
      'storybook-button--secondary': true,
      [`storybook-button--${props.size || 'medium'}`]: true,
    };
  }

  /**
   * @param {ButtonProps} props - Button properties
   * @returns {ButtonStyles} Styles for secondary button
   */
  getStyles(props) {
    const dimensions = ButtonSizeMapper.getDimensions(props.size || 'medium');
    return {
      backgroundColor: props.backgroundColor,
      padding: dimensions.padding,
      fontSize: dimensions.fontSize,
      minHeight: dimensions.minHeight,
    };
  }
}

/**
 * Dependency Inversion Principle (DIP): Use factory pattern for strategy creation
 */
class ButtonVariantFactory {
  /**
   * Create appropriate button strategy based on variant
   * @param {boolean} isPrimary - Whether button is primary variant
   * @returns {ButtonVariantStrategy} Button strategy instance
   */
  static createStrategy(isPrimary) {
    return isPrimary ? new PrimaryButtonStrategy() : new SecondaryButtonStrategy();
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
    primary: {
      type: Boolean,
      default: false,
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
  },

  emits: ['click'],

  setup(props, { emit }) {
    // Single Responsibility Principle (SRP): Separate concerns into focused functions
    const createButtonStrategy = () => {
      return ButtonVariantFactory.createStrategy(props.primary || false);
    };

    const buttonStrategy = computed(() => createButtonStrategy());

    // Single Responsibility Principle (SRP): Each computed property has a single purpose
    const buttonClasses = computed(() => {
      return buttonStrategy.value.getClasses(props);
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
