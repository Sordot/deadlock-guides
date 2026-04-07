import { Container, Title, Text, Paper } from '@mantine/core';

export function Home() {
  return (
    <Container fluid>
      <Title order={2}>Meta Overview</Title>
      <Text c="dimmed" mt="sm" mb="xl">
        Welcome to Deadlock Guides. The meta dashboard is currently under construction.
      </Text>

      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Text ta="center" c="dimmed">
          Future home of top-tier builds, win rates, and trending strategies!
        </Text>
      </Paper>
    </Container>
  );
}