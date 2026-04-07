import { createTheme } from '@mantine/core';
import { generateColors } from '@mantine/colors-generator';

export const theme = createTheme({

  colors: {
    deadlockGreen: generateColors('#72947f'),
  },

  // Set the generated Deadlock Green as the default primary color for the app
  primaryColor: 'deadlockGreen',

  // Set the global white value to your Frostwhite hex
  white: '#f1f3f5',

  // Force typography components to use Frostwhite by default
  components: {
    Text: {
      defaultProps: {
        c: '#f1f3f5',
      },
    },
    Title: {
      defaultProps: {
        c: '#f1f3f5',
      },
    },
    // Optional: Keep links readable by setting them to your custom green
    Anchor: {
      defaultProps: {
        c: 'deadlockGreen.5', // Targets the middle shade of the generated palette
      },
    },
  },
});