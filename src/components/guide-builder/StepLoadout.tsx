// src/components/guide-builder/StepLoadout.tsx
import { useState, useMemo } from 'react';
import { Grid, Paper, Title, Text, TextInput, Stack, SimpleGrid, Tooltip, Image, Group, ScrollArea, Badge } from '@mantine/core';
import { useGuideFormContext } from '../../context/GuideFormContext';
import { useItems, type Item } from '../../hooks/useItems';

type Phase = 'early' | 'mid' | 'late' | 'situational';
const PHASES: Phase[] = ['early', 'mid', 'late', 'situational'];

// Helper to determine border colors
const getBorderColor = (type: string) => {
  switch (type) {
    case 'weapon': return '#d97706'; // Amber
    case 'vitality': return '#16a34a'; // Green
    case 'spirit': return '#9333ea'; // Purple (Checking 'tech' just in case API aliases it)
    default: return 'var(--mantine-color-gray-3)';
  }
};

export function StepLoadout() {
  const form = useGuideFormContext();
  const { data: items } = useItems();
  const [activePhase, setActivePhase] = useState<Phase>('early');

  const [searchQuery, setSearchQuery] = useState('');

  // --- Filter & Sort Logic ---
  const filteredAndSortedItems = useMemo(() => {
    if (!items) return [];

    // 1. FILTERING (Only by Name)
    const result = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 2. SORTING (Category -> Cost -> Alphabetical)
    const categoryOrder: Record<string, number> = { weapon: 1, vitality: 2, spirit: 3, tech: 3 };

    return result.sort((a, b) => {
      const orderA = categoryOrder[a.item_slot_type.toLowerCase()] || 99;
      const orderB = categoryOrder[b.item_slot_type.toLowerCase()] || 99;

      if (orderA !== orderB) return orderA - orderB;
      if (a.cost !== b.cost) return a.cost - b.cost;
      return a.name.localeCompare(b.name);
    });
  }, [items, searchQuery]);

  const handleAddItem = (item: Item) => {
    form.insertListItem(`build.${activePhase}`, item);
  };

  const handleRemoveItem = (phase: Phase, index: number) => {
    form.removeListItem(`build.${phase}`, index);
  };

  return (
    <Grid gap="xl">
      {/* LEFT: Canvas */}
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Title order={4} mb="md">Construct Build</Title>

          {PHASES.map((phase) => (
            <Paper
              key={phase} p="md" mb="md" radius="sm" withBorder
              style={{
                borderColor: activePhase === phase ? 'var(--mantine-color-blue-filled)' : undefined,
                backgroundColor: activePhase === phase ? 'var(--mantine-color-blue-light)' : undefined,
                cursor: 'pointer'
              }}
              onClick={() => setActivePhase(phase)}
            >
              <Group justify="space-between" mb="sm">
                <Text fw={600} tt="capitalize">{phase}</Text>
                {activePhase === phase && <Badge color="blue">Active</Badge>}
              </Group>

              <Group gap="xs">
                {form.values.build[phase].length === 0 ? (
                  <Text c="dimmed" size="sm" fs="italic">Select items from the right.</Text>
                ) : (
                  form.values.build[phase].map((item, index) => (
                    <Tooltip key={`${item.id}-${index}`} label={`${item.name} (${item.cost})`}>
                      <Image
                        src={item.shop_image_webp || 'https://placehold.co/64'} w={48} h={48} radius="md"
                        style={{
                          cursor: 'pointer',
                          border: `2px solid ${getBorderColor(item.item_slot_type)}`
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(phase, index);
                        }}
                      />
                    </Tooltip>
                  ))
                )}
              </Group>
            </Paper>
          ))}
        </Paper>
      </Grid.Col>

      {/* RIGHT: Palette */}
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Paper shadow="sm" p="md" radius="md" withBorder h={700}>
          <Stack mb="md">
            <div>
              <Title order={4}>Item Palette</Title>
              <Text size="sm" c="dimmed">Click to add to <strong>{activePhase}</strong>.</Text>
            </div>

            {/* --- Filter Controls (Simplified) --- */}
            <TextInput
              placeholder="Search items by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </Stack>

          {/* Increased height slightly since we removed the dropdowns */}
          <ScrollArea h={500} offsetScrollbars>
            {filteredAndSortedItems.length === 0 ? (
              <Text c="dimmed" ta="center" mt="xl">No items match your search.</Text>
            ) : (
              <SimpleGrid cols={4} spacing="xs">
                {filteredAndSortedItems.map((item) => (
                  <Tooltip key={item.id} label={`${item.name} (${item.cost})`}>
                    <Image
                      src={item.shop_image_webp} w="100%" radius="md"
                      style={{
                        cursor: 'pointer',
                        aspectRatio: '1/1',
                        border: `2px solid ${getBorderColor(item.item_slot_type)}`
                      }}
                      onClick={() => handleAddItem(item)}
                    />
                  </Tooltip>
                ))}
              </SimpleGrid>
            )}
          </ScrollArea>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}