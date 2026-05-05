export interface IProfile {
  id: string;
  title: string;
  description: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface IOrganizationalStructure {
  id: string;
  title: string;
  description: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface IVisionMission {
  id: string;
  title: string;
  vision: string;
  mission: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}
