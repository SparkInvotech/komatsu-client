import { useState } from "react";
import Datepicker, { type DateValueType } from "react-tailwindcss-datepicker";

const START_FROM = new Date();
START_FROM.setDate(START_FROM.getTime() - 24 * 60 * 60 * 1000 * 5);

const DayPicker = () => {
  const [value, setValue] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  return (
    <Datepicker
      value={value}
      onChange={(newValue) => setValue(newValue)}
      startFrom={START_FROM}
      showShortcuts
      placeholder="Choose date or date range"
      classNames={{
        container: (p) => "w-1/2",
      }}
    />
  );
};

export default DayPicker;
