import { useState, useMemo } from 'react';
import { Container, Title, Text, Paper, Grid, Card, Group, Badge, Select, Tabs, Stack } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconFlame, IconClock } from '@tabler/icons-react';
import { type SavedGuide } from '../context/GuideFormContext';
import { useHeroes } from '../hooks/useHeroes'; // Need this for the dropdown

export function Home() {
  const { data: heroes } = useHeroes();

  // 1. Fetch all guides once on load
  const [allGuides] = useState<SavedGuide[]>(() => {
    return JSON.parse(localStorage.getItem('deadlock_guides') || '[]');
  });

  // 2. State for our filters
  const [sortBy, setSortBy] = useState<string | null>('popular');
  const [filterHeroId, setFilterHeroId] = useState<string | null>(null);

  // 3. Prepare the dropdown data from the API heroes
  const heroSelectData = useMemo(() => {
    if (!heroes) return [];
    return heroes
      .map(h => ({ value: String(h.id), label: h.name }))
      .sort((a, b) => a.label.localeCompare(b.label)); // Alphabetical
  }, [heroes]);

  // 4. Dynamically filter and sort the guides
  const displayedGuides = useMemo(() => {
    let results = [...allGuides];

    // Filter by hero if one is selected
    if (filterHeroId) {
      results = results.filter(g => String(g.heroId) === filterHeroId);
    }

    // Sort by selected tab
    results.sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.upvotes || 0) - (a.upvotes || 0); // Highest upvotes first
      }
      // Otherwise newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Limit the final output to a maximum of 5 guides
    return results.slice(0, 5);
  }, [allGuides, sortBy, filterHeroId]);

  return (
    <Container fluid>
      <Group justify="space-between" align="flex-end" mb="xl">
        <div>
          <Title order={2}>Meta Overview</Title>
          <Text c="dimmed" mt="sm">Welcome to Deadlock Guides.</Text>
        </div>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper shadow="sm" p="xl" radius="md" withBorder h="100%">
            <Title order={4} mb="sm">Trending Heroes</Title>
            <Text c="dimmed" size="sm">Win rate data and tier lists coming soon...</Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Group justify="space-between" mb="lg">
              <Title order={4}>Community Guides</Title>

              {/* Dropdown to filter by hero */}
              <Select
                placeholder="Filter by Hero"
                data={heroSelectData}
                value={filterHeroId}
                onChange={setFilterHeroId}
                clearable
                searchable
                style={{ width: 200 }}
              />
            </Group>

            {/* Tabs for sorting */}
            <Tabs value={sortBy} onChange={setSortBy} color="deadlockGreen" mb="md">
              <Tabs.List>
                <Tabs.Tab value="popular" leftSection={<IconFlame size={16} />}>Most Popular</Tabs.Tab>
                <Tabs.Tab value="newest" leftSection={<IconClock size={16} />}>Newest</Tabs.Tab>
              </Tabs.List>
            </Tabs>

            {displayedGuides.length === 0 ? (
              <Text c="dimmed" size="sm" ta="center" mt="xl">
                No guides found matching your criteria.
              </Text>
            ) : (
              <Stack gap="md" mt="md">
                {displayedGuides.map((guide) => {
                  const heroName = heroes?.find(h => String(h.id) === String(guide.heroId))?.name || 'Unknown Hero';

                  return (
                    <Card
                      key={guide.id}
                      component={Link}
                      to={`/guides/${guide.id}`}
                      shadow="xs"
                      padding="md"
                      radius="md"
                      withBorder
                      style={{
                        textDecoration: 'none',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                    >
                      <Group justify="space-between" mb="xs">
                        <Group gap="sm">
                          <Text fw={600}>{guide.title}</Text>
                          <Badge size="sm" color="deadlockGreen.7" variant="light">{heroName}</Badge>
                        </Group>
                        <Group gap="xs">
                          <Badge color="deadlockGreen">{guide.role}</Badge>
                          <Badge color="blue" variant="light" leftSection={<IconFlame size={12} />}>
                            {guide.upvotes || 0}
                          </Badge>
                        </Group>
                      </Group>
                      <Text size="xs" c="dimmed">
                        Created: {new Date(guide.createdAt).toLocaleDateString()}
                      </Text>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}