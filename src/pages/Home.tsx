import { Title, Text, Container } from '@mantine/core';

export function Home() {
  return (
    <Container fluid>
      <Title order={2}>Recent Guides</Title>
      <Text c="dimmed" mt="sm">Explore the latest character builds from the community.</Text>
      {/* We will add a grid of GuideCards here later */}
    </Container>
  );
}