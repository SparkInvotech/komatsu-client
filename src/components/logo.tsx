import { appConfig } from "@/config/app";
import { Icons } from "./icons";

export function Logo() {
  return (
    <>
      {/* <Icons.logo className="h-6 w-6" /> */}
      <img src="src\img\Spark logo final without bg.png" alt="" width={50} />
      <span className="font-bold">{appConfig.name}</span>
    </>
  );
}
