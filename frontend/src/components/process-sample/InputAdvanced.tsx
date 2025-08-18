import { Input } from "../ui/input";
import { Label } from "../ui/label";

function InputAdvanced({
  label,
  className,
  value,
  setValue,
  name,
}: {
  label: string;
  className?: string;
  value: number;
  setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const currentValue = input.value;

    if (e.key === "0" && currentValue === "0") {
      e.preventDefault();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    let value = input.value;

    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
      input.value = value || "0";
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Label className="font-poppins text-[10px] font-bold text-[var(--text-primaryGray)]">
        {label}
      </Label>
      <Input
        min={0}
        value={value}
        onChange={setValue}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        name={name}
        type="number"
        className="h-[28px] w-full border-[1px] border-gray-200 bg-white/50"
        // desabilitando momentaneamente
        disabled={true}
      />
    </div>
  );
}

export default InputAdvanced;
