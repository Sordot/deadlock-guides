import { useState } from 'react';
import { Stack, Group, Text, Paper, Button, TextInput, Textarea, ActionIcon, Title, SegmentedControl, Badge } from '@mantine/core';
import { IconGripVertical, IconPlus, IconTrash } from '@tabler/icons-react';
import { useGuideFormContext, type StrategyModule } from '../../context/GuideFormContext';

export function StepStrategy() {
  const form = useGuideFormContext();

  // Toggle between 'edit' and 'reorder'
  const [viewMode, setViewMode] = useState<'edit' | 'reorder'>('edit');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addTextBlock = () => {
    const newBlock: StrategyModule = {
      id: Date.now().toString(),
      type: 'text',
      title: 'New Text Section',
      content: ''
    };
    // Mantine's built in array helper!
    form.insertListItem('strategy', newBlock);

    // Auto-switch to edit mode so they can start typing right away
    setViewMode('edit');
  };

  const removeBlock = (index: number) => {
    form.removeListItem('strategy', index);
  };

  // --- DRAG AND DROP HANDLERS (Only active in 'reorder' mode) ---
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;

    const newStrategy = [...form.values.strategy];
    const [draggedItem] = newStrategy.splice(draggedIndex, 1);
    newStrategy.splice(index, 0, draggedItem);

    form.setFieldValue('strategy', newStrategy);
    setDraggedIndex(null);
  };

  return (
    <Stack gap="xl">
      {/* HEADER SECTION */}
      <Group justify="space-between" align="flex-end">
        <Stack gap="xs">
          <Title order={3}>Strategy & Modules</Title>
          <Text c="dimmed" size="sm">
            Build your guide using modular blocks. Add text sections to explain your playstyle.
          </Text>
        </Stack>

        <Group>
          <SegmentedControl
            value={viewMode}
            onChange={(val) => setViewMode(val as 'edit' | 'reorder')}
            data={[
              { label: 'Edit Content', value: 'edit' },
              { label: 'Reorder Blocks', value: 'reorder' },
            ]}
          />
        </Group>
      </Group>

      {/* PALETTE / ADD BUTTONS */}
      <Group>
        <Button
          variant="light"
          color="deadlockGreen"
          leftSection={<IconPlus size={16} />}
          onClick={addTextBlock}
        >
          Add Text Block
        </Button>
        {/* We will add "Add Matchup" and "Add Itemization" buttons here later! */}
      </Group>

      {/* CANVAS SECTION */}
      {form.values.strategy.length === 0 ? (
        <Paper withBorder p="xl" radius="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)', textAlign: 'center' }}>
          <Text c="dimmed">No modules added yet. Click "Add Text Block" to start building your guide.</Text>
        </Paper>
      ) : (
        <Stack gap="md">
          {form.values.strategy.map((module, index) => {
            const isReordering = viewMode === 'reorder';

            return (
              <Paper
                key={module.id}
                withBorder
                p="md"
                radius="md"
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
                  // --- REORDER VIEW (Collapsed & Draggable) ---
                  <Group justify="space-between" wrap="nowrap">
                    <Group wrap="nowrap">
                      <IconGripVertical size={20} style={{ color: 'var(--mantine-color-gray-5)' }} />
                      <Text fw={600}>{module.title || 'Untitled Section'}</Text>
                      <Badge size="sm" variant="light" color="gray">Text Module</Badge>
                    </Group>
                    <ActionIcon color="red" variant="subtle" onClick={() => removeBlock(index)}>
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                ) : (
                  // --- EDIT VIEW (Expanded Inputs) ---
                  <Stack gap="sm">
                    <Group justify="space-between" wrap="nowrap" align="flex-start">
                      <TextInput
                        label="Section Title"
                        placeholder="e.g., Early Game Laning"
                        style={{ flex: 1 }}
                        // Mantine form handles nested array state automatically!
                        {...form.getInputProps(`strategy.${index}.title`)}
                      />
                      <ActionIcon color="red" variant="subtle" mt={24} onClick={() => removeBlock(index)}>
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Group>

                    {module.type === 'text' && (
                      <Textarea
                        label="Content"
                        placeholder="Write your strategy here..."
                        minRows={4}
                        autosize
                        {...form.getInputProps(`strategy.${index}.content`)}
                      />
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