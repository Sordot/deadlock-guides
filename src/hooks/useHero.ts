import { useMemo } from 'react';
import { useHeroes } from './useHeroes';

export const useHero = (id: string | undefined) => {
  // Call the main hook. If the data is already cached, this returns instantly.
  // If the user deep-links directly to this page, it will fetch the full roster.
  const { data: heroes, isLoading, isError, error } = useHeroes();

  // Memoize the search so we don't iterate over the array on every re-render
  const hero = useMemo(() => {
    if (!heroes || !id) return undefined;
    return heroes.find((h) => h.id.toString() === id);
  }, [heroes, id]);

  return { hero, isLoading, isError, error };
};