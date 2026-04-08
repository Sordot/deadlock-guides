// src/pages/Home.tsx
import { Container, Title, Text, Paper, Grid } from '@mantine/core';

export function Home() {
  return (
    <Container fluid>
      <Title order={2}>Meta Overview</Title>
      <Text c="dimmed" mt="sm" mb="xl">
        Welcome to Deadlock Guides.
      </Text>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Title order={4} mb="sm">Trending Heroes</Title>
            <Text c="dimmed" size="sm">Win rate data and tier lists coming soon...</Text>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Title order={4} mb="sm">Popular Builds</Title>
            <Text c="dimmed" size="sm">Top community-rated guides will appear here...</Text>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}