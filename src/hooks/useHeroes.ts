import { useQuery } from '@tanstack/react-query';

// Define the shape of your expected data (optional, but good for TypeScript)
export interface Hero {
  id: number;
  name: string;
  class: string;
  images: {
    icon_hero_card: string; 
  };
  // ... other properties from the deadlock-api
}

const fetchHeroes = async (): Promise<Hero[]> => {
  const response = await fetch('https://assets.deadlock-api.com/v2/heroes?language=english&client_version=6430&only_active=true')
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useHeroes = () => {
  return useQuery({
    queryKey: ['heroes'], // This key identifies the cache
    queryFn: fetchHeroes,
    // THE MAGIC SAUCE FOR LARGE DATA:
    // staleTime tells React Query how long the data is considered "fresh".
    // 1000 * 60 * 60 = 1 hour. For the next hour, any component that 
    // calls useHeroes() will instantly get the cached data without a network request.
    staleTime: 1000 * 60 * 60, 
  });
};