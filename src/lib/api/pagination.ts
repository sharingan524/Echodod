/**
 * Pagination utilities for list endpoints
 */

import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  cursor: z.string().optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Calculates pagination metadata
 * @param total - Total number of records
 * @param params - Pagination parameters
 * @returns Pagination metadata
 */
export function calculatePagination(total: number, params: PaginationParams): PaginationMeta {
  const totalPages = Math.ceil(total / params.pageSize);

  return {
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages,
    hasNextPage: params.page < totalPages,
    hasPreviousPage: params.page > 1,
  };
}

/**
 * Calculates skip value for offset-based pagination
 * @param params - Pagination parameters
 * @returns Number of records to skip
 */
export function getPaginationSkip(params: PaginationParams): number {
  return (params.page - 1) * params.pageSize;
}
