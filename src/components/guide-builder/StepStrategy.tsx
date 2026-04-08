// src/components/guide-builder/StepStrategy.tsx
import { Textarea, Paper, Title, Text } from '@mantine/core';
import { useGuideFormContext } from '../../context/GuideFormContext';

export function StepStrategy() {
  const form = useGuideFormContext();

  return (
    <Paper shadow="sm" p="xl" radius="md" withBorder>
      <Title order={4} mb="sm">Strategy & Matchups</Title>
      <Text c="dimmed" size="sm" mb="xl">
        Explain how to play this build. What are the power spikes? Who counters this hero?
      </Text>

      <Textarea
        minRows={10}
        placeholder="In the early game, focus on farming your lane using..."
        {...form.getInputProps('strategy')}
      />
    </Paper>
  );
}