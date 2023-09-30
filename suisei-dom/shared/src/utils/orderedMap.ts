export class OrderedMap<T> {
  bucket: { key: number; value: T }[];

  constructor() {
    this.bucket = [];
  }

  get(key: number): T | null {
    const index = this.findIndex(key);
    const item = this.bucket[index];
    if (item?.key === key) {
      return item.value;
    }

    return null;
  }

  set(key: number, value: T) {
    const index = this.findIndex(key);

    if (this.bucket[index]?.key === key) {
      this.bucket[index].value = value;
      return;
    }

    this.bucket.splice(index, 0, { key, value });
  }

  has(key: number): boolean {
    return this.bucket[this.findIndex(key)]?.key === key;
  }

  delete(key: number): T | null {
    const index = this.findIndex(key);
    const item = this.bucket[index];

    if (item?.key === key) {
      this.bucket.splice(index, 1);
      return item.value;
    }

    return null;
  }

  findIndex(lowerBoundKey: number): number {
    let start = 0;
    let end = this.bucket.length - 1;

    while (start <= end) {
      const mid = ~~((start + end) / 2);
      const midKey = this.bucket[mid].key;

      if (midKey === lowerBoundKey) {
        return mid;
      }

      if (midKey < lowerBoundKey) {
        start = mid + 1;
        continue;
      }

      end = mid - 1;
    }

    return start;
  }

  highest(): { key: number; value: T } | null {
    return this.bucket[this.bucket.length - 1] ?? null;
  }

  highestBounded(upperBound: number): { key: number; value: T } | null {
    const index = this.findIndex(upperBound);
    const item = this.bucket[index];
    if (item?.key === upperBound) {
      return item;
    }

    return this.bucket[index - 1] ?? null;
  }

  lowest(): { key: number; value: T } | null {
    return this.bucket[0] ?? null;
  }
}
