import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './ui/App/App.tsx'

import { ReviewSyncService } from '@/application/reviewSyncService.ts'
import { MissionRepository, LocalStorageMissionPersistence } from '@/domain/mission/repository/MissionRepository';
import { ReviewEventRepository } from '@/domain/review/repository/ReviewEventRepository';
import { LocalStrorageProblemPersistence, ProblemRepository } from '@/domain/problem/repository/ProblemRepository';
import { LocalfileReviewEventDataSource } from '@/infrastructure/review/LocalfileReviewEventDatasource';

async function main() {
    const repos = createRepositories()
    const syncService = new ReviewSyncService()
    syncService.start()

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App repos={repos} />
        </StrictMode>,
    )
}

function createRepositories() {
    return {
        problem: new ProblemRepository(new LocalStrorageProblemPersistence()),
        reviewEvent: new ReviewEventRepository(new LocalfileReviewEventDataSource()),
        mission: new MissionRepository(new LocalStorageMissionPersistence()),
    }
}

main()
