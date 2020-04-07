import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Header,
  Dimmer,
  Loader,
  Segment,
} from "semantic-ui-react";
import { Link } from "react-router-dom";

import TransferFundsForm from "../components/TransferFundsForm";
import TransactionsTable from "../components/TransactionsTable";

import {
  getAccountDetails,
  getAccount,
  transfer,
  getTransactions,
  AccountNr,
  User,
  Transaction,
} from "../api";

function Dashboard({ token }: { token: string }) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [transactions, setTransactions] = useState<Transaction[] | undefined>(
    undefined
  );
  const [amount, setAmount] = useState<number | undefined>(undefined);

  const isValidTargetAccount = (accountNr: AccountNr) => {
    return getAccount(accountNr, token).then(
      () => true,
      () => false
    );
  };

  const handleSubmit = (target: AccountNr, amount: number) => {
    transfer(target, amount, token).then(() => {
      // Transfer succeeded, we just re-fetch the account details
      // instead of calculating the balance ourselves
      getAccountDetails(token).then(({ amount, owner: user }) => {
        setUser(user);
        setAmount(amount);
      });
      // same for the transactions
      getTransactions(token).then(({ result: transactions }) =>
        setTransactions(transactions)
      );
    });
  };

  useEffect(() => {
    if (!user) {
      getAccountDetails(token).then(({ amount, owner: user }) => {
        setUser(user);
        setAmount(amount);
      });
    }
  }, [token, user]);

  useEffect(() => {
    if (!transactions) {
      getTransactions(token).then(({ result: transactions }) =>
        setTransactions(transactions)
      );
    }
  }, [token, transactions]);

  if (!user || !transactions || !amount) {
    return (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    );
  }
  return (
    <Segment.Group>
      <Segment>
        <Header as="h1">Kontoübersicht {user.accountNr}</Header>
      </Segment>
      <Segment>
        <Grid>
          <Grid.Column width={6}>
            <Header as="h3" content="Neue Zahlung" />
            <TransferFundsForm
              accountNr={user.accountNr}
              balance={amount}
              isValidTargetAccount={isValidTargetAccount}
              onSubmit={handleSubmit}
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Header as="h3" content="Letzte Zahlungen" />
            <TransactionsTable
              user={user}
              transactions={transactions}
            ></TransactionsTable>
            <Button floated="right" as={Link} to={"/transactions"}>
              Alle Transaktionen anzeigen
            </Button>
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment.Group>
  );
}

export default Dashboard;
