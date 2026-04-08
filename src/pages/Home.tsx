import { Container, Title, Text, Paper, Loader, Alert, List } from '@mantine/core';
import { useItems } from '../hooks/useItems';

export function Home() {
  const { data: items, isLoading, isError, error } = useItems();

  return (
    <Container fluid>
      <Title order={2}>Meta Overview</Title>
      <Text c="dimmed" mt="sm" mb="xl">
        Welcome to Deadlock Guides. The meta dashboard is currently under construction.
      </Text>

      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Title order={3} mb="md">Item Fetch Test</Title>

        {/* 1. Show a loading spinner while fetching */}
        {isLoading && <Loader mt="xl" mx="auto" display="block" />}
        
        {/* 2. Show an error alert if the fetch fails */}
        {isError && (
          <Alert color="red" title="Error">
            {error.message}
          </Alert>
        )}

        {/* 3. Map over the items if we successfully fetched them */}
        {!isLoading && !isError && items && (
          <List 
            type="ordered" 
            size="sm" 
            style={{ maxHeight: '300px', overflowY: 'auto' }}
          >
            {items.map((item) => (
              <List.Item key={item.id}>{item.name} {item.id}</List.Item>
            ))}
          </List>
        )}

        <Text ta="center" c="dimmed" mt="xl">
          Future home of top-tier builds, win rates, and trending strategies!
        </Text>
      </Paper>
    </Container>
  );
}