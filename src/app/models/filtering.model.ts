export interface FilterButton {
  type: Filter;
  label: string;
  isActive: boolean;
}

export enum Filter {
  All = 'all',
  Active = 'active',
  Complete = 'complete',
}
