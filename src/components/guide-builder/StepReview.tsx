// src/components/guide-builder/StepReview.tsx
import { Stack, Group, Text, Paper, Title, Badge, Image, Divider } from '@mantine/core';
import { useGuideFormContext } from '../../context/GuideFormContext';
import { useHero } from '../../hooks/useHero';
import { useHeroes } from '../../hooks/useHeroes';
import { type Item } from '../../hooks/useItems';

// Reuse the border color logic for the preview
const getBorderColor = (type: string) => {
    switch (type) {
        case 'weapon': return '#d97706';
        case 'vitality': return '#16a34a';
        case 'spirit': return '#9333ea';
        default: return 'var(--mantine-color-gray-3)';
    }
};

export function StepReview() {
    const form = useGuideFormContext();
    const { values } = form;

    // Fetch data for the preview
    const { hero } = useHero(values.heroId ? String(values.heroId) : undefined);
    const { data: allHeroes } = useHeroes();

    return (
        <Stack gap="xl">
            <Stack gap="xs">
                <Title order={3}>Preview & Publish</Title>
                <Text c="dimmed" size="sm">
                    This is exactly how your guide will appear to the community. Review your work before publishing!
                </Text>
            </Stack>

            {/* --- LIVE PREVIEW CONTAINER --- */}
            <Paper shadow="md" p="xl" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-body)' }}>
                <Badge color="blue" variant="filled" mb="md" size="lg">LIVE PREVIEW</Badge>

                {/* HEADER PREVIEW */}
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
                            <Title order={1}>{values.title || 'Untitled Guide'}</Title>
                            <Group gap="xs">
                                <Badge size="lg" color="deadlockGreen">{hero?.name || 'Unknown Hero'}</Badge>
                                <Badge size="lg" variant="outline" color="gray">{values.role || 'No Role'}</Badge>
                            </Group>
                            <Text c="dimmed" size="sm">Published: Just now</Text>
                        </Stack>
                    </Group>
                </Paper>

                <Stack gap="xl">
                    {/* ITEMS PREVIEW */}
                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <Title order={3} mb="lg">Item Build</Title>

                        {(['early', 'mid', 'late', 'situational'] as const).map((phase) => (
                            <div key={phase} style={{ marginBottom: '1.5rem' }}>
                                <Title order={5} tt="capitalize" mb="sm">{phase} Game</Title>
                                {values.build[phase].length === 0 ? (
                                    <Text c="dimmed" size="sm" fs="italic">No items specified.</Text>
                                ) : (
                                    <Group gap="sm">
                                        {values.build[phase].map((item: Item, index: number) => (
                                            <div key={`${item.id}-${index}`} style={{ textAlign: 'center' }}>
                                                <Image
                                                    src={item.shop_image_webp || 'https://placehold.co/64'}
                                                    w={56}
                                                    h={56}
                                                    radius="md"
                                                    title={`${item.name} (${item.cost})`}
                                                    style={{ border: `2px solid ${getBorderColor(item.item_slot_type)}` }}
                                                />
                                            </div>
                                        ))}
                                    </Group>
                                )}
                                <Divider mt="md" />
                            </div>
                        ))}
                    </Paper>

                    {/* STRATEGY PREVIEW */}
                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                        <Title order={3} mb="lg">Strategy & Matchups</Title>

                        {values.strategy.length === 0 ? (
                            <Text c="dimmed" fs="italic">No strategy modules added.</Text>
                        ) : (
                            <Stack gap="xl">
                                {values.strategy.map((module) => (
                                    <div key={module.id}>
                                        <Title order={5} mb="xs" c="deadlockGreen.7">{module.title || 'Untitled Section'}</Title>

                                        {module.type === 'text' && (
                                            <Text style={{ whiteSpace: 'pre-wrap' }}>{module.content}</Text>
                                        )}

                                        {module.type === 'matchup' && (
                                            <Paper withBorder p="md" radius="md" mt="xs">
                                                <Group wrap="nowrap" align="flex-start">
                                                    <Image
                                                        src={allHeroes?.find(h => String(h.id) === String(module.content.enemyHeroId))?.images?.icon_hero_card_webp}
                                                        w={80}
                                                        radius="md"
                                                        fallbackSrc="https://placehold.co/80?text=Hero"
                                                    />
                                                    <Stack gap="xs" w="100%">
                                                        <Group justify="space-between">
                                                            <Text fw={700} size="lg">
                                                                Vs. {allHeroes?.find(h => String(h.id) === String(module.content.enemyHeroId))?.name || 'Unknown Hero'}
                                                            </Text>
                                                            <Badge
                                                                color={
                                                                    module.content.difficulty === 'Easy' ? 'green' :
                                                                        module.content.difficulty === 'Medium' ? 'orange' :
                                                                            module.content.difficulty === 'Hard' ? 'red' : 'gray'
                                                                }
                                                                variant="light"
                                                                size="lg"
                                                            >
                                                                {module.content.difficulty || 'Unrated'}
                                                            </Badge>
                                                        </Group>
                                                        <Text style={{ whiteSpace: 'pre-wrap' }} size="sm">{module.content.analysis}</Text>
                                                    </Stack>
                                                </Group>
                                            </Paper>
                                        )}
                                    </div>
                                ))}
                            </Stack>
                        )}
                    </Paper>
                </Stack>
            </Paper>
        </Stack>
    );
}