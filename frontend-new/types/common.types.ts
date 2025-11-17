/**
 * Common Types
 *
 * Shared utility types and type guards used across the application.
 */

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make all properties required recursively
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Extract keys of T where value is of type U
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Nullable type
 */
export type Nullable<T> = T | null;

/**
 * Maybe type (nullable or undefined)
 */
export type Maybe<T> = T | null | undefined;

/**
 * ValueOf utility type
 */
export type ValueOf<T> = T[keyof T];

/**
 * Awaited type for promises
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * Sort order
 */
export type SortOrder = "asc" | "desc";

/**
 * Date range
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Time range in seconds
 */
export interface TimeRange {
  start: number;
  end: number;
}

/**
 * Coordinate position
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Dimensions
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Color value (hex)
 */
export type HexColor = `#${string}`;

/**
 * ID types
 */
export type ID = string;
export type UUID = string;

/**
 * Timestamp in milliseconds
 */
export type Timestamp = number;

/**
 * ISO date string
 */
export type ISODateString = string;

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Async data state
 */
export interface AsyncData<T> extends LoadingState {
  data: T | null;
}

/**
 * Action result
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Selection state
 */
export interface SelectionState<T> {
  selected: T[];
  isAllSelected: boolean;
}

/**
 * Filter state
 */
export interface FilterState {
  search: string;
  filters: Record<string, unknown>;
  sortBy?: string;
  sortOrder?: SortOrder;
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

/**
 * Toast notification
 */
export interface ToastNotification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Form field error
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Form state
 */
export interface FormState<T> {
  values: T;
  errors: FieldError[];
  touched: Set<keyof T>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

/**
 * Dropdown option
 */
export interface DropdownOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: string;
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

/**
 * Time series data point
 */
export interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
}

/**
 * Key-value pair
 */
export interface KeyValuePair<K = string, V = unknown> {
  key: K;
  value: V;
}

/**
 * Meta information
 */
export interface MetaInfo {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Soft delete capability
 */
export interface SoftDelete {
  deletedAt?: Date;
  deletedBy?: string;
  isDeleted: boolean;
}

/**
 * Audit trail
 */
export interface AuditTrail extends MetaInfo {
  version: number;
  changes: Array<{
    field: string;
    oldValue: unknown;
    newValue: unknown;
    changedAt: Date;
    changedBy: string;
  }>;
}

/**
 * Type guard to check if value is not null or undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if value is null
 */
export function isNull<T>(value: T | null): value is null {
  return value === null;
}

/**
 * Type guard to check if value is undefined
 */
export function isUndefined<T>(value: T | undefined): value is undefined {
  return value === undefined;
}

/**
 * Type guard to check if value is empty string
 */
export function isEmpty(value: string): boolean {
  return value.trim().length === 0;
}

/**
 * Type guard to check if object has property
 */
export function hasProperty<T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj;
}

/**
 * Type guard to check if date is valid
 */
export function isValidDate(date: Date | string | number): boolean {
  const d = new Date(date);
  return !isNaN(d.getTime());
}

/**
 * Type guard to check if value is promise
 */
export function isPromise<T>(value: unknown): value is Promise<T> {
  return value instanceof Promise;
}

/**
 * Type guard for error objects
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}
