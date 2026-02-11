import type React from 'react';
import { RepositoryProvider } from './RepositoryProvider';
import { ToastProvider } from './ToastProvider';
import { LibraryQueryProvider} from './QueryProvider';

export function AllProviders({ children }: { children: React.ReactNode }) {
    return (
        <RepositoryProvider>
            <ToastProvider>
                <LibraryQueryProvider>

                    {children}

                </LibraryQueryProvider>

            </ToastProvider>
        </RepositoryProvider >
    )
}