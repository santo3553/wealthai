import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Header } from '../layout/Header';
import { BalanceCard } from './BalanceCard';
import { AIInsightCard } from './AIInsightCard';
import { CashFlowChart } from './CashFlowChart';
import { TransactionItem } from '../transactions/TransactionItem';
import { useFinance } from '../../context/FinanceContext';
import { NavTab } from '../layout/BottomNav';

interface DashboardScreenProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const { transactions } = useFinance();
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="pb-28">
      <Header onAvatarClick={() => onNavigate('profile')} />

      <main className="space-y-2">
        <BalanceCard />
        <AIInsightCard />
        <CashFlowChart />

        {/* Recent Transactions Snippet */}
        <section className="mx-6 mt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Recent Activities</h3>
              <p className="text-[11px] text-white/40">Latest capital movements</p>
            </div>
            <button
              onClick={() => onNavigate('transactions')}
              className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              See all
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="p-6 rounded-3xl glass-panel border border-white/10 text-center">
              <p className="text-xs font-semibold text-white/70">No transactions recorded yet</p>
              <p className="text-[11px] text-white/40 mt-1">
                Tap the gold + button below to authorize your first ledger entry
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentTransactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
