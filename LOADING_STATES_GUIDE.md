# Loading States Guide

## What are Loading States?

Loading states are visual indicators that inform users when the application is processing a request, fetching data, or performing any asynchronous operation. They provide crucial feedback to prevent user confusion and improve the overall user experience.

## Why Loading States Matter

### 1. **User Feedback**
- Prevents users from clicking buttons multiple times
- Shows that the system is working, not frozen
- Reduces perceived wait time

### 2. **Professional UX**
- Makes the app feel responsive and polished
- Builds user confidence in the system
- Follows modern UI/UX best practices

### 3. **Error Prevention**
- Prevents duplicate submissions
- Clear visual feedback for user actions
- Better error handling and recovery

## Types of Loading States

### 1. **Button Loading States**
```tsx
// Basic loading button
<button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</button>

// Enhanced with spinner
<LoadingButton 
  loading={loading} 
  loadingText="Processing..."
>
  Submit Form
</LoadingButton>
```

### 2. **Skeleton Loaders**
```tsx
// For content that's loading
<HSNResultSkeleton /> // Shows placeholder for HSN results
<CardSkeleton />      // Shows placeholder for cards
<SearchInputSkeleton /> // Shows placeholder for search input
```

### 3. **Progress Indicators**
```tsx
// For operations with known duration
<ProgressBar progress={75} message="Uploading files..." />
```

### 4. **Inline Loading**
```tsx
// For small operations
<InlineLoading message="Saving changes..." />
```

### 5. **Page Loading Overlays**
```tsx
// For full-page operations
<PageLoadingOverlay message="Initializing application..." />
```

## Implementation in Your HSN Agent

### Current Loading States ✅

1. **Authentication Forms**
   - Button loading with spinner
   - Disabled state during submission
   - Loading text changes

2. **HSN Search**
   - Button shows "⏳ Searching..." when loading
   - Input disabled during search
   - Skeleton results while loading

3. **User Navigation**
   - Skeleton loading for user data
   - Pulse animation while fetching

### Enhanced Loading States 🔧

1. **HSN Search Results**
   ```tsx
   {loading && <HSNResultSkeleton />}
   {showResults && !loading && <ResultsList />}
   ```

2. **Action Buttons**
   ```tsx
   <LoadingButton
     loading={isProcessing}
     loadingText="Starting..."
     onClick={handleAction}
   >
     New Classification
   </LoadingButton>
   ```

3. **Chat Interface**
   ```tsx
   <TypingIndicator /> // When assistant is responding
   <ConnectionStatus connected={isConnected} />
   ```

## Best Practices

### 1. **Timing**
- Show loading states immediately (0-100ms)
- For operations > 1 second, show progress
- For operations > 3 seconds, show detailed progress

### 2. **Visual Design**
- Use consistent spinner styles
- Match loading colors to your brand
- Provide meaningful loading messages

### 3. **User Experience**
- Disable interactive elements during loading
- Show what's happening, not just "Loading..."
- Provide cancel options for long operations

### 4. **Performance**
- Use CSS animations for smooth effects
- Avoid JavaScript-heavy loading animations
- Consider skeleton loaders for better perceived performance

## Common Patterns

### 1. **Search with Results**
```tsx
const [loading, setLoading] = useState(false);
const [results, setResults] = useState([]);

const handleSearch = async () => {
  setLoading(true);
  try {
    const data = await searchAPI(query);
    setResults(data);
  } finally {
    setLoading(false);
  }
};

return (
  <div>
    <SearchInput onSearch={handleSearch} disabled={loading} />
    {loading && <HSNResultSkeleton />}
    {results.length > 0 && !loading && <ResultsList results={results} />}
  </div>
);
```

### 2. **Form Submission**
```tsx
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (data) => {
  setSubmitting(true);
  try {
    await submitForm(data);
    // Success handling
  } catch (error) {
    // Error handling
  } finally {
    setSubmitting(false);
  }
};

return (
  <LoadingButton
    loading={submitting}
    loadingText="Saving..."
    onClick={handleSubmit}
  >
    Save Changes
  </LoadingButton>
);
```

### 3. **Data Fetching**
```tsx
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await api.getData();
      setData(result);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);

if (loading) return <CardSkeleton />;
return <DataComponent data={data} />;
```

## Accessibility Considerations

### 1. **Screen Readers**
```tsx
<div aria-live="polite" aria-label="Loading search results">
  {loading && "Loading search results..."}
</div>
```

### 2. **Keyboard Navigation**
- Disable focus on loading elements
- Provide keyboard alternatives
- Maintain focus management

### 3. **Color Contrast**
- Ensure loading indicators meet WCAG standards
- Don't rely solely on color for loading states
- Provide text alternatives

## Testing Loading States

### 1. **Unit Tests**
```tsx
test('shows loading state when searching', async () => {
  render(<HSNLookup />);
  fireEvent.click(screen.getByText('Search'));
  expect(screen.getByText('⏳ Searching...')).toBeInTheDocument();
});
```

### 2. **Integration Tests**
```tsx
test('completes search flow', async () => {
  render(<HSNLookup />);
  fireEvent.change(screen.getByPlaceholderText('Enter HSN code'), {
    target: { value: '1012100' }
  });
  fireEvent.click(screen.getByText('Search'));
  
  await waitFor(() => {
    expect(screen.getByText('Found 1 result')).toBeInTheDocument();
  });
});
```

## Performance Tips

### 1. **Optimize Animations**
```css
/* Use transform and opacity for smooth animations */
.loading-spinner {
  animation: spin 1s linear infinite;
  transform: translateZ(0); /* Hardware acceleration */
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### 2. **Lazy Loading**
```tsx
// Only show loading states when needed
{isLoading && <LoadingComponent />}
```

### 3. **Debouncing**
```tsx
// Prevent excessive loading states
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  [handleSearch]
);
```

## Conclusion

Loading states are essential for creating a professional, user-friendly application. They provide crucial feedback, prevent user errors, and improve the overall experience. By implementing the patterns and components in this guide, your HSN Agent application will feel more responsive and polished.

Remember:
- Show loading states immediately
- Use appropriate loading types for different scenarios
- Provide meaningful feedback to users
- Test loading states thoroughly
- Consider accessibility in all implementations
