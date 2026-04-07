import { useState, useMemo } from 'react';
import { useHeroes } from '../hooks/useHeroes';
import { Container, Title, Text, Loader, Alert, SimpleGrid, Card, Image, Group, TextInput, Select, Button, Stack } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconSearch, IconFilterOff } from '@tabler/icons-react';
import classes from './Heroes.module.css';

export function Heroes() {
  const { data: heroes, isLoading, isError, error } = useHeroes();

  const [search, setSearch] = useState('');
  const [heroType, setHeroType] = useState<string | null>(null);
  const [complexity, setComplexity] = useState<string | null>(null);
  const [gunTag, setGunTag] = useState<string | null>(null);

  const filterOptions = useMemo(() => {
    if (!heroes) return { types: [], guns: [] };

    const types = Array.from(new Set(heroes.map(h => h.hero_type).filter(Boolean)));
    const guns = Array.from(new Set(heroes.map(h => h.gun_tag).filter(Boolean)));

    return {
      types: types.map(t => ({ value: t, label: t.replace('_', ' ').toUpperCase() })),
      guns: guns.map(g => ({ value: g, label: g.toUpperCase() })),
    };
  }, [heroes]);

  const filteredAndSortedHeroes = useMemo(() => {
    if (!heroes) return [];

    return heroes
      .filter((hero) => {
        const matchesSearch = hero.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = heroType ? hero.hero_type === heroType : true;
        const matchesComplexity = complexity ? hero.complexity?.toString() === complexity : true;
        const matchesGun = gunTag ? hero.gun_tag === gunTag : true;

        return matchesSearch && matchesType && matchesComplexity && matchesGun;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [heroes, search, heroType, complexity, gunTag]);

  if (isLoading) return <Loader mt="xl" mx="auto" display="block" />;
  if (isError) return <Alert color="red">{error.message}</Alert>;

  return (
    <Container fluid>
      <Title order={2}>Deadlock Heroes</Title>
      <Text c="dimmed" mt="sm" mb="xl">Explore the roster and find community guides.</Text>

      {/* FILTER TOOLBAR */}
      <Stack mb="xl" gap="md">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
          <TextInput
            placeholder="Search by name..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
          <Select
            placeholder="Hero Type"
            data={filterOptions.types}
            value={heroType}
            onChange={setHeroType}
            clearable
            searchable
          />
          <Select
            placeholder="Complexity"
            data={[
              { value: '1', label: 'Low (1)' },
              { value: '2', label: 'Medium (2)' },
              { value: '3', label: 'High (3)' },
            ]}
            value={complexity}
            onChange={setComplexity}
            clearable
          />
          <Select
            placeholder="Gun Type"
            data={filterOptions.guns}
            value={gunTag}
            onChange={setGunTag}
            clearable
            searchable
          />
        </SimpleGrid>

        {(search || heroType || complexity || gunTag) && (
          <Group justify="flex-end">
            <Button 
              variant="subtle" 
              color="gray" 
              size="xs"
              leftSection={<IconFilterOff size={14} />}
              onClick={() => {
                setSearch('');
                setHeroType(null);
                setComplexity(null);
                setGunTag(null);
              }}
            >
              Clear Filters
            </Button>
          </Group>
        )}
      </Stack>

      {/* HERO GRID */}
      <div>
        {filteredAndSortedHeroes.length === 0 ? (
          <Text c="dimmed" ta="center" mt="xl">No heroes match your specific filters.</Text>
        ) : (
          <SimpleGrid cols={{ base: 3, sm: 4, md: 6, lg: 8, xl: 10 }}>
            {filteredAndSortedHeroes.map((hero) => (
              <Card 
                key={hero.id}
                component={Link} 
                to={`/heroes/${hero.id}`} 
                shadow="sm" 
                padding="xs" 
                radius="md" 
                withBorder 
                className={classes.heroCard}
                style={{ textDecoration: 'none' }}
              >
                <Card.Section>
                  <Image
                    src={hero.images?.icon_hero_card_webp} 
                    alt={hero.name}
                    height={100}
                    fit="contain"
                    fallbackSrc="https://placehold.co/80x80?text=No+Image"
                  />
                </Card.Section>
                <Group justify="center" mt="xs">
                  <Text fw={500} size="sm" ta="center" lh={1.2}>
                    {hero.name}
                  </Text>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </div>
    </Container>
  );
}