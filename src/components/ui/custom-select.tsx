import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem as OriginalSelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Create a safe SelectItem component that ensures empty strings are replaced with default values
const SafeSelectItem = React.forwardRef<
  React.ElementRef<typeof OriginalSelectItem>,
  React.ComponentPropsWithoutRef<typeof OriginalSelectItem>
>(({ value, children, ...props }, ref) => {
  // If the value is an empty string, replace it with a default string
  const safeValue = value === "" ? "_empty_" : value;
  
  return (
    <OriginalSelectItem ref={ref} value={safeValue} {...props}>
      {children}
    </OriginalSelectItem>
  );
});
SafeSelectItem.displayName = "SafeSelectItem";

// Export the SafeSelectItem as SelectItem for easy drop-in replacement
export {
  SafeSelectItem as SelectItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue
};
