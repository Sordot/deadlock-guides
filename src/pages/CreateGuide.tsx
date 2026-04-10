// src/pages/CreateGuide.tsx
import { useState, useEffect } from 'react';
import { Stepper, Button, Group, Container, Title } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGuideForm, GuideFormProvider } from '../context/GuideFormContext';
import { StepGeneral } from '../components/guide-builder/StepGeneral';
import { StepAbilities } from '../components/guide-builder/StepAbilities';
import { StepLoadout } from '../components/guide-builder/StepLoadout';
import { StepStrategy } from '../components/guide-builder/StepStrategy';

export function CreateGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  // Initialize the searchParams hook to read the URL
  const [searchParams] = useSearchParams();
  const preselectedHeroId = searchParams.get('heroId');

  // Initialize the form with validation rules
  const form = useGuideForm({
    initialValues: {
      title: '',
      heroId: preselectedHeroId || null,
      role: null,
      abilityOrder: [],
      build: { early: [], mid: [], late: [], situational: [] },
      strategy: '',
    },
    validate: {
      title: (value) => (value.length < 3 ? 'Title must be at least 3 characters' : null),
      heroId: (value) => (!value ? 'Please select a hero' : null),
      role: (value) => (!value ? 'Please select a role' : null),
    },
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // form.isDirty() is a built-in Mantine function that returns true if any value has changed from the initialValues
      if (form.isDirty()) {
        e.preventDefault();
        // Setting e.returnValue to any string triggers the browser's native warning dialog
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [form]);

  // This centralizes our validation logic
  const validateStep = (step: number) => {
    if (step === 0) {
      const hasErrors =
        form.validateField('title').hasError ||
        form.validateField('heroId').hasError ||
        form.validateField('role').hasError;
      return !hasErrors; // Returns true if valid, false if blocked
    }
    // Add validation for Step 1 (Loadout) or Step 2 (Strategy) here later if needed
    return true;
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep((current) => (current < 3 ? current + 1 : current));
    }
  };

  // The new interceptor for the top navigation bar
  const handleStepClick = (stepIndex: number) => {
    // Only validate if they are trying to navigate AWAY from the current step
    // to a different step. 
    if (validateStep(activeStep)) {
      setActiveStep(stepIndex);
    }
  };

  const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = (values: typeof form.values) => {
    // 1. Create a unique guide object
    const newGuide = {
      ...values,
      // eslint-disable-next-line react-hooks/purity
      id: Date.now().toString(), // Simple unique ID generator
      createdAt: new Date().toISOString(),
      upvotes: 0
    };

    // 2. Fetch existing guides from local storage
    const existingGuides = JSON.parse(localStorage.getItem('deadlock_guides') || '[]');

    // 3. Append and save
    existingGuides.push(newGuide);
    localStorage.setItem('deadlock_guides', JSON.stringify(existingGuides));

    // 4. Reset form so the beforeunload warning doesn't trigger
    form.reset();

    // 5. Navigate to the new guide view
    navigate(`/guides/${newGuide.id}`);
  };

  return (
    <Container fluid size="lg">
      <Title order={2} mb="xl">Create a New Guide</Title>

      {/* The Provider wraps the Stepper, making 'form' available to all child steps */}
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
              <Title order={3} ta="center" mt="xl">You are ready to publish!</Title>
            </Stepper.Completed>

          </Stepper>

          <Group justify="space-between" mt="xl">
            <Button variant="default" onClick={prevStep} disabled={activeStep === 0}>
              Back
            </Button>

            {activeStep === 3 ? (
              <Button type="submit" color="green">Publish Guide</Button>
            ) : (
              <Button onClick={nextStep}>Next step</Button>
            )}
          </Group>
        </form>
      </GuideFormProvider>
    </Container>
  );
}