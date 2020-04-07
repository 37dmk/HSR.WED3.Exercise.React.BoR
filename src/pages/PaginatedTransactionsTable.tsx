import React from "react";
import { Button, Menu, Icon } from "semantic-ui-react";
import TransactionsTable from "../components/TransactionsTable";
import { User, Transaction } from "../api";

type Props = {
  user?: User;
  transactions: Transaction[];
  skip: number;
  total: number;
  onBack: () => void;
  onForward: () => void;
};

export function PaginatedTransactionsTable({
  user,
  transactions,
  skip,
  total,
  onBack,
  onForward,
}: Props) {
  return (
    <TransactionsTable user={user} transactions={transactions}>
      <Menu floated="right" pagination>
        <Menu.Item as={Button} disabled={skip === 0} icon onClick={onBack}>
          {/* 
          // @ts-ignore */}
          <Icon name="left chevron" />
        </Menu.Item>
        <Menu.Item disabled>
          Transaktionen {skip + 1} bis {skip + transactions.length} von {total}
        </Menu.Item>
        <Menu.Item
          as={Button}
          disabled={skip + transactions.length >= total}
          icon
          onClick={onForward}
        >
          {/* 
          // @ts-ignore */}
          <Icon name="right chevron" />
        </Menu.Item>
      </Menu>
    </TransactionsTable>
  );
}
