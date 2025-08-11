import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function InputAdvanced({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const [value, setValue] = useState("0");

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Label className="font-poppins text-[10px] font-bold text-[var(--text-primaryGray)]">
        {label}
      </Label>
      <Input
        min={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="number"
        className="h-[28px] w-full border-[1px] border-gray-200 bg-white"
      />
    </div>
  );
}

export default InputAdvanced;
