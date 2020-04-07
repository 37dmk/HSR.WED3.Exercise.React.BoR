import React from "react";
import { Dropdown } from "semantic-ui-react";

export function MonthDropdown({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (
    event: React.SyntheticEvent<HTMLElement, Event>,
    value: string | undefined
  ) => void;
}) {
  const monthOptions = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ].map((m, i) => ({ value: i + 1, text: m }));
  return (
    <Dropdown
      onChange={(event, data) => onChange(event, data.value?.toString())}
      value={value}
      placeholder="Nach Monat Filtern"
      fluid
      search
      selection
      options={monthOptions}
    />
  );
}
