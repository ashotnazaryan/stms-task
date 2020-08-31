export interface Movie {
  id: string;
  title: string;
  release_date: string;
}

export interface Beer {
  id: string;
  name: string;
  first_brewed: string;
}

export type Provider = (Beer & Movie) & { comment?: string };
