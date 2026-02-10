import { List } from "@mui/material";
import { AppLayout } from "../common/AppLayout";


type Deck = string

export default function DecksScreen(){
    const decks: Deck[] = []
    return (
        <AppLayout>
            <List>
                {
                    decks.map(deck=>("asdf"))
                }
            </List>
        </AppLayout>
    )

}