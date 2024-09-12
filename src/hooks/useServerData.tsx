import { useContext } from "react";
import {
  DataProviderContext,
  type DataProviderContextType,
} from "@/contexts/ServerFeedContext";

export function useServerData(): DataProviderContextType {
  const context = useContext(DataProviderContext);

  if (context === undefined)
    throw new Error("useServerData must be used within a DataContextProvder");

  return context;
}
