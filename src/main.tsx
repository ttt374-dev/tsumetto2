import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './ui/App/App.tsx'

import { ReviewSyncService } from '@/application/reviewSyncService.ts'
import { MissionRepository, LocalStorageMissionPersistence } from '@/domain/mission/repository/MissionRepository';
import { ReviewEventRepository } from '@/domain/review/repository/ReviewEventRepository';
import { LocalStrorageProblemPersistence, ProblemRepository } from '@/domain/problem/repository/ProblemRepository';
import { LocalfileReviewEventDataSource } from '@/infrastructure/review/LocalfileReviewEventDatasource';
import { createDefaultMission } from '@/domain/mission/entity/createDefaultMission.ts'
import { initializeLearningRecordSync } from '@/ui/features/learning/hooks/useLearningRecordStore.ts'

async function main() {
    const { repos } = await bootstrap()

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App repos={repos} />
        </StrictMode>,
    )
}
async function bootstrap(){
    const repos = createRepositories()
    const syncService = new ReviewSyncService()
    syncService.start()

    // mission が空だったら一つ作る
    const missions = await repos.mission.findAll()
    if (missions.length === 0) {
        await repos.mission.replaceAll([createDefaultMission()])
    }
       
    //initializeLearningRecordSync()
    return { repos }

}
function createRepositories() {
    return {
        problem: new ProblemRepository(new LocalStrorageProblemPersistence()),
        reviewEvent: new ReviewEventRepository(new LocalfileReviewEventDataSource()),
        mission: new MissionRepository(new LocalStorageMissionPersistence()),
    }
}

main()
