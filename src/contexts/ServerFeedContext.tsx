import { createContext, useState } from "react";

export type ServerDataType = {
  status: string;
  time: string;
  machine: number;
};

type TotalTimingType = {
  totalES: number;
  totalRN: number;
  totalMS: number;
};

export type DataProviderContextType =
  | {
      data: ServerDataType[] | undefined;
      isLoading: boolean;
      totalTimings: TotalTimingType[] | undefined;
    }
  | undefined;

const statuses = {
  ES: "Emergency Stop",
  RN: "Running",
  MS: "Manual Stop",
};

export const DataProviderContext =
  createContext<DataProviderContextType>(undefined);

export const DataProvider = ({ children }: React.PropsWithChildren) => {
  const [data, setData] = useState<ServerDataType[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [totalTime, setTotalTime] = useState<TotalTimingType[] | undefined>();

  return (
    <DataProviderContext.Provider
      value={{
        data,
        isLoading,
        totalTimings: totalTime,
      }}
    >
      {children}
    </DataProviderContext.Provider>
  );
};
