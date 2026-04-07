import { AppShell, Burger, Group, Title, Button, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, NavLink as RouterLink, useLocation } from 'react-router-dom';
import { IconHome, IconSquarePlus } from '@tabler/icons-react';

export function MainLayout() {
    const [opened, { toggle }] = useDisclosure();
    const location = useLocation();

    return (
        <AppShell
            header={{ height: 60 }}
            // Expanded width from 80 to 250 to accommodate text
            navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Title order={3}>Deadlock Guides</Title>
                    </Group>

                    <Button component={RouterLink} to="/create" color="deadlockGreen">
                        + New Guide
                    </Button>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="sm">
                <NavLink
                    component={RouterLink}
                    to="/"
                    label="Home"
                    leftSection={<IconHome size={20} stroke={1.5} />}
                    // Mantine's NavLink automatically applies your primary color when active is true
                    active={location.pathname === '/'}
                    onClick={toggle}
                />

                <NavLink
                    component={RouterLink}
                    to="/create"
                    label="Create Guide"
                    leftSection={<IconSquarePlus size={20} stroke={1.5} />}
                    active={location.pathname === '/create'}
                    onClick={toggle}  
                />

                {/* placeholder route for heroes */}
                {/* <NavLink
                    component={RouterLink}
                    to="/heroes"
                    label="Heroes"
                    leftSection={<IconSwords size={20} stroke={1.5} />}
                    active={location.pathname === '/heroes'}
                    onClick={toggle}
                    borderRadius="md"
                /> */}
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}