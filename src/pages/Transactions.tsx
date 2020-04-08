import React from "react";
import {
  Grid,
  Header,
  Dimmer,
  Loader,
  Segment,
  Button,
} from "semantic-ui-react";
import Moment from "moment";

import { getTransactions, User, Transaction } from "../api";
import { YearDropdown } from "./YearDropdown";
import { MonthDropdown } from "./MonthDropdown";
import { PaginatedTransactionsTable } from "./PaginatedTransactionsTable";

type Props = {
  token: string;
  user?: User;
};

type State = {
  transactions?: Transaction[];
  filterByMonth?: string;
  filterByYear?: string;
  skip: number;
  total: number;
};

class Transactions extends React.Component<Props, State> {
  itemsPerPage = 10;

  state: State = {
    transactions: undefined,
    filterByMonth: undefined,
    filterByYear: undefined,
    skip: 0,
    total: 0,
  };

  componentDidMount() {
    const { transactions } = this.state;
    if (!transactions) {
      this.fetchTransactions();
    }
  }

  fetchTransactions = () => {
    const { token } = this.props;
    const { filterByYear, filterByMonth, skip } = this.state;

    let fromDate = "";
    let toDate = "";

    if (filterByYear && filterByMonth) {
      fromDate = Moment(
        `01-${filterByMonth}-${filterByYear}`,
        "D-M-YYYY"
      ).toISOString();
      toDate = Moment(
        `31-${filterByMonth}-${filterByYear}`,
        "D-M-YYYY"
      ).toISOString();
    } else if (filterByYear) {
      fromDate = Moment(`01-01-${filterByYear}`, "D-M-YYYY").toISOString();
      toDate = Moment(`31-12-${filterByYear}`, "D-M-YYYY").toISOString();
    }

    getTransactions(
      token,
      fromDate,
      toDate,
      this.itemsPerPage,
      skip
    ).then(({ result: transactions, query: { resultcount } }) =>
      this.setState({ transactions, total: resultcount })
    );
  };

  handleYearFilterChanged = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    value: string | undefined
  ) => {
    this.setState({ filterByYear: value, skip: 0 }, this.fetchTransactions);
  };

  handleMonthFilterChanged = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    value: string | undefined
  ) => {
    this.setState({ filterByMonth: value, skip: 0 }, this.fetchTransactions);
  };

  handleClearFilters = () => {
    this.setState(
      { filterByMonth: undefined, filterByYear: undefined },
      this.fetchTransactions
    );
  };

  render() {
    const { user } = this.props;
    const {
      transactions,
      filterByMonth,
      filterByYear,
      skip,
      total,
    } = this.state;

    if (!transactions) {
      return (
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      );
    }

    return (
      <Segment.Group>
        <Segment>
          <Header as="h1">
            {user && <>Alle Transaktionen des Accounts {user.accountNr}</>}
          </Header>
        </Segment>
        <Segment>
          <Grid>
            <Grid.Column width={8}>
              <YearDropdown
                value={filterByYear}
                onChange={this.handleYearFilterChanged}
              />
            </Grid.Column>
            <Grid.Column width={7}>
              <MonthDropdown
                onChange={this.handleMonthFilterChanged}
                value={filterByMonth}
              />
            </Grid.Column>
            <Grid.Column width={1}>
              <Button fluid icon="remove" onClick={this.handleClearFilters} />
            </Grid.Column>
          </Grid>
          {transactions.length > 0 ? (
            <PaginatedTransactionsTable
              user={user}
              transactions={transactions}
              skip={skip}
              total={total}
              onBack={() =>
                this.setState(
                  { skip: skip - this.itemsPerPage },
                  this.fetchTransactions
                )
              }
              onForward={() =>
                this.setState(
                  { skip: skip + this.itemsPerPage },
                  this.fetchTransactions
                )
              }
            />
          ) : (
            <p>In diesem Zeitraum wurden keine Transaktionen getätigt</p>
          )}
        </Segment>
      </Segment.Group>
    );
  }
}

export default Transactions;
