import React from 'react';
import theme from './theme';

/**
 * Button component with different variants
 */
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick, 
  className = '', 
  ...props 
}) => {
  // Base styles
  let baseStyles = `
    font-family: ${theme.typography.fontFamily};
    font-weight: ${theme.typography.fontWeights.medium};
    border-radius: ${theme.borderRadius.md};
    transition: ${theme.transitions.default};
    cursor: pointer;
    disabled:cursor-not-allowed;
  `;
  
  // Size styles
  const sizeStyles = {
    small: `
      padding: ${theme.spacing[1]} ${theme.spacing[2]};
      font-size: ${theme.typography.sizes.sm};
    `,
    medium: `
      padding: ${theme.spacing[2]} ${theme.spacing[4]};
      font-size: ${theme.typography.sizes.base};
    `,
    large: `
      padding: ${theme.spacing[3]} ${theme.spacing[6]};
      font-size: ${theme.typography.sizes.lg};
    `,
  };
  
  // Variant styles
  const variantStyles = {
    primary: `
      background-color: ${theme.colors.primary[900]};
      color: ${theme.colors.utility.white};
      border: 1px solid ${theme.colors.primary[900]};
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary[800]};
      }
      &:disabled {
        background-color: ${theme.colors.primary[400]};
        border-color: ${theme.colors.primary[400]};
        opacity: 0.7;
      }
    `,
    secondary: `
      background-color: transparent;
      color: ${theme.colors.primary[900]};
      border: 1px solid ${theme.colors.primary[900]};
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary[100]};
      }
      &:disabled {
        color: ${theme.colors.primary[400]};
        border-color: ${theme.colors.primary[400]};
        opacity: 0.7;
      }
    `,
    text: `
      background-color: transparent;
      color: ${theme.colors.primary[900]};
      border: none;
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary[100]};
      }
      &:disabled {
        color: ${theme.colors.primary[400]};
        opacity: 0.7;
      }
    `,
  };
  
  // Convert to tailwind classes
  const tailwindClasses = `
    font-medium rounded-md transition-all
    ${size === 'small' ? 'px-2 py-1 text-sm' : 
      size === 'large' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base'}
    ${variant === 'primary' ? 'bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:border-gray-400 disabled:opacity-70' : 
      variant === 'secondary' ? 'bg-transparent text-gray-900 border border-gray-900 hover:bg-gray-100 disabled:text-gray-400 disabled:border-gray-400 disabled:opacity-70' : 
      'bg-transparent text-gray-900 border-none hover:bg-gray-100 disabled:text-gray-400 disabled:opacity-70'}
    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;
  
  return (
    <button 
      className={tailwindClasses.replace(/\s+/g, ' ').trim()} 
      disabled={disabled} 
      onClick={onClick} 
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Typography components for consistent text styling
 */
export const Typography = ({ 
  variant = 'body1', 
  component, 
  className = '', 
  children, 
  ...props 
}) => {
  // Map variants to styles and default HTML elements
  const variantMap = {
    h1: {
      element: 'h1',
      classes: 'text-4xl font-bold leading-tight',
    },
    h2: {
      element: 'h2',
      classes: 'text-3xl font-bold leading-tight',
    },
    h3: {
      element: 'h3',
      classes: 'text-2xl font-semibold leading-tight',
    },
    h4: {
      element: 'h4',
      classes: 'text-xl font-semibold leading-tight',
    },
    h5: {
      element: 'h5',
      classes: 'text-lg font-medium leading-normal',
    },
    h6: {
      element: 'h6',
      classes: 'text-base font-medium leading-normal',
    },
    subtitle1: {
      element: 'h6',
      classes: 'text-lg font-normal leading-normal',
    },
    subtitle2: {
      element: 'h6',
      classes: 'text-base font-medium leading-normal',
    },
    body1: {
      element: 'p',
      classes: 'text-base font-normal leading-normal',
    },
    body2: {
      element: 'p',
      classes: 'text-sm font-normal leading-normal',
    },
    caption: {
      element: 'span',
      classes: 'text-xs font-normal leading-normal',
    },
    button: {
      element: 'span',
      classes: 'text-sm font-medium leading-normal uppercase',
    },
  };
  
  const { element: Element, classes } = variantMap[variant] || variantMap.body1;
  const Component = component || Element;
  
  return (
    <Component 
      className={`${classes} ${className}`.trim()} 
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Card component for content containers
 */
export const Card = ({ 
  children, 
  className = '', 
  variant = 'outlined', 
  fixedHeight = false,
  ...props 
}) => {
  const variantStyles = {
    elevated: 'bg-white shadow-md',
    outlined: 'bg-white border border-gray-200',
    flat: 'bg-white',
  };
  
  const classes = `
    rounded-lg 
    ${!fixedHeight ? 'p-4' : ''}
    ${variantStyles[variant] || variantStyles.outlined}
    ${fixedHeight ? 'fixed-height-card' : ''}
    ${className}
  `;
  
  return (
    <div className={classes.trim()} {...props}>
      {children}
    </div>
  );
};

/**
 * Container with responsive padding and max-width
 */
export const Container = ({ 
  children, 
  className = '', 
  maxWidth = 'lg', 
  fixedHeight = false,
  ...props 
}) => {
  const maxWidthMap = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };
  
  const classes = `
    w-full 
    mx-auto 
    px-4 
    ${maxWidthMap[maxWidth] || maxWidthMap.lg}
    ${fixedHeight ? 'h-full flex flex-col' : ''}
    ${className}
  `;
  
  return (
    <div className={classes.trim()} {...props}>
      {children}
    </div>
  );
};

/**
 * Input component
 */
export const Input = ({
  label,
  helperText,
  error = false,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-800 text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 border ${error ? 'border-gray-900' : 'border-gray-300'} 
          rounded-md focus:outline-none focus:ring-1 
          ${error ? 'focus:ring-gray-900 focus:border-gray-900' : 'focus:ring-gray-600 focus:border-gray-600'}
          transition-colors
          ${className}
        `}
        {...props}
      />
      {helperText && (
        <p className={`mt-1 text-sm ${error ? 'text-gray-900' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
}; 