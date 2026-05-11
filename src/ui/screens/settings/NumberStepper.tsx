import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"

import {
  Box,
  IconButton,
  Typography,
} from "@mui/material"

export type NumberStepperProps = {
  label?: string

  value: number

  onChange: (value: number) => void

  min?: number
  max?: number

  step?: number

  disabled?: boolean
}

export function NumberStepper({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
}: NumberStepperProps) {

  const decDisabled =
    disabled ||
    (min !== undefined &&
      value - step < min)

  const incDisabled =
    disabled ||
    (max !== undefined &&
      value + step > max)

  const handleDec = () => {
    const next = value - step

    if (
      min !== undefined &&
      next < min
    ) {
      return
    }

    onChange(next)
  }

  const handleInc = () => {
    const next = value + step

    if (
      max !== undefined &&
      next > max
    ) {
      return
    }

    onChange(next)
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
    >
      {label && (
        <Typography
          sx={{
            width: 140,
            flexShrink: 0,
          }}
        >
          {label}
        </Typography>
      )}

      <Box
        display="flex"
        alignItems="center"
        gap={1}
      >
        <IconButton
          onClick={handleDec}
          disabled={decDisabled}
        >
          <RemoveIcon />
        </IconButton>

        <Box
          sx={{
            minWidth: 56,
            px: 2,
            py: 1,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Typography>
            {value}
          </Typography>
        </Box>

        <IconButton
          onClick={handleInc}
          disabled={incDisabled}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  )
}