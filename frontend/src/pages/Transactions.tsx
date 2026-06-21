import { AppSideNav } from "../components/AppSideNav";

function Transactions() {
  return (
    <div className="flex h-full">
      <AppSideNav />
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted mt-2">
          Payment history and M-Pesa payout records will go here.
        </p>
      </div>
    </div>
  );
}

export default Transactions;