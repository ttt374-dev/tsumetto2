import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import { IconButton } from "@mui/material"

export function StarToggleButton({ starred, onToggle, ...iconButtonProps }: {
    starred: boolean, onToggle: () => void

} & React.ComponentProps<typeof IconButton>) {

    return (
        <IconButton onClick={(e) => {
            e.stopPropagation()
            onToggle()
        }}
            {...iconButtonProps}
            aria-pressed={starred}
            aria-label={starred ? "Unstar" : "Star"}
        >
            {starred ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
    )
}