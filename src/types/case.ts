export interface Case {
  id: string;
  title: string;
  area: number;
  tariff: string;
  durationDays: number;
  budget: number;
  task: string;
  workDone: string;
  result: string;
  imageBefore: string;
  imageAfter: string;
  review?: {
    name: string;
    fearBefore: string;
    likedAfter: string;
    rating: number;
  };
  objectType: 'rent' | 'life' | 'premium';
}
