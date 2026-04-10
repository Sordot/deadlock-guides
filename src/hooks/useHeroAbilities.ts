import { useQuery } from '@tanstack/react-query';

export interface Ability {
    id: number;
    name: string;
    ability_type: string;
    image_webp?: string;
    description?: {
        desc: string;
    };
}

const fetchHeroAbilities = async (heroId: string | null): Promise<Ability[]> => {
    if (!heroId) return [];

    const response = await fetch(`https://assets.deadlock-api.com/v2/items/by-hero-id/${heroId}?language=english&client_version=6430`);

    if (!response.ok) {
        throw new Error('Failed to fetch hero abilities');
    }

    const data = await response.json();

    return data
};

export const useHeroAbilities = (heroId: string | null) => {
    return useQuery({
        queryKey: ['heroAbilities', heroId],
        queryFn: () => fetchHeroAbilities(heroId),
        // Only run this query if the user has actually selected a hero in Step 1
        enabled: !!heroId,
        staleTime: 1000 * 60 * 60,
    });
};