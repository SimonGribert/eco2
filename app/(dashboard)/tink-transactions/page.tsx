import { fetchTransactions } from "@/lib/Tink";
import TinkTransactionsTable from "./TinkTransactionsTable";

const TinkTransactions = async () => {
  const transactions = await fetchTransactions(null);

  return (
    <div>
      <TinkTransactionsTable
        initTransactions={transactions.transactions}
        nextPage={transactions.nextPageToken}
      />
    </div>
  );
};

export default TinkTransactions;
