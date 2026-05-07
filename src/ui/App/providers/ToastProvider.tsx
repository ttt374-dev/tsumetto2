import { createContext, useContext, useState } from "react";
import { Snackbar, Alert, type AlertColor, } from "@mui/material";

type Toast = {
    message: string;
    severity?: AlertColor;
};

const ToastContext = createContext<(toast: Toast) => void>(() => { });

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = useState<Toast | null>(null);
    
    return (
        <ToastContext.Provider value={setToast}>
            {children}
            <Snackbar open={!!toast} autoHideDuration={3000} onClose={()=>setToast(null)}>
                <Alert onClose={()=>setToast(null)} severity={toast?.severity} sx={{ width: '100%' }}>
                    {toast?.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
