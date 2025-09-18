import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dropdown() {
  const id = useId();
  return (
    <Select defaultValue="2">
      <SelectTrigger id={id} className="**:data-desc:hidden">
        <SelectValue placeholder="Choose a plan" />
      </SelectTrigger>
      <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
        <SelectItem value="1">
          Home
          <span className="text-muted-foreground mt-1 block text-xs" data-desc>
            Ask AI to design your career path
          </span>
        </SelectItem>
        <SelectItem value="2">
          Board View
          <span className="text-muted-foreground mt-1 block text-xs" data-desc>
            View your career path using flowcharts
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
