import { useQuery } from '@tanstack/react-query';

export interface Hero {
  id: number;
  name: string;
  tags: string[];
  hero_type: string; // e.g., "assassin", "bruiser"
  complexity: number; 
  gun_tag: string;
  
  description: {
    lore: string;
    role: string;
    playstyle: string;
  };
  images: {
    icon_hero_card_webp: string;
    hero_card_gloat_webp: string;
    hero_card_critical_webp: string;
  };
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