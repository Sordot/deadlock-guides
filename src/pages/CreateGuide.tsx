import { Title, Text, Container } from '@mantine/core';

export function CreateGuide() {
  return (
    <Container fluid>
      <Title order={2}>Create a New Guide</Title>
      <Text c="dimmed" mt="sm">Share your knowledge and shape the meta.</Text>
      {/* We will build the Rich Text Editor and Item Picker here later */}
    </Container>
  );
}