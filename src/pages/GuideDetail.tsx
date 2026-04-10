// src/pages/GuideDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Title, Text, Tooltip, Paper, Group, Button, Badge, Stack, Image, Alert, Loader, Divider, SimpleGrid } from '@mantine/core';
import { IconArrowLeft, IconThumbUp } from '@tabler/icons-react';
import { useHero } from '../hooks/useHero';
import { type GuideFormValues, type SavedGuide } from '../context/GuideFormContext';
import { type Item } from '../hooks/useItems';

// Reuse the border color logic from StepLoadout
const getBorderColor = (type: string) => {
    switch (type) {
        case 'weapon': return '#d97706';
        case 'vitality': return '#16a34a';
        case 'spirit': return '#9333ea';
        default: return 'var(--mantine-color-gray-3)';
    }
};

export function GuideDetail() {
    const { guideId } = useParams<{ guideId: string }>();
    const [guide, setGuide] = useState<SavedGuide | null>(null);

    useEffect(() => {
        // Fetch from local storage placeholder backend
        const existingGuides: SavedGuide[] = JSON.parse(localStorage.getItem('deadlock_guides') || '[]');
        const foundGuide = existingGuides.find(g => g.id === guideId);
        if (foundGuide) {
            setGuide(foundGuide);
        }
    }, [guideId]);

    // Use the existing hook to grab the hero details from the API
    const { hero, isLoading } = useHero(guide?.heroId || undefined);

    const handleUpvote = () => {
        if (!guide) return;

        // Read the current state of local storage
        const existingGuides: SavedGuide[] = JSON.parse(localStorage.getItem('deadlock_guides') || '[]');

        // Find this guide and increment its upvote count (defaulting to 0 for older guides)
        const updatedGuides = existingGuides.map(g => {
            if (g.id === guide.id) {
                return { ...g, upvotes: (g.upvotes || 0) + 1 };
            }
            return g;
        });

        // Save back to local storage and update local state
        localStorage.setItem('deadlock_guides', JSON.stringify(updatedGuides));
        setGuide({ ...guide, upvotes: (guide.upvotes || 0) + 1 });
    };

    if (!guide) return <Alert color="red" mt="xl" mx="md">Guide not found.</Alert>;
    if (isLoading) return <Loader mt="xl" mx="auto" display="block" />;

    return (
        <Container fluid>
            <Group mb="xl">
                <Button
                    component={Link}
                    to="/"
                    variant="subtle"
                    color="deadlockGreen"
                    leftSection={<IconArrowLeft size={16} />}
                >
                    Back to Home
                </Button>
            </Group>

            {/* HEADER SECTION */}
            <Paper shadow="sm" p="xl" radius="md" withBorder mb="xl">
                <Group align="flex-start" wrap="nowrap">
                    <Image
                        src={hero?.images?.icon_hero_card_webp}
                        alt={hero?.name}
                        w={120}
                        fit="contain"
                        fallbackSrc="https://placehold.co/120x150?text=No+Image"
                    />
                    <Stack gap="xs" w="100%">
                        <Group justify="space-between" align="flex-start">
                            <Title order={1}>{guide.title}</Title>
                            <Button
                                variant="light"
                                color="deadlockGreen"
                                leftSection={<IconThumbUp size={18} />}
                                onClick={handleUpvote}
                            >
                                Upvote ({guide.upvotes || 0})
                            </Button>
                        </Group>
                        <Group gap="xs">
                            <Badge size="lg" color="deadlockGreen">{hero?.name || 'Unknown Hero'}</Badge>
                            <Badge size="lg" variant="outline" color="gray">{guide.role}</Badge>
                        </Group>
                        <Text c="dimmed" size="sm">
                            Published: {new Date(guide.createdAt).toLocaleDateString()}
                        </Text>
                    </Stack>
                </Group>
            </Paper>

            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
                {/* ITEMS SECTION */}
                <Paper shadow="sm" p="xl" radius="md" withBorder>
                    <Title order={3} mb="lg">Item Build</Title>

                    {(['early', 'mid', 'late', 'situational'] as const).map((phase) => (
                        <div key={phase} style={{ marginBottom: '1.5rem' }}>
                            <Title order={5} tt="capitalize" mb="sm">{phase}</Title>
                            {guide.build[phase].length === 0 ? (
                                <Text c="dimmed" size="sm" fs="italic">No items specified.</Text>
                            ) : (
                                <Group gap="sm">
                                    {guide.build[phase].map((item: Item, index: number) => (
                                        <div key={`${item.id}-${index}`} style={{ textAlign: 'center' }}>
                                            <Tooltip key={item.id} label={`${item.name} (${item.cost})`}>
                                                <Image
                                                    src={item.shop_image_webp || 'https://placehold.co/64'}
                                                    w={56}
                                                    h={56}
                                                    radius="md"
                                                    title={`${item.name} (${item.cost})`}
                                                    style={{ border: `2px solid ${getBorderColor(item.item_slot_type)}` }}
                                                />
                                            </Tooltip>
                                        </div>
                                    ))}
                                </Group>
                            )}
                            <Divider mt="md" />
                        </div>
                    ))}
                </Paper>

                {/* STRATEGY SECTION */}
                <Paper shadow="sm" p="xl" radius="md" withBorder>
                    <Title order={3} mb="lg">Strategy & Matchups</Title>

                    {/* Check if the array exists and has items */}
                    {(!guide.strategy || guide.strategy.length === 0) ? (
                        <Text c="dimmed" fs="italic">The author did not provide a strategy text.</Text>
                    ) : (
                        <Stack gap="xl">
                            {guide.strategy.map((module) => (
                                <div key={module.id}>
                                    {/* Render the custom title the user gave this block */}
                                    <Title order={5} mb="xs" c="deadlockGreen.7">{module.title}</Title>

                                    {/* Render the content based on the module type */}
                                    {module.type === 'text' && (
                                        <Text style={{ whiteSpace: 'pre-wrap' }}>{module.content}</Text>
                                    )}

                                    {/* Note: We will add matchup and itemization rendering here later! */}
                                </div>
                            ))}
                        </Stack>
                    )}
                </Paper>
            </SimpleGrid>
        </Container>
    );
}