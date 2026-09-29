import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "cn"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({
  value,
  onChange,
  disabled
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  let date: Date | undefined = undefined;
  if (value) {
    let parsed = parse(value, "dd/MM/yyyy", new Date());
    if (!isValid(parsed)) {
      parsed = parse(value, "yyyy-MM-dd", new Date());
    }
    if (isValid(parsed)) {
      date = parsed;
    }
  }

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange(format(selectedDate, "dd/MM/yyyy"));
    } else {
      onChange("");
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "flex w-full items-center justify-start text-left font-normal bg-white border border-gray-300 h-10 px-3 rounded-lg text-sm",
          !date && "text-gray-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={disabled}
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
        {date ? format(date, "dd/MM/yyyy") : <span>Chọn ngày...</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  )
}