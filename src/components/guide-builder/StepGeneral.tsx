// src/components/guide-builder/StepGeneral.tsx
import { TextInput, Select, Stack, Paper, Title } from '@mantine/core';
import { useGuideFormContext } from '../../context/GuideFormContext';
import { useHeroes } from '../../hooks/useHeroes';

export function StepGeneral() {
    // Grab the form context instead of receiving it as a prop!
    const form = useGuideFormContext();
    const { data: heroes, isLoading } = useHeroes();

    // Map the heroes to the Select format, then sort them alphabetically by label
    const heroOptions = heroes
        ?.map((hero) => ({
            value: hero.id.toString(),
            label: hero.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)) || [];

    return (
        <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Title order={4} mb="xl">General Information</Title>

            <Stack gap="md">
                {/* form.getInputProps wires up value, onChange, and error states automatically */}
                <TextInput
                    withAsterisk
                    label="Guide Title"
                    placeholder="e.g., Unkillable Spirit Abrams"
                    {...form.getInputProps('title')}
                />

                <Select
                    withAsterisk
                    label="Select Hero"
                    placeholder="Choose your hero"
                    data={heroOptions}
                    searchable
                    disabled={isLoading}
                    {...form.getInputProps('heroId')}
                />

                <Select
                    withAsterisk
                    label="Primary Role"
                    placeholder="e.g., Assassin, Brawler"
                    data={['Assassin', 'Brawler', 'Marksman', 'Mystic']}
                    {...form.getInputProps('role')}
                />
            </Stack>
        </Paper>
    );
}