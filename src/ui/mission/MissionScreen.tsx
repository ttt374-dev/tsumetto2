import { useExercise } from "@/application/useExercise";
import { AppLayout } from "../common/AppLayout";


export function MissionScreen(){
    const { exerciseList } = useExercise()



    return (
        <AppLayout>
            <></>
        </AppLayout>
    )
}