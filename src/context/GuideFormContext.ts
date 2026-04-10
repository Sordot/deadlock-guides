import { createFormContext } from '@mantine/form';
import { type Item } from '../hooks/useItems';

// 1. Define the exact shape of the data we want to collect
export interface GuideFormValues {
  title: string;
  heroId: string | null;
  role: string | null;
  // Store our level 1-15 progression
  // array where each index represents a level, and the value is the ID of the ability chosen.
  abilityOrder: number[];
  build: {
    early: Item[];
    mid: Item[];
    late: Item[];
    situational: Item[];
  };
  strategy: string;
}

export interface SavedGuide extends GuideFormValues {
  id: string;
  createdAt: string;
  upvotes: number;
}

// Create the context hooks. Mantine creates a dedicated Provider and hooks specifically typed based on interface above
export const [GuideFormProvider, useGuideFormContext, useGuideForm] =
  createFormContext<GuideFormValues>();