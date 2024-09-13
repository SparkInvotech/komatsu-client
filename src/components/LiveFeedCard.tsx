import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useServerData } from "@/hooks/useServerData";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { RECORDS_PER_DAY, RN_LIMIT } from "@/constants";

const statuses = {
  ES: "Emergency Stop",
  RN: "Running",
  MS: "Manual Stop",
};

function LiveFeedCard() {
  const feed = useServerData();
  const totalESTime = feed?.totalTimings?.at(-1)?.totalES!;
  const totalRNTime = feed?.totalTimings?.at(-1)?.totalRN!;
  const totalMSTime = feed?.totalTimings?.at(-1)?.totalMS!;
  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <div className="flex justify-between items-top space-x-4">
          <CardTitle className="w-full">
            <div className="grid grid-rows-3 grid-cols-none md:grid-cols-3 md:grid-rows-none gap-3 w-full items-center">
              <div className="rounded-md flex items-center justify-center flex-col border-gray-300 w-full border md:p-3.5 p-4 px-8">
                <p className="text-base flex gap-2 justify-between font-small leading-none">
                  Working time{" "}
                  <span className="text-sm">
                    (
                    {(
                      (parseFloat(totalRNTime.toFixed(2)) / RN_LIMIT) *
                      100
                    ).toFixed(2)}
                    %)
                  </span>
                </p>
                <p className="text-xl text-muted-foreground">
                  {totalRNTime / 60 < 1
                    ? 0
                    : parseInt((totalRNTime / 60).toFixed(2))}{" "}
                  hr{" "}
                  <span className="text-sm">
                    {parseInt((totalRNTime % 60).toFixed(2))}mins
                  </span>
                </p>
              </div>
              <div className="rounded-md flex items-center justify-center flex-col border-gray-300 w-full border p-4 px-8">
                <p className="text-base ont-small leading-none">Manual stop</p>
                <p className="text-lg text-muted-foreground">
                  {totalMSTime / 60 < 1
                    ? 0
                    : parseInt((totalMSTime / 60).toFixed(2))}{" "}
                  hr{" "}
                  <span className="text-sm">
                    {parseInt((totalMSTime % 60).toFixed(2))} mins
                  </span>
                </p>
              </div>
              <div className="rounded-md flex items-center justify-center flex-col border-gray-300 w-full border p-4 px-8">
                <p className="text-base ont-small leading-none">
                  Emergency stop
                </p>
                <p className="text-lg text-muted-foreground">
                  {totalESTime / 60 < 1
                    ? 0
                    : parseInt((totalESTime / 60).toFixed(2))}{" "}
                  hr{" "}
                  <span className="text-sm">
                    {parseInt((totalESTime % 60).toFixed(2))} mins
                  </span>
                </p>
              </div>
            </div>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 h-80 overflow-y-auto py-6">
        <ScrollArea>
          {feed?.data ? (
            feed?.data
              .toReversed()
              .slice(0, RECORDS_PER_DAY)
              .map((log, index) => (
                <div
                  key={index}
                  className="mb-2 grid grid-cols-[25px_1fr] items-start pb-1 last:mb-0 last:pb-0"
                >
                  <span
                    className={`flex h-2 w-2 translate-y-1 rounded-full ${log.status === "ES" || log.status === "MS" ? "bg-red-500" : "bg-sky-500"}`}
                  />
                  <div className="space-y-1">
                    <div className="flex justify-between items-center space-x-4">
                      <p className="text-sm font-medium leading-none">
                        {statuses[log.status as keyof typeof statuses]} -{" "}
                        {log.status}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.time}</p>
                  </div>
                </div>
              ))
          ) : feed?.isLoading && feed.error === "NO_ERROR" ? (
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
          ) : feed?.error !== "NO_ERROR" ? (
            <p>No data available.</p>
          ) : (
            <p className="text-red-400 text-sm">Something went wrong!</p>
          )}
          <ScrollBar />
        </ScrollArea>
        {/* <Button>View Details</Button> */}
      </CardContent>
    </Card>
  );
}

export default LiveFeedCard;
