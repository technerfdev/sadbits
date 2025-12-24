import type { JSX } from "react";
import { Popover, PopoverTrigger } from "../ui/popover";

/** TODO:
 * [] Allow passing options to the combobox
 * [] Handle selection of options with multiple and single select
 * [] Style the combobox
 */
export default function Combobox({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}): JSX.Element {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger></PopoverTrigger>
    </Popover>
  );
}
