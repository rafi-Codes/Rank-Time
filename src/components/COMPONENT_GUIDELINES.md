# RankTime Component Library Guidelines

## Overview

This document outlines the usage patterns and best practices for RankTime's component library. All components follow the design system tokens and accessibility standards.

---

## Core Components

### Button

**Purpose**: Trigger actions or submit forms

**Variants**:
- `default` - Primary action (cyan gradient)
- `secondary` - Alternative action
- `outline` - Tertiary action
- `ghost` - Minimal action
- `link` - Text-only action
- `destructive` - Danger action (red)
- `success` - Positive action (green)

**Sizes**:
- `xs` - 32px (minimal)
- `sm` - 36px (compact)
- `md` - 40px (standard)
- `lg` - 48px (large)
- `xl` - 56px (extra large)
- `icon`, `icon-sm`, `icon-lg` - Icon-only buttons

**Features**:
- Loading state with spinner
- Icon support (left/right positioning)
- Keyboard accessible
- Full-width option (w-full)

**Usage Examples**:

```jsx
// Primary action
<Button>Create Session</Button>

// With loading state
<Button isLoading loadingText="Saving...">Save</Button>

// With icon
<Button icon={<CheckIcon />} iconPosition="left">
  Confirm
</Button>

// Secondary action
<Button variant="secondary" size="sm">
  Cancel
</Button>

// Danger action
<Button variant="destructive">
  Delete Session
</Button>

// Ghost (minimal)
<Button variant="ghost">More Options</Button>

// Link style
<Button variant="link">Learn more</Button>
```

---

### Card

**Purpose**: Container for content sections

**Variants**:
- `default` - Glass effect (frosted glass style)
- `solid` - Solid background with subtle shadow
- `elevated` - Higher elevation with shadow
- `ghost` - Minimal, transparent
- `outline` - Border-focused
- `interactive` - Clickable card with hover effects

**Props**:
- `interactive` - Adds click-friendly styling
- `variant` - Visual style

**Sub-components**:
- `CardHeader` - Top section with border
- `CardTitle` - Main heading
- `CardSubtitle` - Secondary heading
- `CardDescription` - Descriptive text
- `CardContent` - Main content area
- `CardFooter` - Bottom section with border

**Usage Examples**:

```jsx
// Basic card
<Card>
  <CardHeader>
    <CardTitle>Session Completed</CardTitle>
    <CardDescription>May 21, 2025</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Great work on today's practice!</p>
  </CardContent>
</Card>

// Elevated card
<Card variant="elevated">
  <CardContent>
    <h3>Problem Solved</h3>
    <p>Binary Trees - Medium</p>
  </CardContent>
</Card>

// Interactive clickable card
<Card variant="interactive" onClick={() => navigateToSession(id)}>
  <CardHeader>
    <CardTitle>JavaScript Fundamentals</CardTitle>
  </CardHeader>
  <CardContent>
    Duration: 45 minutes
  </CardContent>
</Card>

// Ghost card
<Card variant="ghost">
  <CardContent>Minimal styling</CardContent>
</Card>
```

---

### Input

**Purpose**: Collect user text input

**Features**:
- Validation states (error, success)
- Helper text
- Leading/trailing icons
- Loading indicator
- Accessibility support
- Dark mode compatible

**Props**:
- `error` - Shows error state (red)
- `success` - Shows success state (green)
- `isLoading` - Loading spinner
- `helperText` - Helpful message below input
- `icon` - Leading icon
- `suffix` - Trailing content

**Usage Examples**:

```jsx
// Basic input
<Input placeholder="Enter email" />

// With error
<Input 
  error 
  placeholder="Email"
  helperText="Invalid email format"
/>

// With success
<Input 
  success 
  placeholder="Email"
  helperText="Email verified"
/>

// With icon
<Input 
  placeholder="Search sessions"
  icon={<SearchIcon />}
/>

// Loading state
<Input 
  isLoading 
  placeholder="Validating..."
/>

// With helper text
<Input 
  placeholder="Password"
  type="password"
  helperText="At least 8 characters required"
/>
```

---

### Badge

**Purpose**: Status indicators, tags, labels

**Variants**:
- `default` - Primary (cyan)
- `secondary` - Muted
- `success` - Positive (green)
- `warning` - Caution (yellow)
- `destructive` - Error (red)
- `info` - Informational (cyan)
- `outline` - Border-focused
- `ghost` - Minimal

**Sizes**:
- `sm` - 28px (compact)
- `md` - 32px (standard)
- `lg` - 36px (spacious)

**Features**:
- Optional icon support
- Semantic color coding
- Hover effects

**Usage Examples**:

```jsx
// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">In Progress</Badge>
<Badge variant="destructive">Failed</Badge>

// With icons
<Badge variant="success" icon={<CheckIcon />}>
  Verified
</Badge>

// Custom colors
<Badge variant="info">Session 5</Badge>

// Size variations
<Badge size="sm">Tag</Badge>
<Badge size="md">Default</Badge>
<Badge size="lg">Large</Badge>
```

---

### Alert

**Purpose**: Display important messages to users

**Variants**:
- `default` - Informational (blue)
- `success` - Positive (green)
- `warning` - Caution (yellow)
- `destructive` - Error (red)

**Sub-components**:
- `AlertTitle` - Main message
- `AlertDescription` - Supporting text

**Usage Examples**:

```jsx
// Success alert
<Alert variant="success">
  <AlertTitle>Session Saved!</AlertTitle>
  <AlertDescription>
    Your session data has been saved successfully.
  </AlertDescription>
</Alert>

// Warning alert
<Alert variant="warning">
  <AlertTitle>Unsaved Changes</AlertTitle>
  <AlertDescription>
    You have unsaved changes. Please save before leaving.
  </AlertDescription>
</Alert>

// Error alert
<Alert variant="destructive">
  <AlertTitle>Connection Error</AlertTitle>
  <AlertDescription>
    Failed to load sessions. Please try again.
  </AlertDescription>
</Alert>
```

---

## Design Tokens

All components use design tokens defined in `globals.css`. Key tokens:

### Colors
```
--color-cyan-primary: #00d9ff (main brand color)
--color-success: #10b981 (positive)
--color-warning: #f59e0b (caution)
--color-danger: #ef4444 (error)
--color-text-primary: for main text
--color-text-secondary: for supporting text
```

### Spacing
```
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

### Typography
```
--text-sm: 0.875rem
--text-base: 1rem
--text-lg: 1.125rem
--text-xl: 1.25rem
--font-weight-bold: 700
--font-weight-semibold: 600
```

### Shadows
```
--shadow-sm: Small elevation
--shadow-md: Medium elevation
--shadow-lg: Large elevation
--elevation-1/2/3/4: Component elevations
```

---

## Accessibility Standards

All components follow WCAG 2.1 AA standards:

### Button
- Keyboard navigation (Tab, Enter, Space)
- Focus visible with ring
- Loading state with `aria-busy`
- Disabled state with `aria-disabled`

### Input
- Associated labels via `htmlFor`
- Error states with `aria-invalid`
- Helper text with `aria-describedby`
- Focus management

### Card
- Semantic HTML structure
- Interactive cards with `role="button"`
- Proper heading hierarchy

### Badge
- `aria-hidden` for decorative elements
- Proper color contrast (4.5:1 minimum)

### Alert
- `role="alert"` for screen readers
- Semantic color coding
- Clear, non-jargon messaging

---

## Micro-interactions

### Transitions
- `duration-200` (200ms) - Most interactions
- `duration-300` (300ms) - Larger movements
- `ease-in-out` - Smooth easing

### Hover Effects
- Buttons: Translate up 2px, shadow elevation
- Cards: Shadow elevation, translate up 4px
- Links: Underline appear, color shift

### Active States
- Buttons: No translate, pressed appearance
- Forms: Border and ring color change

---

## Common Patterns

### Form with Validation

```jsx
export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await loginAPI(email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Login Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error.includes('email')}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error.includes('password')}
          placeholder="••••••••"
        />
      </div>

      <Button 
        type="submit" 
        isLoading={loading}
        loadingText="Logging in..."
        className="w-full"
      >
        Log In
      </Button>
    </form>
  )
}
```

### Status Display

```jsx
export function SessionStatus({ status }: { status: 'pending' | 'active' | 'completed' | 'failed' }) {
  const variants = {
    pending: 'warning',
    active: 'info',
    completed: 'success',
    failed: 'destructive',
  }

  return (
    <Badge variant={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
```

---

## Component Composition

Prefer smaller, composable components:

```jsx
// ✓ Good - Composable
<Card variant="interactive">
  <CardHeader>
    <CardTitle>Session</CardTitle>
    <CardSubtitle>May 21</CardSubtitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <p>Problem solved</p>
      <Badge variant="success">+50 points</Badge>
    </div>
  </CardContent>
</Card>

// ✗ Avoid - Monolithic
<CustomSessionCard 
  title="Session"
  date="May 21"
  description="Problem solved"
  points={50}
/>
```

---

## Customization

All components accept `className` for additional styling:

```jsx
<Button className="w-full md:w-auto">
  Custom width
</Button>

<Card className="border-2 border-primary">
  Custom border
</Card>
```

---

## Performance Tips

1. **Memoize components** to prevent unnecessary re-renders
2. **Lazy load** heavy components
3. **Use skeleton screens** while loading data
4. **Optimize images** for faster display
5. **Batch state updates** in forms

---

## Testing

Each component should be tested for:
- Visual rendering (snapshot tests)
- Interaction (user events)
- Accessibility (a11y tests)
- Dark mode compatibility
- Responsive behavior

---

## Troubleshooting

### Button not responding
- Check if `disabled` or `isLoading` is true
- Verify `onClick` handler is properly bound
- Ensure not wrapped in non-interactive element

### Input losing focus
- Use `useRef` for imperative focus control
- Verify form structure
- Check for controlled/uncontrolled prop conflicts

### Card layout breaking
- Use `className="grid"` for multiple children
- Ensure children have defined widths
- Apply proper spacing with gap utilities

---

## Contributing

When adding new components:
1. Follow the component structure pattern
2. Add TypeScript interfaces
3. Include all WCAG 2.1 AA standards
4. Write usage examples
5. Test in light and dark modes
6. Update this guidelines file

---

## Resources

- [Design Tokens](../globals.css)
- [Tailwind Config](../../tailwind.config.js)
- [Component Source](./ui/)
- [Accessibility Standards](https://www.w3.org/WAI/WCAG21/quickref/)
