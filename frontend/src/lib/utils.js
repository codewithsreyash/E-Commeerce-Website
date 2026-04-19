import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

export function formatDate(value) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
}

export function getErrorMessage(error, fallback = 'Something went wrong') {
  return error?.response?.data?.message || fallback;
}

export function getFieldError(error) {
  const fields = error?.response?.data?.fieldErrors;
  return Array.isArray(fields) && fields.length > 0 ? fields[0].message : null;
}
