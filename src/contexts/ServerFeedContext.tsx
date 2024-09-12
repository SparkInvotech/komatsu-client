import { createContext, useEffect, useState } from "react";

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
      error: string | "NO_ERROR";
      totalTimings: TotalTimingType[] | undefined;
    }
  | undefined;

const initialState = {
  data: undefined,
  isLoading: true,
  error: "NO_ERROR",
  totalTimings: [
    {
      totalES: 0,
      totalMS: 0,
      totalRN: 0,
    },
  ],
};

export const DataProviderContext =
  createContext<DataProviderContextType>(initialState);

export const DataProvider = ({ children }: React.PropsWithChildren) => {
  const [data, setData] = useState<ServerDataType[] | undefined>(
    initialState.data,
  );
  const [isLoading, setIsLoading] = useState(initialState.isLoading);
  const [error, setError] = useState<string | "NO_ERROR">(initialState.error);
  const [totalTime, setTotalTime] = useState<TotalTimingType[] | undefined>(
    initialState.totalTimings,
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const req = await fetch("https://komatsu-server.vercel.app/");
        const res = await req.json();
        console.log("🚀 ~ fetchData ~ res:", res);
        setData(res);
      } catch (error) {
        console.log("🚀 ~ fetchData ~ error:", error);
        setError(String(error));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    function transformData(data: ServerDataType[]) {
      if (!data) {
        return;
      }

      const groupedData = data.reduce((acc, curr) => {
        const date = curr.time.split(" ")[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(curr);
        return acc;
      }, {});
      console.log("🚀 ~ groupedData ~ groupedData:", groupedData);

      // Calculate the total time in ES1 state for each date
      const result = Object.keys(groupedData).map((date) => {
        let totalRN = 0;
        let totalES = 0;
        let totalMS = 0;
        let prevStatus = "";
        let prevTime = "";

        groupedData[date].forEach((item) => {
          const currentStatus = item.status;
          if (prevStatus == "RN" && ["ES", "MS"].includes(currentStatus)) {
            totalRN += (new Date(item.time) - new Date(prevTime)) / 60000;
          } else if (prevStatus == "ES" && currentStatus == "RN") {
            totalES += (new Date(item.time) - new Date(prevTime)) / 60000;
          } else if (prevStatus == "MS" && currentStatus == "RN") {
            totalMS += (new Date(item.time) - new Date(prevTime)) / 60000;
          }
          prevStatus = currentStatus;
          prevTime = item.time;
        });

        return {
          date,
          totalES,
          totalMS,
          totalRN,
        };
      });

      setTotalTime(
        result.map(({ totalES, totalMS, totalRN }) => ({
          totalES,
          totalRN,
          totalMS,
        })),
      );
    }

    if (data) transformData(data);
  }, [data]);

  return (
    <DataProviderContext.Provider
      value={{
        data,
        isLoading,
        error,
        totalTimings: totalTime,
      }}
    >
      {children}
    </DataProviderContext.Provider>
  );
};
