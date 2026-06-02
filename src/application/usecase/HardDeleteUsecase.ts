import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"

export function useHardDeleteUsecase(){
    const repos = useRepositoryContext()
    
    const execute = async () => {
        return await repos.problem.hardDeleteDeleted()
    }

    return execute 
}