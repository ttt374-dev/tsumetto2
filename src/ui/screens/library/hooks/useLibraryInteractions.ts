import type { ProblemId } from "@/domain/problem/entity/Problem"
import { paths } from "@/router/paths"
import { type LibrarySelection } from "@/ui/screens/library/hooks/useLibrarySelection"
import { useNavigate } from "react-router-dom"

export function useLibraryInteractions(selection: LibrarySelection) {    
    const navigate = useNavigate()
    
    const deps = {
        selection: {
            isSelecting: selection.isSelecting,
            toggleChecked: selection.toggleChecked
        },
        navigation: {
            openDetail: (pid: ProblemId) => navigate(paths.detail(pid))
        }
    }

    const onItemClick =
        (id: ProblemId) => {
            if (deps.selection.isSelecting) {
                deps.selection.toggleChecked(id)
            }
            else {
                deps.navigation.openDetail(id)
            }
        }

    return {
        onItemClick,
    }
}