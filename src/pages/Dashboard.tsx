import { useEffect, useState } from "react";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Chart } from "./Chart";
import { Switch } from "../components/ui/switch";
import { MoveRight } from "lucide-react";
import LiveFeedCard from "@/components/LiveFeedCard";

// async function fetchData() {
//   try {
//     const response = await fetch("https://komatsu-server.vercel.app/");
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     let data = await response.json();
//     console.log(data);
//     if (Array.isArray(data) && data.length >= 3) {
//       // return data.slice(0, 3);
//       return data.slice(-3).reverse();
//     } else {
//       return data.reverse();
//     }
//   } catch (error) {
//     console.error("There was a problem with the fetch operation:", error);
//     return [];
//   }
// }

export default function Dashboard() {
  const [notifications, setNotifications] = useState([
  {
    "status": "MANUAL_OFF",
    "time": "2024:08:21 20:12:50"
  },
  {
    "status": "MANUAL_ON",
    "time": "2024:08:21 20:12:58"
  },
  {
    "status": "MANUAL_OFF",
    "time": "2024:08:21 20:31:48"
  },
  {
    "status": "MANUAL_ON",
    "time": "2024:08:21 20:31:53"
  },
  {
    "status": "MANUAL_OFF",
    "time": "2024:08:21 20:34:34"
  },
  {
    "status": "MANUAL_ON",
    "time": "2024:08:21 20:34:40"
  },
  {
    "status": "MANUAL_OFF",
    "time": "2024:08:21 20:44:26"
  },
  {
    "status": "MANUAL_ON",
    "time": "2024:08:21 20:44:28"
  }
]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchData();
      setNotifications(data);
      setLoading(false);
      console.log(notifications);
    };
    loadNotifications();
  }, []);

  // if (loading) return <p>Loading...</p>; //replace this for loader

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Dashboard</PageHeaderHeading>
      </PageHeader>
      <div className="min-h-screen flex flex-col items-center justify-between pb-36">
        <div className="flex flex-col items-center justify-between w-full gap-4">
          <LiveFeedCard />
          <div className="w-full md:w-1/2">
            <Chart />
          </div>
        </div>
      </div>
    </>
  );
}
