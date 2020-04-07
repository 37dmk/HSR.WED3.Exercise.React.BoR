import React from "react";
import { Dropdown } from "semantic-ui-react";

export function YearDropdown({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (
    event: React.SyntheticEvent<HTMLElement, Event>,
    value: string | undefined
  ) => void;
}) {
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 2, currentYear - 1, currentYear].map(
    (y) => ({
      value: y,
      text: y,
    })
  );
  return (
    <Dropdown
      onChange={(event, data) => onChange(event, data.value?.toString())}
      value={value}
      placeholder="Nach Jahr Filtern"
      fluid
      search
      selection
      options={yearOptions}
    />
  );
}
