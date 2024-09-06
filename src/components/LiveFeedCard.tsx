import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";

type NotificationType = { status: string; time: string; machine: number };

const statuses = {
  ES: "Emergency Stop",
  RN: "Running",
  MS: "Manual Stop",
};

type TotalTimingType = {
  totalES: number;
  totalRN: number;
  totalMS: number;
};

const DUMMY_DATA = [
  {
    machine: 1,
    status: "RN",
    time: "2024-09-02 08:22:03",
  },
  {
    machine: 1,
    status: "ES",
    time: "2024-09-02 10:31:57",
  },
  {
    machine: 1,
    status: "RN",
    time: "2024-09-02 12:55:50",
  },
  {
    machine: 1,
    status: "MS",
    time: "2024-09-02 14:21:12",
  },
  {
    machine: 1,
    status: "RN",
    time: "2024-09-02 18:14:09",
  },
  {
    machine: 1,
    status: "MS",
    time: "2024-09-02 20:20:59",
  },
  {
    machine: 1,
    status: "RN",
    time: "2024-09-04 08:32:03",
  },
  {
    machine: 1,
    status: "ES",
    time: "2024-09-04 11:31:57",
  },
  {
    machine: 1,
    status: "RN",
    time: "2024-09-04 11:55:50",
  },
  {
    machine: 1,
    status: "MS",
    time: "2024-09-04 15:31:12",
  },
  {
    machine: 1,
    status: "RN",
    time: "2024-09-04 16:44:09",
  },
  {
    machine: 1,
    status: "MS",
    time: "2024-09-04 22:30:59",
  },
];

function LiveFeedCard() {
  const [notifications, setNotifications] = useState<
    NotificationType[] | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const [totalTiming, setTotalTiming] = useState<TotalTimingType[] | undefined>(
    [
      {
        totalES: 0,
        totalRN: 0,
        totalMS: 0,
      },
    ],
  );

  function calc(data: NotificationType[]) {
    if (!data) {
      return;
    }
    // data.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Group the data by date
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

    console.log(result);
    setTotalTiming(
      result.map(({ totalES, totalMS, totalRN }) => ({
        totalES,
        totalRN,
        totalMS,
      })),
    );
  }

  // useEffect(() => {
  //   const unssub = onValue(ref(db, "komatsu_logs"), (snapshot) => {
  //     const data = snapshot.toJSON();
  //     setIsLoading(false);
  //     setNotifications(
  //       // @ts-ignore
  //       Object.keys(data)
  //         .map((key) => ({
  //           time: key,
  //           // @ts-ignore
  //           status: data[key].status,
  //         }))
  //         .reverse() as NotificationType[],
  //     );
  //     calc();
  //   });

  //   return () => unssub();
  // }, []);

  /** Soon replace with snapshot listener from firebase */
  useEffect(() => {
    async function fetchData() {
      try {
        const req = await fetch("https://komatsu-server.vercel.app/");
        const res = await req.json();
        // const res = DUMMY_DATA;
        console.log("🚀 ~ fetchData ~ res:", res);
        // await new Promise((res) => setTimeout(() => res(1000), 1000));
        setNotifications(res);
        calc(res);
      } catch (error) {
        console.log("🚀 ~ fetchData ~ error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // calc(DUMMY_DATA);
    fetchData();
  }, []);

  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <div className="flex justify-between items-top space-x-4">
          <CardTitle className="w-full">
            <div className="flex md:flex-row flex-col justify-evenly gap-3 mb-6 w-full items-center">
              <div className="rounded-md border-gray-300 w-full border p-4 px-4">
                <p className="text-lg font-small leading-none">Working time</p>
                <p className="text-xl text-muted-foreground">
                  {totalTiming?.at(-1)?.totalRN.toFixed(2)}/480 mins
                </p>
              </div>
              <div className="rounded-md border-gray-300 w-full border p-4 px-8">
                <p className="text-lg font-small leading-none">Manual stop</p>
                <p className="text-2lg text-muted-foreground">
                  {totalTiming?.at(-1)?.totalMS.toFixed(2)} mins
                </p>
              </div>
              <div className="rounded-md border-gray-300 w-full border p-4 px-8">
                <p className="text-lg font-small leading-none">
                  Emergency stop
                </p>
                <p className="text-2lg text-muted-foreground">
                  {totalTiming?.at(-1)?.totalES.toFixed(2)} mins
                </p>
              </div>
            </div>
          </CardTitle>
        </div>
        {/* <CardTitle>Turn On / Off the Machine</CardTitle>
              <CardDescription>Description about the model</CardDescription> */}
      </CardHeader>
      {/* <CardHeader>
        <button onClick={calc}>Hi</button>
      </CardHeader> */}
      <CardContent className="grid gap-4 h-80 overflow-y-auto py-6">
        {notifications ? (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span
                className={`flex h-2 w-2 translate-y-1 rounded-full bg-sky-500 ${notification.status == "ES" ? "bg-red-500" : ""}`}
              />
              <div className="space-y-1">
                <div className="flex justify-between items-center space-x-4">
                  <p className="text-sm font-medium leading-none">
                    {statuses[notification.status as keyof typeof statuses]} -{" "}
                    {notification.status}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.time}
                </p>
              </div>
            </div>
          ))
        ) : isLoading ? (
          <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
            <svg
              className="text-gray-300 animate-spin"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path
                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                stroke="currentColor"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                stroke="currentColor"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="text-gray-900"
              ></path>
            </svg>
          </div>
        ) : (
          <p>No notifications available.</p>
        )}
        {/* <Button>View Details</Button> */}
      </CardContent>
    </Card>
  );
}

export default LiveFeedCard;
