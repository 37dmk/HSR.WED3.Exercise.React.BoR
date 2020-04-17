import React from "react";
import {Dropdown} from "semantic-ui-react";

export function MonthDropdown({value, onChange}){
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
    "Dezember"
  ].map((m, i) => ({ value: i + 1, text: m }));
  return (
    <Dropdown
      onChange={onChange}
      value={value}
      placeholder="Filter nach Monat"
      fluid
      search
      selection
      options={monthOptions}
    />
  );
}
