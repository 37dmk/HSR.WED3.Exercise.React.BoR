import React, { useState, useEffect, ChangeEvent, SyntheticEvent } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import { AccountNr } from "../api";

type Props = {
  accountNr: AccountNr;
  balance: number;
  onSubmit: (to: AccountNr, amount: number) => void;
  isValidTargetAccount: (to: AccountNr) => Promise<boolean>;
};

function TransferFundsForm({
  accountNr,
  balance,
  onSubmit,
  isValidTargetAccount,
}: Props) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    onSubmit(to, amount);
  };

  const handleAccountChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const to = event.target.value;
    setTo(to);
    isValidTargetAccount(to).then(setValid);
  };

  /* This replacted the componentDidUpdate implementation to reset the form when the balance changes. It also runs on mount, which is wasteful but not incorrect. */

  useEffect(() => {
    setError(undefined);
    setAmount(0);
    setTo("");
    setLoading(false);
  }, [balance]);

  const isComplete = to && amount && amount > 0;

  return (
    <Form onSubmit={handleSubmit} error={!!error}>
      <Form.Select
        label="Von"
        options={[{ text: `${accountNr} (CHF ${balance})`, value: 0 }]}
        value={0}
      />
      <Form.Input
        error={!valid}
        label="Nach"
        placeholder="Zielkontonummer"
        value={to}
        onChange={handleAccountChanged}
      />
      <Form.Input
        label="Betrag"
        placeholder="Betrag"
        type="number"
        value={amount}
        onChange={(event) => setAmount(parseInt(event.target.value, 10))}
      />
      <Message error header="Überweisung fehlgeschlagen" content={error} />
      <Button
        loading={loading}
        primary
        fluid
        disabled={!isComplete}
        type="submit"
      >
        Betrag Überweisen
      </Button>
    </Form>
  );
}

export default TransferFundsForm;
