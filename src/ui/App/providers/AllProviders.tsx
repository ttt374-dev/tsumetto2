import type React from 'react';
import { RepositoryProvider } from './RepositoryProvider';
import { ToastProvider } from './ToastProvider';
import { LibraryQueryProvider, MissionQueryProvider } from './QueryProvider';

export function AllProviders({ children }: { children: React.ReactNode }) {
    return (
        <RepositoryProvider>
            <ToastProvider>
                <MissionQueryProvider>
                    <LibraryQueryProvider>

                            {children}

                    </LibraryQueryProvider>
                </MissionQueryProvider>
            </ToastProvider>
        </RepositoryProvider >
    )
}