import { createFormContext } from '@mantine/form';
import { type Item } from '../hooks/useItems';

export type StrategyModuleType = 'text' | 'matchup' | 'itemization' | 'ability_breakdown';

export interface StrategyModule {
  id: string;      // Unique ID for React keys and drag-and-drop
  type: StrategyModuleType;
  title: string;   // The user-defined header for this specific section
  content: any;    // The actual data (will be strictly typed later per module)
}

// 1. Define the exact shape of the data we want to collect
export interface GuideFormValues {
  title: string;
  heroId: string | null;
  role: string | null;
  abilityOrder: number[];
  build: {
    early: Item[];
    mid: Item[];
    late: Item[];
    situational: Item[];
  };
  strategy: StrategyModule[];
}

export interface SavedGuide extends GuideFormValues {
  id: string;
  createdAt: string;
  upvotes: number;
}

// Create the context hooks. Mantine creates a dedicated Provider and hooks specifically typed based on interface above
export const [GuideFormProvider, useGuideFormContext, useGuideForm] =
  createFormContext<GuideFormValues>();