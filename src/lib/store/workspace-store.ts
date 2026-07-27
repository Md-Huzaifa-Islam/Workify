import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_COMPANY_ID } from "@/lib/mock-api/companies";

interface WorkspaceState {
  companyId: string;
  setCompanyId: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      companyId: DEFAULT_COMPANY_ID,
      setCompanyId: (id) => set({ companyId: id }),
    }),
    { name: "workify-workspace" },
  ),
);
