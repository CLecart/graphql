// Types principaux pour l’application Zone01

/**
 * Utilisateur principal de l'application
 */
export interface User {
  id: number;
  login: string;
  attrs?: Record<string, string | number | boolean>;
}

/**
 * Transaction (ex: XP, skills, etc.)
 */
export interface Transaction {
  id: number;
  amount: number;
  type: string;
  createdAt: string;
  path: string;
  objectId?: number;
  object?: {
    name: string;
    type: string;
  };
}

/**
 * Audit d'un projet ou d'un groupe
 */
export interface Audit {
  id: number;
  grade: number | null;
  createdAt: string;
  updatedAt?: string;
  auditorId?: number;
  groupId?: number;
  group?: {
    object: {
      name: string;
      type: string;
    };
    members: { user: User }[];
  };
}

/**
 * Progression sur un projet
 */
export interface Progress {
  id: number;
  campus: string;
  grade: number;
  createdAt: string;
  updatedAt: string;
  path: string;
  object: {
    id: number;
    name: string;
    type: string;
  };
}

/**
 * Résultat d'un projet
 */
export interface Result {
  id: number;
  grade: number;
  createdAt: string;
  path: string;
  object: {
    id: number;
    name: string;
    type: string;
  };
}

/**
 * Membre d'un groupe
 */
export interface Member {
  user: User;
}

/**
 * Groupe de projet
 */
export interface Group {
  captainId?: number;
  members: Member[];
  object?: {
    name?: string;
    type?: string;
  };
}
