/**
 * UI Components Barrel Export
 *
 * Central export point for all UI components.
 */

// Button
export { Button, buttonVariants } from "./Button";
export type { ButtonProps } from "./Button";

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
} from "./Card";
export type { CardProps } from "./Card";

// Dialog
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./Dialog";

// Input & Form
export { Input } from "./Input";
export type { InputProps } from "./Input";

export { Label } from "./Label";
export type { LabelProps } from "./Label";

export { Checkbox } from "./Checkbox";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "./Select";

// Progress
export { Progress } from "./Progress";
export type { ProgressProps } from "./Progress";

// Badge
export { Badge, badgeVariants } from "./Badge";
export type { BadgeProps } from "./Badge";

// Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

// Dropdown Menu
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./Dropdown";

// Tooltip
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./Tooltip";

// TextArea
export { TextArea } from "./TextArea";
export type { TextAreaProps } from "./TextArea";

// Radio
export { RadioGroup, RadioGroupItem } from "./Radio";

// Switch
export { Switch } from "./Switch";

// DatePicker
export { DatePicker } from "./DatePicker";
export type { DatePickerProps } from "./DatePicker";
