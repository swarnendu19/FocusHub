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
