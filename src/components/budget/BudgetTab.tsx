import React, { useState } from 'react';
import { Plus, AlertTriangle, ShieldCheck, TrendingDown, Wand2, ArrowUpRight, DollarSign, X } from 'lucide-react';
import { BudgetCategory, ExpenseItem, FullEventPlan } from '../../types';
import { formatCurrency } from '../../services/calculationService';

interface BudgetTabProps {
  categories: BudgetCategory[];
  expenses: ExpenseItem[];
  totalBudget: number;
  onUpdateCategories: (categories: BudgetCategory[]) => void;
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onTriggerAIBudgetHacker: () => void;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({
  categories,
  expenses,
  totalBudget,
  onUpdateCategories,
  onAddExpense,
  onTriggerAIBudgetHacker
}) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expensePaidTo, setExpensePaidTo] = useState('');

  // Calculations
  const totalSpent = categories.reduce((sum, c) => sum + (c.spentAmount || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const isOverTotalBudget = remainingBudget < 0;

  const bufferCategory = categories.find(c =>
    c.name.toLowerCase().includes('buffer') || c.name.toLowerCase().includes('contingency')
  );
  const bufferRemaining = bufferCategory ? bufferCategory.allocatedAmount - bufferCategory.spentAmount : 0;

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(expenseAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    onAddExpense({
      categoryId: selectedCategoryId,
      name: expenseName || 'Logged Expense',
      amount: amountNum,
      date: expenseDate,
      paidTo: expensePaidTo || 'Vendor'
    });

    // Reset and close
    setExpenseName('');
    setExpenseAmount('');
    setExpensePaidTo('');
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Top Banner: Global Budget Summary & AI Hacker Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            Budget & Real Spend Tracking
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time variance tracking with dynamic over-budget alerts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onTriggerAIBudgetHacker}
            className="px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-1.5 transition shadow-sm"
          >
            <Wand2 className="w-4 h-4 text-rose-500" />
            <span>AI Budget Hacker</span>
          </button>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white rounded-xl flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Log Actual Spend</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Budget */}
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Total Target Budget</span>
          <div className="font-mono text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
            {formatCurrency(totalBudget)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            100% split across {categories.length} categories
          </span>
        </div>

        {/* Total Actual Spend */}
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Logged Actual Spend</span>
          <div className="font-mono text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
            {formatCurrency(totalSpent)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1">
            <span>{Math.round((totalSpent / (totalBudget || 1)) * 100)}% of total committed</span>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className={`p-5 rounded-3xl border shadow-sm ${
          isOverTotalBudget
            ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
        }`}>
          <span className={`text-xs uppercase tracking-wider font-semibold ${
            isOverTotalBudget ? 'text-rose-700 dark:text-rose-400' : 'text-stone-500'
          }`}>
            {isOverTotalBudget ? 'Budget Overrun' : 'Remaining Unspent'}
          </span>
          <div className={`font-mono text-2xl font-black mt-1 ${
            isOverTotalBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {formatCurrency(Math.abs(remainingBudget))}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {isOverTotalBudget ? 'Attention: Deficit alert!' : 'Safe buffer margin intact'}
          </span>
        </div>

        {/* Emergency Contingency Buffer */}
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Contingency Buffer</span>
          <div className="font-mono text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
            {formatCurrency(bufferRemaining)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Emergency reserve intact</span>
          </div>
        </div>

      </div>

      {/* Category Breakdown Progress Cards */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            Category Breakdown & Spending Caps
          </h3>
          <span className="text-xs text-stone-400">
            Red progress bars indicate category spending exceeding target cap
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const isOverBudget = cat.spentAmount > cat.allocatedAmount && cat.allocatedAmount > 0;
            const percentUsed = cat.allocatedAmount > 0 ? Math.round((cat.spentAmount / cat.allocatedAmount) * 100) : 0;
            const remaining = cat.allocatedAmount - cat.spentAmount;

            return (
              <div
                key={cat.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isOverBudget
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60 shadow-sm'
                    : 'bg-stone-50/60 dark:bg-stone-850 border-stone-200/70 dark:border-stone-800'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: isOverBudget ? '#e11d48' : cat.color || '#e14d6c' }}
                    />
                    <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                      {cat.percentage}%
                    </span>
                  </div>

                  {isOverBudget ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      <span>Over by {formatCurrency(Math.abs(remaining))}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-stone-500 font-mono">
                      {percentUsed}% spent
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOverBudget
                        ? 'bg-rose-600 dark:bg-rose-500'
                        : percentUsed >= 85
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, percentUsed)}%` }}
                  />
                </div>

                {/* Details Footer */}
                <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-stone-200/40 dark:border-stone-700/40">
                  <span className="text-stone-500">
                    Target: <strong className="font-mono text-stone-800 dark:text-stone-200">{formatCurrency(cat.allocatedAmount)}</strong>
                  </span>
                  <span className="text-stone-500">
                    Logged: <strong className={`font-mono ${isOverBudget ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-stone-800 dark:text-stone-200'}`}>{formatCurrency(cat.spentAmount)}</strong>
                  </span>
                  <span className={`font-medium ${remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {remaining >= 0 ? `${formatCurrency(remaining)} left` : `-${formatCurrency(Math.abs(remaining))}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="expense-modal-title">
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
              <h3 id="expense-modal-title" className="text-base font-semibold text-stone-900 dark:text-stone-100">
                Log New Expense
              </h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Category</label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Cap: {formatCurrency(c.allocatedAmount)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Expense Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Venue booking deposit, DJ retainer"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Amount ($)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="2500"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Date Paid</label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Paid To / Vendor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Magnolia Ballroom, Lumière Photography"
                  value={expensePaidTo}
                  onChange={(e) => setExpensePaidTo(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition"
                >
                  Record Spend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
