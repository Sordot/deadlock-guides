import { AppShell, Burger, Group, Title, Button, Tooltip, ActionIcon, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, NavLink as RouterLink, useLocation } from 'react-router-dom';
import { IconHome, IconSquarePlus } from '@tabler/icons-react';

export function MainLayout() {
    const [opened, { toggle }] = useDisclosure();
    const location = useLocation();

    return (
        <AppShell
            header={{ height: 60 }}
            //Sidebar styles to be "icon only"
            navbar={{ width: 80, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Title order={3}>Deadlock Guides</Title>
                    </Group>

                    <Button component={RouterLink} to="/create" color="green">
                        + New Guide
                    </Button>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="sm">
                {/* Stack centers the icons vertically and horizontally */}
                <Stack align="center" gap="md" mt="sm">

                    <Tooltip label="Home" position="right" withArrow>
                        <ActionIcon
                            component={RouterLink}
                            to="/"
                            //Conditional styling based on the current URL route
                            variant={location.pathname === '/' ? 'light' : 'subtle'}
                            color={location.pathname === '/' ? 'green.5' : 'gray'}
                            size="xl"
                            radius="md"
                            onClick={toggle}
                        >
                            <IconHome size={28} stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip label="Create Guide" position="right" withArrow>
                        <ActionIcon
                            component={RouterLink}
                            to="/create"
                            variant={location.pathname === '/create' ? 'light' : 'subtle'}
                            color={location.pathname === '/create' ? 'green.5' : 'gray'}
                            size="xl"
                            radius="md"
                            onClick={toggle}
                        >
                            <IconSquarePlus size={28} stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>

                    {/* placeholder route for heroes */}
                    {/* <Tooltip label="Heroes" position="right" withArrow>
                        <ActionIcon
                            component={RouterLink}
                            to="/heroes"
                            variant={location.pathname === '/heroes' ? 'light' : 'subtle'}
                            color={location.pathname === '/heroes' ? 'green' : 'gray'}
                            size="xl"
                            radius="md"
                            onClick={toggle}
                        >
                            <IconSwords size={28} stroke={1.5} />
                        </ActionIcon>
                    </Tooltip> */}

                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}