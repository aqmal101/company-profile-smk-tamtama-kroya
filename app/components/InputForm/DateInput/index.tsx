"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { BiCalendar } from "react-icons/bi";

dayjs.locale("id");

interface DateInputProps {
  label: string;
  name: string;
  value?: string; // format: YYYY-MM-DD
  onChange: (date: Date | undefined) => void;
  isMandatory?: boolean;
  placeholder?: string;
  max?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  name,
  value,
  onChange,
  isMandatory = false,
  placeholder,
  max,
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedDate = value ? dayjs(value, "YYYY-MM-DD").toDate() : undefined;

  return (
    <div className="w-full rounded-md">
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label} {isMandatory && <span className="text-red-500">*</span>}
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="">
          <button
            // variant="link"
            id={name}
            className="w-full flex flex-row border border-gray-300 justify-start text-left px-4 py-2 rounded-sm font-normal"
          >
            <div className="w-full">
              {" "}
              {selectedDate
                ? dayjs(selectedDate)
                    .locale("id-ID")
                    .format("dddd, DD MMMM YYYY")
                : placeholder || "Pilih tanggal"}
            </div>
            <BiCalendar className="text-2xl" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Calendar
            // className="border"
            mode="single"
            selected={selectedDate}
            defaultMonth={selectedDate}
            captionLayout="dropdown"
            toDate={max ? dayjs(max).toDate() : undefined}
            onSelect={(date) => {
              if (!date) return;

              const fixedDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                12, // jam 12 siang, anti geser
              );

              onChange(fixedDate);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
