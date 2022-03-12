export type Filter = {
  page?: number;
  limit?: number;
  name?: string;
};

export interface CreateAdmin {
  name: string;
  address: string;
}

interface Tier {
  property: string;
  value: [];
}

export interface UpdateProps {
  collection_name?: string;
  collection_address?: string;
  tier?: [];
}
