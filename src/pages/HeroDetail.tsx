import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useHero } from '../hooks/useHero';
import { Loader, Alert, Text, Title, Button, Group, Image, Stack, Paper, Badge, Divider, Card, SimpleGrid } from '@mantine/core';
import { IconArrowLeft, IconPlus } from '@tabler/icons-react';
import { type SavedGuide } from '../context/GuideFormContext';

export function HeroDetail() {
    const { heroId } = useParams<{ heroId: string }>();
    const navigate = useNavigate();

    const { hero, isLoading, isError, error } = useHero(heroId);

    // 1. Fetch and filter guides specific to this hero using lazy state initialization
    const [heroGuides] = useState<SavedGuide[]>(() => {
        const saved: SavedGuide[] = JSON.parse(localStorage.getItem('deadlock_guides') || '[]');

        // Filter guides where the heroId matches the current page's hero
        // Note: We cast both to String in case the form saved it as a number but useParams returns a string
        const filtered = saved.filter((g) => String(g.heroId) === String(heroId));

        // Sort by newest
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    if (isLoading) return <Loader mt="xl" mx="auto" display="block" />;
    if (isError) return <Alert color="red" mt="xl">{error?.message}</Alert>;
    if (!hero) return <Alert color="yellow" mt="xl">Hero not found</Alert>;

    return (
        <Stack gap="xl">
            {/* Navigation */}
            <Group>
                <Button
                    variant="subtle"
                    color="deadlockGreen"
                    leftSection={<IconArrowLeft size={16} />}
                    onClick={() => navigate('/heroes')}
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
                        <Title order={1}>{hero.name}</Title>
                        {/* Minor Tags */}
                        {hero.tags && hero.tags.length > 0 && (
                            <Group gap="xs">
                                {hero.tags.map(tag => (
                                    <Badge key={tag} size="md" variant="outline" color="deadlockGreen" tt="capitalize">
                                        {tag}
                                    </Badge>
                                ))}
                            </Group>

                        )}
                        <Stack gap="xs">
                            <Text fw={700} size="sm">Gun Type: {hero.gun_tag}</Text>
                            <Text fw={700} size="sm">Complexity: {hero.complexity}</Text>
                        </Stack>

                        <Divider my="sm" />

                        {/* Description Data */}
                        {hero.description.role && <Text fw={700} size="lg">{hero.description.role}</Text>}
                        {hero.description.playstyle && <Text size="sm">{hero.description.playstyle}</Text>}
                        <Text c="dimmed">
                            {hero.description?.lore || "Lore not available."}
                        </Text>
                    </Stack>
                </Group>
            </Paper>

            {/* --- NEW COMMUNITY GUIDES SECTION --- */}
            <Stack gap="md" mt="sm">
                <Group justify="space-between">
                    <Title order={2}>Community Guides</Title>
                    {/* A quick link to create a new guide if they are inspired */}
                    <Button
                        component={Link}
                        to={`/create?heroId=${heroId}`} //sends them to create page with current hero id so form can prefill
                        variant="light"
                        color="deadlockGreen"
                        leftSection={<IconPlus size={16} />}
                    >
                        Create Guide
                    </Button>
                </Group>

                {heroGuides.length === 0 ? (
                    <Paper withBorder p="xl" radius="md">
                        <Text c="dimmed" ta="center">
                            No guides have been created for {hero.name} yet. Be the first to share your build!
                        </Text>
                    </Paper>
                ) : (
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                        {heroGuides.map((guide) => (
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
                                    cursor: 'pointer'
                                }}
                            >
                                <Group justify="space-between" mb="xs" wrap="nowrap">
                                    <Text fw={600} truncate>{guide.title}</Text>
                                    <Badge color="deadlockGreen">{guide.role}</Badge>
                                </Group>
                                <Text size="xs" c="dimmed">
                                    Published: {new Date(guide.createdAt).toLocaleDateString()}
                                </Text>
                            </Card>
                        ))}
                    </SimpleGrid>
                )}
            </Stack>
        </Stack>
    );
}