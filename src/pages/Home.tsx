import { useHeroes } from '../hooks/useHeroes';
import { Container, Title, Text, Loader, Alert, SimpleGrid, Card, Image, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from './Home.module.css'

export function Home() {

  const { data: heroes, isLoading, isError, error } = useHeroes();

  if (isLoading) return <Loader />;
  if (isError) return <Alert color="red">{error.message}</Alert>;

  // Safely shallow copy the cached heroes array and sort it alphabetically by the hero's name for display
  const sortedHeroes = heroes
    ? [...heroes].sort((a, b) => a.name.localeCompare(b.name))
    : [];

  return (
    <Container fluid>
      <Title order={2}>Deadlock Heroes</Title>
      <Text c="dimmed" mt="sm" mb="sm">Explore the latest character builds from the community.</Text>
      {/* We will add a grid of GuideCards here later */}
      <div>
      {/* SimpleGrid is great for responsive card layouts */}
      <SimpleGrid cols={{ base: 3, sm: 4, md: 6, lg: 8, xl: 10 }}>
        {sortedHeroes?.map((hero) => (
          <Card 
            key={hero.id}
            component={Link} // Turns the entire card into a router link
            to={`/heroes/${hero.id}`} //Dynamic hero page route
            shadow="sm" 
            padding="xs" 
            radius="md" 
            withBorder 
            className={classes.heroCard}
            style={{ textDecoration: 'none' }} // Prevents standard link underlining
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
              <Text fw={500} size="sm">
                {hero.name}
              </Text>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </div>
    </Container>
  );
}