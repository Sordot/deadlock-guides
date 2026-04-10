import { useState, useMemo } from 'react';
import { Stack, Group, Text, Paper, Button, TextInput, Textarea, ActionIcon, Title, SegmentedControl, Badge, Select, Image } from '@mantine/core';
import { IconGripVertical, IconPlus, IconTrash, IconSwords } from '@tabler/icons-react';
import { useGuideFormContext, type StrategyModule } from '../../context/GuideFormContext';
import { useHeroes } from '../../hooks/useHeroes';

export function StepStrategy() {
  const form = useGuideFormContext();
  const [viewMode, setViewMode] = useState<'edit' | 'reorder'>('edit');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Fetch heroes for the matchup dropdown
  const { data: heroes } = useHeroes();

  const heroSelectData = useMemo(() => {
    if (!heroes) return [];
    return heroes
      .map(h => ({ value: String(h.id), label: h.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [heroes]);

  const addTextBlock = () => {
    const newBlock: StrategyModule = {
      id: Date.now().toString(),
      type: 'text',
      title: 'New Text Section',
      content: ''
    };
    form.insertListItem('strategy', newBlock);
    setViewMode('edit');
  };

  // --- NEW: Add Matchup Block ---
  const addMatchupBlock = () => {
    const newBlock: StrategyModule = {
      id: Date.now().toString(),
      type: 'matchup',
      title: 'Matchup',
      // Content is now an object instead of a string!
      content: { enemyHeroId: '', difficulty: '', analysis: '' }
    };
    form.insertListItem('strategy', newBlock);
    setViewMode('edit');
  };

  const removeBlock = (index: number) => {
    form.removeListItem('strategy', index);
  };

  // Drag and Drop Handlers
  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;
    const newStrategy = [...form.values.strategy];
    const [draggedItem] = newStrategy.splice(draggedIndex, 1);
    newStrategy.splice(index, 0, draggedItem);
    form.setFieldValue('strategy', newStrategy);
    setDraggedIndex(null);
  };

  // Helper to color difficulty dropdown items
  const renderDifficultyOption = ({ option }: any) => {
    const colors: Record<string, string> = { Easy: 'green', Medium: 'orange', Hard: 'red' };
    return <Text fw={500} c={colors[option.value] || 'dark'}>{option.label}</Text>;
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="flex-end">
        <Stack gap="xs">
          <Title order={3}>Strategy & Modules</Title>
          <Text c="dimmed" size="sm">
            Build your guide using modular blocks.
          </Text>
        </Stack>
        <SegmentedControl
          value={viewMode}
          onChange={(val) => setViewMode(val as 'edit' | 'reorder')}
          data={[
            { label: 'Edit Content', value: 'edit' },
            { label: 'Reorder Blocks', value: 'reorder' },
          ]}
        />
      </Group>

      {/* PALETTE / ADD BUTTONS */}
      <Group>
        <Button variant="light" color="deadlockGreen" leftSection={<IconPlus size={16} />} onClick={addTextBlock}>
          Add Text Block
        </Button>
        {/* NEW BUTTON */}
        <Button variant="light" color="orange" leftSection={<IconSwords size={16} />} onClick={addMatchupBlock}>
          Add Matchup
        </Button>
      </Group>

      {/* CANVAS SECTION */}
      {form.values.strategy.length === 0 ? (
        <Paper withBorder p="xl" radius="md" style={{ textAlign: 'center' }}>
          <Text c="dimmed">No modules added yet. Click a button above to start building your guide.</Text>
        </Paper>
      ) : (
        <Stack gap="md">
          {form.values.strategy.map((module, index) => {
            const isReordering = viewMode === 'reorder';

            // Grab the enemy hero object if one is selected for this specific matchup block
            const enemyHero = module.type === 'matchup' && module.content.enemyHeroId
              ? heroes?.find(h => String(h.id) === module.content.enemyHeroId)
              : null;

            return (
              <Paper
                key={module.id}
                withBorder p="md" radius="md"
                draggable={isReordering}
                onDragStart={() => isReordering ? handleDragStart(index) : undefined}
                onDragOver={isReordering ? handleDragOver : undefined}
                onDrop={() => isReordering ? handleDrop(index) : undefined}
                style={{
                  backgroundColor: 'var(--mantine-color-body)',
                  opacity: draggedIndex === index ? 0.5 : 1,
                  cursor: isReordering ? 'grab' : 'default',
                  transition: 'all 0.2s ease',
                  borderColor: isReordering ? 'var(--mantine-color-deadlockGreen-light)' : 'var(--mantine-color-gray-3)'
                }}
              >
                {isReordering ? (
                  // --- REORDER VIEW ---
                  <Group justify="space-between" wrap="nowrap">
                    <Group wrap="nowrap">
                      <IconGripVertical size={20} style={{ color: 'var(--mantine-color-gray-5)' }} />
                      <Text fw={600}>{module.title || 'Untitled Section'}</Text>
                      <Badge size="sm" variant="light" color={module.type === 'matchup' ? 'orange' : 'gray'}>
                        {module.type === 'matchup' ? 'Matchup' : 'Text Module'}
                      </Badge>
                    </Group>
                    <ActionIcon color="red" variant="subtle" onClick={() => removeBlock(index)}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                ) : (
                  // --- EDIT VIEW ---
                  <Stack gap="sm">
                    <Group justify="space-between" wrap="nowrap" align="flex-start">
                      <TextInput
                        label="Section Title"
                        placeholder={module.type === 'matchup' ? "e.g., Playing against Infernus" : "e.g., Early Game Laning"}
                        style={{ flex: 1 }}
                        {...form.getInputProps(`strategy.${index}.title`)}
                      />
                      <ActionIcon color="red" variant="subtle" mt={24} onClick={() => removeBlock(index)}>
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Group>

                    {/* TEXT MODULE */}
                    {module.type === 'text' && (
                      <Textarea
                        label="Content"
                        placeholder="Write your strategy here..."
                        minRows={4} autosize
                        {...form.getInputProps(`strategy.${index}.content`)}
                      />
                    )}

                    {/* NEW: MATCHUP MODULE */}
                    {module.type === 'matchup' && (
                      <Stack gap="sm" mt="xs">
                        <Group align="flex-end" wrap="nowrap">
                          {/* Display the hero icon dynamically! */}
                          {enemyHero ? (
                            <Image src={enemyHero.images?.icon_hero_card_webp} w={60} radius="sm" fallbackSrc="https://placehold.co/60" />
                          ) : (
                            <Paper w={60} h={75} withBorder bg="gray.1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <IconSwords size={24} color="var(--mantine-color-gray-5)" />
                            </Paper>
                          )}

                          <Select
                            label="Enemy Hero"
                            placeholder="Search..."
                            data={heroSelectData}
                            searchable
                            style={{ flex: 1 }}
                            {...form.getInputProps(`strategy.${index}.content.enemyHeroId`)}
                          />

                          <Select
                            label="Difficulty"
                            placeholder="Select"
                            data={['Easy', 'Medium', 'Hard']}
                            renderOption={renderDifficultyOption} // Applies our colors
                            style={{ width: 120 }}
                            {...form.getInputProps(`strategy.${index}.content.difficulty`)}
                          />
                        </Group>

                        <Textarea
                          label="Matchup Analysis"
                          placeholder="How should you play against this hero?"
                          minRows={3} autosize
                          {...form.getInputProps(`strategy.${index}.content.analysis`)}
                        />
                      </Stack>
                    )}
                  </Stack>
                )}
              </Paper>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}