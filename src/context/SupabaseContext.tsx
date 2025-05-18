import React, { createContext, useContext } from 'react';
import supabase from '../utils/supabaseClient';

interface SupabaseContextProps {
  supabase: typeof supabase;
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}