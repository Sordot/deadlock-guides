import { useEffect, useState } from 'react';
import { Text, Paper, Alert, Loader, Stack, Group, Image, ThemeIcon, Badge } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import { useGuideFormContext } from '../../context/GuideFormContext';
import { useHeroAbilities } from '../../hooks/useHeroAbilities';

export function StepAbilities() {
    const form = useGuideFormContext();
    const heroId = form.values.heroId;
    const { data: abilities, isLoading, isError } = useHeroAbilities(heroId);

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // When abilities load, if the form hasn't been set yet, populate it with the default order
    useEffect(() => {
        if (abilities && abilities.length > 0 && form.values.abilityOrder.length === 0) {
            form.setFieldValue('abilityOrder', abilities.map(a => a.id));
        }
    }, [abilities, form]);

    if (!heroId) return <Alert color="yellow">Please go back and select a hero first.</Alert>;
    if (isLoading) return <Loader mt="xl" display="block" mx="auto" />;
    if (isError || !abilities) return <Alert color="red">Failed to load abilities.</Alert>;

    // Map the IDs currently in the form back to the full ability objects so we can display them
    const orderedAbilities = form.values.abilityOrder
        .map(id => abilities.find(a => a.id === id))
        .filter(Boolean); // Filter out undefined just in case

    // --- DRAG AND DROP HANDLERS ---
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        // This is required to allow the drop event to fire
        e.preventDefault();
    };

    const handleDrop = (index: number) => {
        if (draggedIndex === null) return;

        // Copy the current order, remove the dragged item, and insert it at the new index
        const newOrder = [...form.values.abilityOrder];
        const [draggedItem] = newOrder.splice(draggedIndex, 1);
        newOrder.splice(index, 0, draggedItem);

        form.setFieldValue('abilityOrder', newOrder);
        setDraggedIndex(null);
    };

    return (
        <Stack gap="xl">
            <Stack gap="xs">
                <Text fw={500}>Maxing Priority</Text>
                <Text size="sm" c="dimmed">
                    Drag and drop the abilities to show the order they should be maxed out. Top is highest priority.
                </Text>
            </Stack>

            <Stack gap="sm">
                {orderedAbilities.map((ability, index) => (
                    <Paper
                        key={ability!.id}
                        withBorder
                        p="sm"
                        radius="md"
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        style={{
                            cursor: 'grab',
                            backgroundColor: 'var(--mantine-color-body)',
                            opacity: draggedIndex === index ? 0.5 : 1, // Visual feedback when dragging
                            transition: 'opacity 0.2s'
                        }}
                    >
                        <Group wrap="nowrap">
                            <IconGripVertical size={20} style={{ color: 'var(--mantine-color-gray-5)' }} />

                            <ThemeIcon size={40} radius="md" variant="transparent">
                                <Image
                                    src={ability!.image_webp}
                                    w={40} h={40}
                                    fallbackSrc="https://placehold.co/40?text=Skill"
                                />
                            </ThemeIcon>

                            <div style={{ flex: 1 }}>
                                <Text fw={600}>{ability!.name}</Text>
                            </div>

                            {/* Display a helpful badge indicating priority rank */}
                            <Badge
                                size="lg"
                                variant={index === 0 ? "filled" : "light"}
                                color={`deadlockGreen.${9 - (index * 2)}`} //This will evaluate to shades 9, 7, 5, and 3
                            >
                                Priority {index + 1}
                            </Badge>
                        </Group>
                    </Paper>
                ))}
            </Stack>
        </Stack>
    );
}