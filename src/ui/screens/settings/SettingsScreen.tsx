import { Box, Divider, MenuItem, Select, Stack, Switch, TextField, Typography} from "@mui/material"

import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useUiSettingsStore } from "@/ui/screens/settings/useUiSettingsStore"
import FooterNavigation from "@/ui/common/components/FooterNavigation"

type SettingItem =
    | {
        kind: "number"
        key: string
        label: string
        description?: string
        value: number
        onChange: (value: number) => void
    }

    | {
        kind: "boolean"
        key: string
        label: string
        description?: string
        value: boolean
        onChange: (value: boolean) => void
    }

    | {
        kind: "select"
        key: string
        label: string
        description?: string
        value: string
        options: readonly string[]
        onChange: (value: string) => void
    }

type SettingSection = {
    title: string
    items: SettingItem[]
}

export function SettingsScreen() {

    const settings = useUiSettingsStore(s => s.settings)
    const setSettings = useUiSettingsStore(s => s.setSettings)

    const sections: SettingSection[] = [
        {
            title: "Mission",
            items: [
                  {
                    kind: "number",
                    key: "chunkSize",
                    label: "Chunk Size",

                    value: settings.chunkSize,

                    onChange: value =>
                        setSettings({
                            chunkSize: value,
                        }),
                },             

                {
                    kind: "boolean",
                    key: "showSeconds",
                    label: "Show Seconds",

                    description:
                        "Display seconds in timestamps",

                    value: settings.showSeconds,

                    onChange: value =>
                        setSettings({
                            showSeconds: value,
                        }),
                },

                {
                    kind: "select",
                    key: "listDensity",
                    label: "List Density",

                    value: settings.listDensity,

                    options: [
                        "compact",
                        "comfortable",
                    ],

                    onChange: value =>
                        setSettings({
                            listDensity:
                                value as typeof settings.listDensity,
                        }),
                },
            ],
        },
     
    ]

    return (
        <AppShell
            header="設定"
            footer={<FooterNavigation/>}
        >
            <Stack
                sx={{
                    height: "100%",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        p: 2,
                    }}
                >
                    <Stack spacing={3}>
                        {sections.map(section => (
                            <Box key={section.title}>
                                <Typography
                                    variant="h6"
                                    sx={{ mb: 2 }}
                                >
                                    {section.title}
                                </Typography>

                                <Stack spacing={2}>
                                    {section.items.map(item => (
                                        <SettingField
                                            key={item.key}
                                            item={item}
                                        />
                                    ))}
                                </Stack>
                                <Divider sx={{ mt: 3 }} />
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Stack>
        </AppShell>
    )
}

function SettingField({ item }: {
    item: SettingItem
}) {
    switch (item.kind) {

        case "number":
            return (
                <TextField
                    label={item.label}
                    helperText={item.description}
                    type="number"
                    value={item.value}
                    onChange={e =>
                        item.onChange(Number(e.target.value))
                    }
                    fullWidth
                />
            )

        case "boolean":
            return (
                <Box>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>

                            <Typography>
                                {item.label}
                            </Typography>

                            {item.description && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {item.description}
                                </Typography>
                            )}

                        </Box>

                        <Switch
                            checked={item.value}
                            onChange={(_, checked) =>
                                item.onChange(checked)
                            }
                        />

                    </Stack>

                </Box>
            )

        case "select":
            return (
                <Box>

                    <Typography sx={{ mb: 1 }}>
                        {item.label}
                    </Typography>

                    {item.description && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            {item.description}
                        </Typography>
                    )}

                    <Select
                        value={item.value}
                        onChange={e =>
                            item.onChange(e.target.value)
                        }
                        fullWidth
                    >
                        {item.options.map(option => (
                            <MenuItem
                                key={option}
                                value={option}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Select>

                </Box>
            )
    }
}