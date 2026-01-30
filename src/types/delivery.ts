export interface RouteItem {
  missionId: string;
  commodity: string;
  quantity: number;
  maxBoxSize: 1 | 2 | 3 | 4;
}

export interface RouteStop {
  id: string;
  type: 'pickup' | 'delivery';
  location: string;
  items: RouteItem[];
}

export interface CargoItem {
  missionId: string;
  commodity: string;
  quantity: number;
  maxBoxSize?: number;
}

export interface CargoGroup {
  color: string;
  label: string;
  items: CargoItem[];
}

export interface CargoGridLayout {
  cols: number;
  rows: number;
}

export type RouteViewMode = 'all' | 'current' | 'current-next' | 'remaining';
