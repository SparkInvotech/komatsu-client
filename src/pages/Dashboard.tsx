import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chart } from "./Chart";
import { Switch } from "../components/ui/switch";

const notifications = [
  {
    machine: 1,
    status: "CONVEYER_ON",
    time: "2024:08:16 07:39:55",
  },
  {
    machine: 1,
    status: "CONVEYER_ON",
    time: "2024:08:16 07:43:02",
  },
  {
    machine: 1,
    status: "CONVEYER_ON",
    time: "2024:08:16 08:18:27",
  },
];

export default function Dashboard() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Dashboard</PageHeaderHeading>
      </PageHeader>
      <div className="min-h-screen flex flex-col items-center justify-between pb-36">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
          <Card className="w-full md:w-1/2">
            <CardHeader>
              <CardTitle>Turn On / Off the Machine</CardTitle>
              <CardDescription>Description about the model</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Current Status
                  </p>
                </div>
                <Switch />
              </div>
              <div>
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.status}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button>View Details</Button>
            </CardContent>
          </Card>
          <div className="w-full md:w-1/2">
            <Chart />
          </div>
        </div>
      </div>
    </>
  );
}
