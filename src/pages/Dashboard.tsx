import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Chart } from "./Chart";
import LiveFeedCard from "@/components/LiveFeedCard";
import { DataProvider } from "@/contexts/ServerFeedContext";

export default function Dashboard() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Dashboard</PageHeaderHeading>
      </PageHeader>
      <DataProvider>
        <div className="min-h-screen flex flex-col items-center justify-between pb-36">
          <div className="flex flex-col items-center justify-between w-full gap-4">
            <LiveFeedCard />
            <div className="w-full md:w-1/2">
              <Chart />
            </div>
          </div>
        </div>
      </DataProvider>
    </>
  );
}
