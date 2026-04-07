import { useParams, useNavigate } from 'react-router-dom';
import { useHero } from '../hooks/useHero';
import { Loader, Alert, Text, Title, Button, Group, Image, Stack, Paper, SimpleGrid, Badge, Divider } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

export function HeroDetail() {
  const { heroId } = useParams<{ heroId: string }>(); 
  const navigate = useNavigate();
  
  const { hero, isLoading, isError, error } = useHero(heroId);

  if (isLoading) return <Loader mt="xl" mx="auto" display="block" />;
  if (isError) return <Alert color="red" mt="xl">{error?.message}</Alert>;
  if (!hero) return <Alert color="yellow" mt="xl">Hero not found</Alert>;

  // Extract the starting stats from the Record into an easily mappable array
  const startingStats = hero.starting_stats ? Object.values(hero.starting_stats) : [];

  return (
    <Stack gap="xl">
      {/* Navigation */}
      <Group>
        <Button 
          variant="subtle" 
          color="gray" 
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/')}
        >
          Back to Roster
        </Button>
      </Group>

      {/* Main Hero Header Card */}
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Group align="flex-start" wrap="nowrap">
          <Image
            src={hero.images?.icon_hero_card_webp}
            alt={hero.name}
            w={200}
            fit="contain"
            fallbackSrc="https://placehold.co/200x250?text=No+Image"
          />
          
          <Stack gap="xs" w="100%">
            {/* Title & Core Badges */}
            <Group justify="space-between" align="center">
              <Title order={1}>{hero.name}</Title>
              <Group gap="xs">
                {hero.hero_type && (
                  <Badge color="blue" variant="light" tt="capitalize">
                    {hero.hero_type.replace('_', ' ')}
                  </Badge>
                )}
                {hero.gun_tag && (
                  <Badge color="red" variant="light">
                    {hero.gun_tag}
                  </Badge>
                )}
                {hero.complexity !== undefined && (
                  <Badge color="yellow" variant="light">
                    Complexity: {hero.complexity}
                  </Badge>
                )}
              </Group>
            </Group>

            {/* Minor Tags */}
            {hero.tags && hero.tags.length > 0 && (
              <Group gap="xs">
                {hero.tags.map(tag => (
                  <Badge key={tag} size="sm" variant="outline" color="gray" tt="capitalize">
                    {tag}
                  </Badge>
                ))}
              </Group>
            )}
            
            <Divider my="sm" />

            {/* Description Data */}
            <Text fw={700} size="lg">Role: {hero.description?.role}</Text>
            <Text size="sm"><b>Playstyle:</b> {hero.description?.playstyle}</Text>
            <Text mt="sm" c="dimmed">
              {hero.description?.lore || "Lore not available."}
            </Text>
          </Stack>
        </Group>
      </Paper>

      {/* Starting Stats Grid */}
      {startingStats.length > 0 && (
        <Stack gap="md">
          <Title order={3}>Starting Stats</Title>
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }}>
            {startingStats.map((stat, index) => (
              <Paper key={index} p="sm" radius="md" withBorder>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700} truncate>
                  {stat.display_stat_name}
                </Text>
                <Text size="lg" fw={500}>
                  {stat.value}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  );
}