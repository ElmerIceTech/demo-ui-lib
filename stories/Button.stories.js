import { fn } from 'storybook/test';

import MyButton from './Button.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Example/Button',
  component: MyButton,
  tags: ['autodocs'],
  argTypes: {
    type: { control: { type: 'select' }, options: ['primary', 'secondary', 'danger', 'success', 'warning'] },
    size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
    backgroundColor: { control: 'color' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

export const Default = {
  args: {
    type: 'primary',
    label: 'Button',
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    type: 'primary',
    label: 'Primary',
  },
};

export const Secondary = {
  args: {
    type: 'secondary',
    label: 'Secondary',
  },
};

export const Danger = {
  args: {
    type: 'danger',
    label: 'Danger',
  },
};

export const Success = {
  args: {
    type: 'success',
    label: 'Success',
  },
};

export const Warning = {
  args: {
    type: 'warning',
    label: 'Warning',
  },
};

export const Large = {
  args: {
    type: 'primary',
    size: 'large',
    label: 'Button',
  },
};

export const Medium = {
  args: {
    type: 'primary',
    size: 'medium',
    label: 'Button',
  },
};

export const Small = {
  args: {
    type: 'primary',
    size: 'small',
    label: 'Button',
  },
};
