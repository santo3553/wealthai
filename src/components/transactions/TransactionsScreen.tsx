import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { TransactionItem } from './TransactionItem';
import { getDateGroup } from '../../utils/date';
import { Transaction } from '../../types/finance';

export const TransactionsScreen: React.FC = () => {
  const { transactions } = useFinance();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Search Engine: Filter history by matching title or category string
  const filteredTransactions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return transactions.filter((tx) => {
      const matchesSearch =
        !q ||
        tx.title.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q);
      const matchesType = filterType === 'all' || tx.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchQuery, filterType]);

  // Grouping Logic: Render history grouped by Date ("Today", "Yesterday", "MMM dd, yyyy")
  const groupedTransactions = useMemo(() => {
    const groups: { dateGroup: string; items: Transaction[]; rawDate: string }[] = [];
    const map = new Map<string, Transaction[]>();

    filteredTransactions.forEach((tx) => {
      const groupLabel = getDateGroup(tx.date);
      if (!map.has(groupLabel)) {
        map.set(groupLabel, []);
      }
      map.get(groupLabel)!.push(tx);
    });

    map.forEach((items, dateGroup) => {
      groups.push({
        dateGroup,
        items,
        rawDate: items[0]?.date || '',
      });
    });

    return groups;
  }, [filteredTransactions]);

  return (
    <div className="pb-28 pt-6 px-6 max-w-md mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#ffffff] tracking-tight">
            Transaction Vault
          </h2>
          <p className="text-xs text-white/40">Real-time ledger of all capital flows</p>
        </div>
        <div className="w-9 h-9 rounded-xl glass-panel border border-white/10 flex items-center justify-center text-amber-400">
          <SlidersHorizontal className="w-4 h-4" />
        </div>
      </div>

      {/* Search Engine Bar */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or category..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl glass-panel border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Type Filter Pills */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'income', 'expense'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              filterType === type
                ? 'bg-amber-400 text-[#120d0b] shadow-md shadow-amber-400/20'
                : 'glass-panel text-white/60 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grouped Transaction List */}
      {groupedTransactions.length === 0 ? (
        <div className="text-center py-16 px-4 glass-panel rounded-3xl border border-white/10">
          <p className="text-sm font-semibold text-white/70">No transactions located</p>
          <p className="text-xs text-white/40 mt-1">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedTransactions.map((group) => (
            <div key={group.dateGroup} className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300/80">
                  {group.dateGroup}
                </span>
                <span className="text-[11px] text-white/30">
                  {group.items.length} {group.items.length === 1 ? 'record' : 'records'}
                </span>
              </div>

              <div className="space-y-2">
                {group.items.map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} showDelete={true} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
