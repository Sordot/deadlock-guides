// src/hooks/useItems.ts
import { useQuery } from '@tanstack/react-query';

export interface Item {
  id: number;
  name: string;
  item_slot_type: string; 
  cost: number;
  item_tier: number; 
  shopable: boolean; 
  shop_image_webp?: string;
}

const fetchItems = async (): Promise<Item[]> => {
    const response = await fetch('https://assets.deadlock-api.com/v2/items?language=english&only_active=true');
    
    if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
    }

    const data = await response.json();

    // community deadlock api uses "shopable" with one p...
    // we filter to show items that are purchasable in-game and tier 4 and below (t5 items are legendary and only in street brawl atm)
    return data.filter((item: Item) => item.shopable === true && item.item_tier < 5);
};

export const useItems = () => {
    return useQuery({
        queryKey: ['items'],
        queryFn: fetchItems,
        staleTime: 1000 * 60 * 60, 
    });
};