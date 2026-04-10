// src/pages/Home.tsx
import { useState } from 'react';
import { Container, Title, Text, Paper, Grid, Card, Group, Badge } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { SavedGuide } from '../context/GuideFormContext';

export function Home() {
  // Pass a function to useState so it only reads from localStorage once on initial load
  const [recentGuides] = useState<SavedGuide[]>(() => {
    const saved: SavedGuide[] = JSON.parse(localStorage.getItem('deadlock_guides') || '[]');
    // Sort so the newest guides are first
    return saved.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  return (
    <Container fluid>
      <Title order={2}>Meta Overview</Title>
      <Text c="dimmed" mt="sm" mb="xl">
        Welcome to Deadlock Guides.
      </Text>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Title order={4} mb="lg">Popular Builds</Title>
            
            {recentGuides.length === 0 ? (
              <Text c="dimmed" size="sm">No guides created yet. Go make one!</Text>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentGuides.map((guide) => (
                  <Card 
                    key={guide.id} 
                    component={Link} 
                    to={`/guides/${guide.id}`} 
                    shadow="xs" 
                    padding="md" 
                    radius="md" 
                    withBorder
                    style={{ textDecoration: 'none' }}
                  >
                    <Group justify="space-between" mb="xs">
                      <Text fw={600}>{guide.title}</Text>
                      <Badge color="deadlockGreen">{guide.role}</Badge>
                    </Group>
                    <Text size="xs" c="dimmed">
                      Created: {new Date(guide.createdAt).toLocaleDateString()}
                    </Text>
                  </Card>
                ))}
              </div>
            )}
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Title order={4} mb="sm">Trending Heroes</Title>
            <Text c="dimmed" size="sm">Win rate data and tier lists coming soon...</Text>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}