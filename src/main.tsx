import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './ui/App/App.tsx'

import { MissionRepository, LocalStorageMissionPersistence } from '@/domain/mission/repository/MissionRepository';
import { ReviewEventRepository } from '@/domain/review/repository/ReviewEventRepository';
import { ProblemRepository } from '@/domain/problem/repository/ProblemRepository';
import { LocalfileReviewEventDataSource } from '@/infrastructure/datasource/review/LocalfileReviewEventDatasource.ts';
import { createDefaultMission } from '@/domain/mission/entity/createDefaultMission.ts'
import { LocalFileProblemDatasource } from '@/infrastructure/datasource/problem/LocalfileProblemDatasource.ts';

async function main() {
    const repos = createRepositories()
    await ensureDefaultMission(repos.mission)

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App repos={repos} />
        </StrictMode>,
    )
}
function createRepositories() {
    return {
        problem: new ProblemRepository(new LocalFileProblemDatasource()),
        reviewEvent: new ReviewEventRepository(new LocalfileReviewEventDataSource()),
        mission: new MissionRepository(new LocalStorageMissionPersistence()),
    }
}
async function ensureDefaultMission(missionRepo: MissionRepository){
    // mission が空だったら一つ作る
    const missions = await missionRepo.findAll()
    if (missions.length === 0) {
        await missionRepo.replaceAll([createDefaultMission()])
    }
}
main()
