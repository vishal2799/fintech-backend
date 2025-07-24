/**
 * Splits an array into chunks of a given size.
 * 
 * @param arr The array to split.
 * @param size The maximum size of each chunk.
 * @returns An array of chunks.
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
