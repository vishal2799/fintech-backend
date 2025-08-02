// export type PaginationParams = {
//   pageIndex?: number
//   pageSize?: number
// }

// export type SortParams = {
//   sortBy?: `${string}.${'asc' | 'desc'}`
// }

// export type Filters<T> = Partial<T> & PaginationParams & SortParams

// export type PaginatedData<T> = {
//   result: T[]
//   rowCount: number
// }

// backend/src/types/common.ts

export type PaginationParams = {
  pageIndex?: number
  pageSize?: number
}

export type SortParams = {
  sortBy?: `${string}.${'asc' | 'desc'}`
}

export type Filters<T> = Partial<T> & PaginationParams & SortParams & {
  search?: string
}

export type PaginatedData<T> = {
  result: T[]
  rowCount: number
}
