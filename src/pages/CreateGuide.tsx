// src/pages/CreateGuide.tsx
import { useState, useEffect } from 'react';
import { Stepper, Button, Group, Container, Title, Paper, Text, Stack } from '@mantine/core'; // <-- Added Paper, Text, Stack
import { useNavigate, useSearchParams, Link } from 'react-router-dom'; // <-- Added Link
import { IconCircleCheck } from '@tabler/icons-react'; // <-- Added Success Icon
import { useGuideForm, GuideFormProvider } from '../context/GuideFormContext';
import { StepGeneral } from '../components/guide-builder/StepGeneral';
import { StepAbilities } from '../components/guide-builder/StepAbilities';
import { StepLoadout } from '../components/guide-builder/StepLoadout';
import { StepStrategy } from '../components/guide-builder/StepStrategy';
import { StepReview } from '../components/guide-builder/StepReview';

export function CreateGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const preselectedHeroId = searchParams.get('heroId');

  // NEW: State to track if the form was successfully submitted
  const [publishedGuideId, setPublishedGuideId] = useState<string | null>(null);

  const form = useGuideForm({
    initialValues: {
      title: '',
      heroId: preselectedHeroId || null,
      role: null,
      abilityOrder: [],
      build: { early: [], mid: [], late: [], situational: [] },
      strategy: [],
    },
    validate: {
      title: (value) => (value.length < 3 ? 'Title must be at least 3 characters' : null),
      heroId: (value) => (!value ? 'Please select a hero' : null),
      role: (value) => (!value ? 'Please select a role' : null),
    },
  });

  // Handle Before Unload to prevent accidental data loss
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.isDirty() && !publishedGuideId) { // <-- Don't warn if they already published
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [form, publishedGuideId]);

  const validateStep = (step: number) => {
    if (step === 0) {
      const hasErrors =
        form.validateField('title').hasError ||
        form.validateField('heroId').hasError ||
        form.validateField('role').hasError;
      return !hasErrors;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep((current) => (current < 4 ? current + 1 : current));
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (validateStep(activeStep)) {
      setActiveStep(stepIndex);
    }
  };

  const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = (values: typeof form.values) => {
    const newGuide = {
      ...values,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
    };

    const existingGuides = JSON.parse(localStorage.getItem('deadlock_guides') || '[]');
    existingGuides.push(newGuide);
    localStorage.setItem('deadlock_guides', JSON.stringify(existingGuides));

    form.reset();

    // CHANGED: Instead of navigating immediately, we set the success state
    setPublishedGuideId(newGuide.id);
  };

  // --- NEW: SUCCESS SCREEN RENDER ---
  // If we have a published ID, hijack the whole page and show the success screen
  if (publishedGuideId) {
    return (
      <Container size="sm" mt="xl">
        <Paper withBorder shadow="md" p="xl" radius="md" style={{ textAlign: 'center' }}>
          <IconCircleCheck
            size={80}
            color="var(--mantine-color-green-6)"
            style={{ margin: '0 auto', marginBottom: '1rem' }}
          />
          <Title order={2} mb="sm">Guide Published Successfully!</Title>
          <Text c="dimmed" mb="xl">
            Your build is now saved and available for the community to view. Excellent work!
          </Text>
          <Group justify="center">
            <Button component={Link} to="/" variant="default" size="md">
              Back to Home
            </Button>
            <Button component={Link} to={`/guides/${publishedGuideId}`} color="deadlockGreen" size="md">
              View Your Guide
            </Button>
          </Group>
        </Paper>
      </Container>
    );
  }

  // --- STANDARD BUILDER RENDER ---
  return (
    <Container fluid size="lg">
      <Title order={2} mb="xl">Create a New Guide</Title>

      <GuideFormProvider form={form}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stepper active={activeStep} onStepClick={handleStepClick}>

            <Stepper.Step label="General" description="Hero & Role">
              <StepGeneral />
            </Stepper.Step>

            <Stepper.Step label="Abilities" description="Skill Build">
              <StepAbilities />
            </Stepper.Step>

            <Stepper.Step label="Loadout" description="Items & Build">
              <StepLoadout />
            </Stepper.Step>

            <Stepper.Step label="Strategy" description="Playstyle Guide">
              <StepStrategy />
            </Stepper.Step>

            <Stepper.Completed>
              <StepReview />
            </Stepper.Completed>

          </Stepper>

          <Group justify="space-between" mt="xl">
            <Button variant="default" onClick={prevStep} disabled={activeStep === 0}>
              Back
            </Button>

            {activeStep === 4 ? (
              <Button type="submit" color="green">Publish Guide</Button>
            ) : (
              <Button type="button" onClick={nextStep}>Next step</Button>
            )}
          </Group>
        </form>
      </GuideFormProvider>
    </Container>
  );
}