import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";

function LiveFeedCard() {
  const [notifications, setNotifications] = useState([
    {
      status: "MANUAL_OFF",
      time: "2024:08:21 20:12:50",
    },
    {
      status: "MANUAL_ON",
      time: "2024:08:21 20:12:58",
    },
    {
      status: "MANUAL_OFF",
      time: "2024:08:21 20:31:48",
    },
    {
      status: "MANUAL_ON",
      time: "2024:08:21 20:31:53",
    },
    {
      status: "MANUAL_OFF",
      time: "2024:08:21 20:34:34",
    },
    {
      status: "MANUAL_ON",
      time: "2024:08:21 20:34:40",
    },
    {
      status: "MANUAL_OFF",
      time: "2024:08:21 20:44:26",
    },
    {
      status: "MANUAL_ON",
      time: "2024:08:21 20:44:28",
    },
  ]);

  return (
    <Card className="w-full md:w-1/2">
      {/* <CardHeader>
              <div className="flex justify-between items-top space-x-4">
              <CardTitle>
                <div className="space-y-3"> 
                  <div>
                    <p className="text-lg font-small leading-none">Working time</p>
                    <p className="text-2lg text-muted-foreground">360/480</p>
                  </div>
                  <div>
                    <p className="text-lg font-small leading-none">Manual stop</p>
                    <p className="text-2lg text-muted-foreground">120</p>
                  </div>
                </div>
              </CardTitle>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Switch />
                </div>
              </div>
              <CardTitle>Turn On / Off the Machine</CardTitle>
              <CardDescription>Description about the model</CardDescription>
            </CardHeader> */}
      <CardContent className="grid gap-4 max-h-80 overflow-y-auto py-6">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <div className="flex justify-between items-center space-x-4">
                  <p className="text-sm font-medium leading-none">
                    {notification.status}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {index === 0 ? "Manual_Stop" : ""}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.time}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No notifications available.</p>
        )}
        {/* <Button>View Details</Button> */}
      </CardContent>
    </Card>
  );
}

export default LiveFeedCard;
