import { createContext, useContext, ReactNode, useRef, useCallback } from 'react';
import { useSignalR } from '../hooks/useSignalR';

type SignalRContextType = {
  onTodoCompleted: (callback: (ids: number | number[]) => void) => () => void;
};

const SignalRContext = createContext<SignalRContextType | null>(null);

export function useSignalRContext() {
  const ctx = useContext(SignalRContext);
  if (!ctx) throw new Error('useSignalRContext must be used within SignalRProvider');
  return ctx;
}

export function SignalRProvider({ children }: { children: ReactNode }) {
  const callbacksRef = useRef<Set<(ids: number | number[]) => void>>(new Set());

  const onTodoCompleted = useCallback((callback: (ids: number | number[]) => void) => {
    callbacksRef.current.add(callback);
    return () => callbacksRef.current.delete(callback);
  }, []);

  const handleTodoCompleted = useCallback((ids: number | number[]) => {
    callbacksRef.current.forEach(cb => cb(ids));
  }, []);

  useSignalR(handleTodoCompleted);

  return (
    <SignalRContext.Provider value={{ onTodoCompleted }}>
      {children}
    </SignalRContext.Provider>
  );
}