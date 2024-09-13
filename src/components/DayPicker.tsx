import { useServerData } from "@/hooks/useServerData";
import { useState } from "react";
import Datepicker, { type DateValueType } from "react-tailwindcss-datepicker";

const START_FROM = new Date();
START_FROM.setDate(START_FROM.getTime() - 24 * 60 * 60 * 1000 * 5);

const MIN_DATE = new Date();
MIN_DATE.setDate(MIN_DATE.getDate() - 10);

const MAX_DATE = new Date();
MAX_DATE.setDate(MAX_DATE.getDate() + 10);

const DayPicker = () => {
  const actions = useServerData();

  return (
    <Datepicker
      value={actions?.date as DateValueType}
      onChange={(newValue) => actions?.setDate(newValue)}
      minDate={MIN_DATE}
      maxDate={MAX_DATE}
      asSingle
      placeholder="Choose date or date range"
      classNames={{
        container: (p) => "w-1/2",
      }}
    />
  );
};

export default DayPicker;
