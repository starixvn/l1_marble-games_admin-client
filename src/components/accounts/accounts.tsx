import { AccountTable } from "@/components/accounts/account-table";
import { CreateAccountSection } from "@/components/accounts/create-account-section";

export function Accounts() {
  return (
    <div className="flex flex-col">
      <CreateAccountSection />
      <AccountTable />
    </div>
  )
}
