# Styling Guide for Rubik's Cube Solver

This document outlines the styling system for the Rubik's Cube Solver application.

## Color Palette

The application uses a neutral color palette consisting of black, white, and various shades of gray.

### Gray Scale

- Gray 50: `#FAFAFA` - Very light gray (almost white)
- Gray 100: `#F5F5F5` - Light gray (background)
- Gray 200: `#EEEEEE`
- Gray 300: `#E0E0E0`
- Gray 400: `#BDBDBD`
- Gray 500: `#9E9E9E`
- Gray 600: `#757575`
- Gray 700: `#616161`
- Gray 800: `#424242`
- Gray 900: `#212121` - Very dark gray (almost black)

### Utility Colors

- Black: `#000000`
- White: `#FFFFFF`

## Typography

### Font Family

The primary font family is Inter, with fallbacks to system fonts:

```css
font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif;
```

### Font Sizes

- XS: 0.75rem (12px)
- SM: 0.875rem (14px)
- Base: 1rem (16px)
- LG: 1.125rem (18px)
- XL: 1.25rem (20px)
- 2XL: 1.5rem (24px)
- 3XL: 1.875rem (30px)
- 4XL: 2.25rem (36px)
- 5XL: 3rem (48px)

### Font Weights

- Light: 300
- Regular: 400
- Medium: 500
- SemiBold: 600
- Bold: 700

## Components

The styling system includes several reusable components:

### Typography Component

```jsx
import { Typography } from '../styles/components';

// Usage examples
<Typography variant="h1">Heading 1</Typography>
<Typography variant="body1">Regular paragraph text</Typography>
<Typography variant="caption">Small caption text</Typography>
```

Available variants: h1, h2, h3, h4, h5, h6, subtitle1, subtitle2, body1, body2, caption, button

### Button Component

```jsx
import { Button } from '../styles/components';

// Usage examples
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="text">Text Button</Button>
```

### Card Component

```jsx
import { Card } from '../styles/components';

// Usage examples
<Card variant="elevated">
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</Card>
```

Available variants: elevated, outlined, flat

### Container Component

```jsx
import { Container } from '../styles/components';

// Usage examples
<Container maxWidth="md">
  Content with medium max-width
</Container>
```

Available maxWidth values: sm, md, lg, xl, 2xl, full

### Input Component

```jsx
import { Input } from '../styles/components';

// Usage examples
<Input 
  label="Email" 
  type="email" 
  placeholder="Enter your email" 
  helperText="We'll never share your email."
/>
```

## CSS Utility Classes

The styling system includes several utility classes:

### Button Classes

- `.btn`: Base button styles
- `.btn-primary`: Primary button variant
- `.btn-secondary`: Secondary button variant

### Card Class

- `.card`: Standard card styling

## Layout

For consistent layout across all pages, use the Layout component:

```jsx
import Layout from '../components/Layout';

// Usage example
<Layout>
  <h1>Page Title</h1>
  <p>Page content goes here...</p>
</Layout>
```

## Theme Customization

The central theme configuration is located in `src/styles/theme.js`. Modify this file to make global style changes. 