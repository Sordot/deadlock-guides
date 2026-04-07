import { useParams, useNavigate } from 'react-router-dom';
import { useHero } from '../hooks/useHero';
import { Loader, Alert, Text, Title, Button, Group, Image, Stack, Paper, Badge, Divider } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

export function HeroDetail() {
    const { heroId } = useParams<{ heroId: string }>();
    const navigate = useNavigate();

    const { hero, isLoading, isError, error } = useHero(heroId);

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
                    onClick={() => navigate('/')}
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
                        <Text fw={700} size="lg">{hero.description?.role}</Text>
                        <Text size="sm">{hero.description?.playstyle}</Text>
                        <Text c="dimmed">
                            {hero.description?.lore || "Lore not available."}
                        </Text>
                    </Stack>
                </Group>
            </Paper>
        </Stack>
    );
}