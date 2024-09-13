import { createContext, useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DateValueType } from "react-tailwindcss-datepicker";

export type ServerDataType = {
  status: string;
  time: string;
  machine: number;
};

type TotalTimingType = {
  totalES: number;
  totalRN: number;
  totalMS: number;
  date: string;
};

export type DataProviderContextType =
  | {
      data: ServerDataType[] | undefined;
      isLoading: boolean;
      error: string | "NO_ERROR";
      totalTimings: TotalTimingType[] | undefined;
      date: DateValueType;
      setDate: React.Dispatch<React.SetStateAction<DateValueType>>;
    }
  | undefined;

const initialState: DataProviderContextType = {
  data: undefined,
  isLoading: true,
  error: "NO_ERROR",
  totalTimings: [
    {
      totalES: 0,
      totalMS: 0,
      totalRN: 0,
      date: "",
    },
  ],
  date: {
    startDate: null,
    endDate: null,
  },
  setDate: () => null,
};

export const DataProviderContext =
  createContext<DataProviderContextType>(initialState);

export const DataProvider = ({ children }: React.PropsWithChildren) => {
  const [data, setData] = useState<ServerDataType[] | undefined>();
  const [isLoading, setIsLoading] = useState(initialState.isLoading);
  const [error, setError] = useState<string | "NO_ERROR">(initialState.error);
  const [totalTime, setTotalTime] = useState<TotalTimingType[] | undefined>(
    initialState.totalTimings,
  );
  const [date, setDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  // console.log("🚀 ~ DataProvider ~ totalTime:", data, totalTime);

  /** Effect for data loading from firestore but realtime */
  useEffect(() => {
    const unSub = onSnapshot(
      collection(db, "komatsu_logs"),
      (piece) => {
        setData(
          piece.docs.map((d) => ({
            time: d.id,
            ...d.data(),
          })) as ServerDataType[],
        );
      },
      (error) => {
        setError(error.message);
      },
      () => {
        if (isLoading) setIsLoading(false);
      },
    );

    return () => unSub();
  }, []);

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
        result.map(({ totalES, totalMS, totalRN, date }) => ({
          totalES,
          totalRN,
          totalMS,
          date,
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
        date,
        setDate,
      }}
    >
      {children}
    </DataProviderContext.Provider>
  );
};
