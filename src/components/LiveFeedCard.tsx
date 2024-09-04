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
  ES0: "Emergency Stop OFF",
  ES1: "Emergency Stop ON",
  RN0: "Stopped",
  RN1: "Running",
  MS0: "Manual Stop OFF",
  MS1: "Manual Stop ON",
};

type TotalTimingType = {
  totalES: number;
  totalRN: number;
  totalMS: number;
};

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

  function calc(data) {
    if (!data) {
      return;
    }
    data.sort((a, b) => new Date(a.time) - new Date(b.time));

    // Group the data by date
    const groupedData = data.reduce((acc, curr) => {
      const date = curr.time.split(" ")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(curr);
      return acc;
    }, {});

    // Calculate the total time in ES1 state for each date
    const result = Object.keys(groupedData).map((date) => {
      let totalTimeES1 = 0;
      let totalTimeMS1 = 0;
      let totalTimeWorking = 0;
      let prevStatus = null;
      let prevTime = null;

      groupedData[date].forEach((item) => {
        const currentStatus = item.status.match(/MANUAL: (\w+)/)[1];
        if (prevStatus === "ES1" && currentStatus !== "ES1") {
          totalTimeES1 += (new Date(item.time) - new Date(prevTime)) / 60000;
        } else if (prevStatus === "MS1" && currentStatus !== "MS1") {
          totalTimeMS1 += (new Date(item.time) - new Date(prevTime)) / 60000;
        } else if (
          prevStatus !== "ES1" &&
          prevStatus !== "MS1" &&
          currentStatus === "ES1"
        ) {
          totalTimeWorking +=
            (new Date(item.time) - new Date(prevTime)) / 60000;
        } else if (
          prevStatus !== "ES1" &&
          prevStatus !== "MS1" &&
          currentStatus === "MS1"
        ) {
          totalTimeWorking +=
            (new Date(item.time) - new Date(prevTime)) / 60000;
        }
        prevStatus = currentStatus;
        prevTime = item.time;
      });

      // Calculate the total time working for the last status of the day
      const lastStatus =
        groupedData[date][groupedData[date].length - 1].status.match(
          /MANUAL: (\w+)/,
        )[1];
      if (lastStatus !== "ES1" && lastStatus !== "MS1") {
        const lastTime = groupedData[date][groupedData[date].length - 1].time;
        const endOfDay = new Date(date + " 23:59:59");
        totalTimeWorking += (endOfDay - new Date(lastTime)) / 60000;
      }

      return {
        date,
        totalTimeES1,
        totalTimeMS1,
        totalTimeWorking,
      };
    });

    console.log(result);
    setTotalTiming(
      result.map((res) => ({
        totalES: res.totalTimeES1,
        totalRN: res.totalTimeWorking,
        totalMS: res.totalTimeMS1,
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

  useEffect(() => {
    async function fetchData() {
      try {
        const req = await fetch("https://komatsu-server.vercel.app/");
        const res = await req.json();
        console.log("🚀 ~ fetchData ~ res:", res);
        setNotifications(res);
        calc(res);
      } catch (error) {
        console.log("🚀 ~ fetchData ~ error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <div className="flex justify-between items-top space-x-4">
          <CardTitle>
            <div className="space-y-3">
              <div>
                <p className="text-lg font-small leading-none">Working time</p>
                <p className="text-2lg text-muted-foreground">
                  {(totalTiming?.at(-1)?.totalRN / 600000).toFixed(2)}/480
                </p>
              </div>
              <div>
                <p className="text-lg font-small leading-none">Manual stop</p>
                <p className="text-2lg text-muted-foreground">
                  {totalTiming?.at(-1)?.totalMS.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-lg font-small leading-none">
                  Emergency stop
                </p>
                <p className="text-2lg text-muted-foreground">
                  {totalTiming?.at(-1)?.totalES.toFixed(2)}
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
                className={`flex h-2 w-2 translate-y-1 rounded-full bg-sky-500 ${notification.status.split(",")[0].split(":")[1].trim() === "ES1" ? "bg-red-500" : ""}`}
              />
              <div className="space-y-1">
                <div className="flex justify-between items-center space-x-4">
                  <p className="text-sm font-medium leading-none">
                    {
                      statuses[
                        notification.status
                          .split(",")[0]
                          .split(":")[1]
                          .trim() as keyof typeof statuses
                      ]
                    }
                    - {notification.status.split(",")[0].split(":")[1].trim()}
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
