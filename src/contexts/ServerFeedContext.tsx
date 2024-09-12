import { createContext, useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  const [data, setData] = useState<ServerDataType[] | undefined>([
    {
      time: "2024-09-06 11:46:20",
      machine: 1,
      status: "RN",
    },
    {
      time: "2024-09-06 11:49:38",
      machine: 1,
      status: "ES",
    },
    {
      time: "2024-09-06 11:53:25",
      status: "RN",
      machine: 1,
    },
    {
      time: "2024-09-06 11:56:36",
      machine: 1,
      status: "MS",
    },
    {
      time: "2024-09-06 14:28:39",
      machine: 1,
      status: "RN",
    },
    {
      time: "2024-09-06 14:31:28",
      status: "RN",
      machine: 1,
    },
    {
      time: "2024-09-06 14:34:50",
      machine: 1,
      status: "ES",
    },
    {
      time: "2024-09-10 23:47:14",
      status: "ES",
      machine: 1,
    },
    {
      time: "2024-09-10 23:47:32",
      machine: 1,
      status: "ES",
    },
    {
      time: "2024-09-10 23:49:50",
      machine: 1,
      status: "ES",
    },
    {
      time: "2024-09-10 23:50:04",
      machine: 1,
      status: "ES",
    },
    {
      time: "2024-09-11 00:21:12",
      machine: 1,
      status: "MS",
    },
    {
      time: "2024-09-11 09:31:56",
      status: "ES",
      machine: 1,
    },
    {
      time: "2024-09-11 09:34:12",
      machine: 1,
      status: "ES",
    },
    {
      time: "2024-09-11 09:36:15",
      machine: 1,
      status: "RN",
    },
    {
      time: "2024-09-11 09:36:28",
      machine: 1,
      status: "RN",
    },
    {
      time: "2024-09-11 09:38:02",
      status: "ES",
      machine: 1,
    },
    {
      time: "2024-09-11 10:15:06",
      machine: 1,
      status: "RN",
    },
    {
      time: "2024-09-11 10:15:11",
      machine: 1,
      status: "RN",
    },
    {
      time: "2024-09-11 10:16:17",
      status: "ES",
      machine: 1,
    },
    {
      time: "2024-09-12 12:02:10",
      machine: 1,
      status: "RN",
    },
    {
      time: "2024-09-12 12:02:46",
      machine: 1,
      status: "RN",
    },
    {
      time: "2024-09-12 12:03:36",
      status: "MS",
      machine: 1,
    },
    {
      time: "2024-09-12 12:04:36",
      machine: 1,
      status: "RN",
    },
    {
      time: "2024-09-12 12:07:12",
      status: "ES",
      machine: 1,
    },
    {
      time: "2024-09-12 12:07:21",
      status: "RN",
      machine: 1,
    },
    {
      time: "2024-09-12 14:39:28",
      status: "ES",
      machine: 1,
    },
    {
      time: "2024-09-12 14:49:00",
      status: "RN",
      machine: 1,
    },
    {
      time: "2024-09-12 14:52:05",
      machine: 1,
      status: "MS",
    },
    {
      time: "2024-09-12 15:34:22",
      machine: 1,
      status: "RN",
    },
    {
      time: "2024-09-12 15:46:25",
      status: "ES",
      machine: 1,
    },
    {
      time: "2024-09-12 15:47:38",
      machine: 1,
      status: "RN",
    },
    {
      time: "2024-09-12 15:47:46",
      status: "MS",
      machine: 1,
    },
    {
      time: "2024-09-12 15:49:17",
      machine: 1,
      status: "RN",
    },
  ]);
  const [isLoading, setIsLoading] = useState(initialState.isLoading);
  const [error, setError] = useState<string | "NO_ERROR">(initialState.error);
  const [totalTime, setTotalTime] = useState<TotalTimingType[] | undefined>(
    initialState.totalTimings,
  );
  console.log("🚀 ~ DataProvider ~ totalTime:", data, totalTime);

  /** Effect for data loading from firestore but realtime */
  // useEffect(() => {
  //   const unSub = onSnapshot(
  //     collection(db, "komatsu_logs"),
  //     (piece) => {
  //       setData(
  //         piece.docs.map((d) => ({
  //           time: d.id,
  //           ...d.data(),
  //         })) as ServerDataType[],
  //       );
  //     },
  //     (error) => {
  //       setError(error.message);
  //     },
  //     () => {
  //       if (isLoading) setIsLoading(false);
  //     },
  //   );

  //   return () => unSub();
  // }, []);

  /** Effect to transform data and calculate timings and stats */
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
