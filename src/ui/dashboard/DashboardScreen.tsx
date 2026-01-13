import { buildQueue } from "@/application/useFsm";
import { Button, List, ListItem } from "@mui/material";
import { useStoreContext } from "../App/providers/StoreProvider";
import { useFsmContext } from "../App/providers/fsmPRovider";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../common/AppLayout";

export function DashboardScreen() {
    const navigate = useNavigate()
    const stores = useStoreContext()
    const fsm = useFsmContext()

    const queue = buildQueue(stores.problem.problems)

    const handleStart = () => {
        fsm.start(queue)
        navigate("/player")        
    }
    return (
        <AppLayout>
            <Button onClick={handleStart}>
                Start
            </Button>

            Queue:
            <List>
                {
                    queue.map((item) => (<>
                        <ListItem>
                            {item.problemId}
                        </ListItem>
                    </>))
                }
            </List>
        </AppLayout>
    )
}