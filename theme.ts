import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Crisp, readable white/grays. Frost White (#f1f3f5) is at index 2.
const frostWhite: MantineColorsTuple = [
  '#fdfdfd', '#f8f9fa', '#f1f3f5', '#e9ecef', '#dee2e6', 
  '#ced4da', '#adb5bd', '#868e96', '#495057', '#343a40'
];

// Primary Brand Color: Includes #72947f (Index 5), #3f5d4d (Index 8), #2f4442 (Index 9)
const deadlockGreen: MantineColorsTuple = [
  '#eef3f0', '#e0e8e3', '#c2d3c9', '#a2bcae', '#86a896', 
  '#72947f', '#5e7e6a', '#4c6857', '#3f5d4d', '#2f4442'
];

export const theme = createTheme({
  colors: {
    frost: frostWhite,
    green: deadlockGreen,
  },
  primaryColor: 'green',
  primaryShade: 5,
  autoContrast: true,
  defaultRadius: 'sm',
  
  headings: {
    fontWeight: '800', 
  },
  
  components: {
    AppShell: {
      styles: {
        main: { backgroundColor: '#222021' }, 
        header: { backgroundColor: '#181718', borderBottom: '1px solid #2f4442' },
        navbar: { backgroundColor: '#181718', borderRight: '1px solid #2f4442' },
      }
    },
    Button: {
      defaultProps: {
        variant: 'filled',
      }
    },
    Title: {
      defaultProps: {
        // Pointing directly to #f1f3f5 in our new array
        c: 'frost.2' 
      }
    },
    Text: {
      defaultProps: {
        // A slightly darker gray from the frost array for highly readable paragraph text
        c: 'frost.5' 
      }
    }
  }
});