import type React from 'react';
import { RepositoryProvider } from './RepositoryProvider';
import { ToastProvider } from './ToastProvider';
import { LibraryQueryProvider, MissionQueryProvider } from './QueryProvider';
import { MissionEventStoreContext, MissionEventStoreProvider } from './MissionEventStoreProvider';

export function AllProviders({ children }: { children: React.ReactNode }) {
    return (
        <RepositoryProvider>
            <ToastProvider>
                <MissionQueryProvider>
                    <LibraryQueryProvider>
                        <MissionEventStoreProvider>
                            {children}
                        </MissionEventStoreProvider>
                    </LibraryQueryProvider>
                </MissionQueryProvider>
            </ToastProvider>
        </RepositoryProvider >
    )
}