import { Button, Stack, type ButtonProps } from "@mui/material"

export function PlayerFooterPanel(props: {
    onNext: () => void
    onPrev: () => void
    onShowList: () => void
}) {
    
    return (
        <Stack direction="row">
            <Button onClick={props.onPrev} fullWidth variant="outlined">
                前へ
            </Button>

            <Button onClick={props.onShowList} fullWidth variant="outlined">
                問題リスト
            </Button>            
            
            <Button onClick={props.onNext} fullWidth variant="contained">
                次へ
            </Button>
        </Stack>
    )

}