import { AppShell, Burger, Group, Title, NavLink, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, NavLink as RouterLink, useLocation } from 'react-router-dom';

export function MainLayout() {
  // useDisclosure manages the open/closed state of the mobile sidebar
  const [opened, { toggle }] = useDisclosure();
  // We use this to highlight the active link in the sidebar
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3} c="grape">Deadlock Guides</Title>
          </Group>
          
          <Button component={RouterLink} to="/create" variant="light" color="grape">
            + New Guide
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <NavLink
          component={RouterLink}
          to="/"
          label="Home"
          active={location.pathname === '/'}
          onClick={toggle} // Closes sidebar on mobile after clicking
        />
        <NavLink
          component={RouterLink}
          to="/create"
          label="Create Guide"
          active={location.pathname === '/create'}
          onClick={toggle}
        />
        {/* We can add filters like "By Hero" or "By Role" here later */}
      </AppShell.Navbar>

      <AppShell.Main>
        {/* The Outlet is where Home.tsx or CreateGuide.tsx will be rendered */}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}