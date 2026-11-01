import React, { useState } from 'react';
import { Plus, Star, Phone, Mail, X, Sparkles, Scale } from 'lucide-react';
import { Vendor, VendorStatus } from '../../types';
import { formatCurrency } from '../../services/calculationService';

interface VendorsTabProps {
  vendors: Vendor[];
  onUpdateVendor: (vendor: Vendor) => void;
  onAddVendor: (vendor: Omit<Vendor, 'id'>) => void;
}

export const VendorsTab: React.FC<VendorsTabProps> = ({
  vendors,
  onUpdateVendor,
  onAddVendor
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [comparingVendor, setComparingVendor] = useState<Vendor | null>(null);

  // Form state
  const [category, setCategory] = useState('Venue');
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<VendorStatus>('researching');
  const [quotedAmount, setQuotedAmount] = useState('');
  const [depositPaid, setDepositPaid] = useState('');
  const [notes, setNotes] = useState('');

  const hiredCount = vendors.filter(v => v.status === 'hired').length;
  const totalQuoted = vendors.reduce((sum, v) => sum + (v.quotedAmount || 0), 0);
  const totalDeposits = vendors.reduce((sum, v) => sum + (v.depositPaid || 0), 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVendor({
      category: category || 'General',
      name: name || 'Prospective Vendor',
      contactName,
      email,
      phone,
      status,
      quotedAmount: parseFloat(quotedAmount) || 0,
      depositPaid: parseFloat(depositPaid) || 0,
      rating: 5,
      notes,
      quoteOptions: []
    });

    setName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setQuotedAmount('');
    setDepositPaid('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const statusColors: Record<VendorStatus, { bg: string; text: string; label: string }> = {
    researching: { bg: 'bg-stone-100 dark:bg-stone-800', text: 'text-stone-700 dark:text-stone-300', label: 'Researching' },
    contacted: { bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-700 dark:text-blue-300', label: 'Contacted' },
    quote_received: { bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300', label: 'Quote Received' },
    hired: { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', label: 'Hired & Confirmed' },
    declined: { bg: 'bg-rose-100 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-300', label: 'Declined' }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            Vendor Checklist & Quote Matrix
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Track hiring status, deposits, contracts, and compare competing quotes side-by-side
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white rounded-xl flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vendor</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Vendors Hired</span>
          <div className="font-mono text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
            {hiredCount} / {vendors.length}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            {Math.round((hiredCount / (vendors.length || 1)) * 100)}% vendor coverage secured
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Total Quoted Value</span>
          <div className="font-mono text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
            {formatCurrency(totalQuoted)}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            Sum of all vendor quote contracts
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Deposits Paid</span>
          <div className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalDeposits)}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">
            {formatCurrency(totalQuoted - totalDeposits)} balance due upon completion
          </span>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vendors.map((vendor) => {
          const statusMeta = statusColors[vendor.status] || statusColors.researching;

          return (
            <div
              key={vendor.id}
              className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300">
                  {vendor.category}
                </span>

                <select
                  value={vendor.status}
                  onChange={(e) => onUpdateVendor({ ...vendor, status: e.target.value as VendorStatus })}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg border-0 cursor-pointer focus:ring-1 focus:ring-rose-500 ${statusMeta.bg} ${statusMeta.text}`}
                >
                  <option value="researching">Researching</option>
                  <option value="contacted">Contacted</option>
                  <option value="quote_received">Quote Received</option>
                  <option value="hired">Hired & Confirmed</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              {/* Title & Notes */}
              <div>
                <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {vendor.name}
                </h4>
                {vendor.notes && (
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {vendor.notes}
                  </p>
                )}
              </div>

              {/* Financials */}
              <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase block font-sans">Quote</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {formatCurrency(vendor.quotedAmount)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 uppercase block font-sans">Deposit Paid</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(vendor.depositPaid)}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-1 text-xs text-stone-500">
                {vendor.email && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="truncate">{vendor.email}</span>
                  </div>
                )}
                {vendor.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span>{vendor.phone}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                {/* 5-star rating */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => onUpdateVendor({ ...vendor, rating: star })}
                      className="text-amber-400 hover:text-amber-500"
                    >
                      <Star className={`w-3.5 h-3.5 ${star <= (vendor.rating || 5) ? 'fill-amber-400' : 'text-stone-300'}`} />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setComparingVendor(vendor)}
                  className="px-2.5 py-1 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1 transition"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare Quotes</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Quote Comparison Modal */}
      {comparingVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  Quote Comparison Matrix: {comparingVendor.category}
                </h3>
              </div>
              <button
                onClick={() => setComparingVendor(null)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-stone-500">
                Evaluating candidate vendors for <strong>{comparingVendor.category}</strong>. Compare package inclusions, per-unit costs, and AI trade-off analysis.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Current Selected */}
                <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-emerald-600">Option A (Selected)</span>
                    <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100">
                      {formatCurrency(comparingVendor.quotedAmount)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {comparingVendor.name}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {comparingVendor.notes || 'Full standard service package.'}
                  </p>
                  <ul className="text-xs text-stone-500 space-y-1 pt-2">
                    <li>✓ Standard liability insurance included</li>
                    <li>✓ Guaranteed backup staff on call</li>
                  </ul>
                </div>

                {/* Option 2: Alternate Quote */}
                <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-stone-500">Option B (Alternative)</span>
                    <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100">
                      {formatCurrency(Math.round(comparingVendor.quotedAmount * 0.88))}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Boutique Competitor Co.
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Slightly lower pricing with custom boutique portfolio, but fewer staff members.
                  </p>
                  <ul className="text-xs text-stone-500 space-y-1 pt-2">
                    <li>✓ 12% lower total cost</li>
                    <li>⚠ Requires $500 earlier deposit</li>
                  </ul>
                </div>
              </div>

              {/* AI Recommendation Banner */}
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Soirée AI Recommendation</p>
                  <p className="mt-0.5">
                    For <strong>{comparingVendor.category}</strong>, <em>{comparingVendor.name}</em> offers stronger contractual reliability for your event date. However, you can negotiate Option B's pricing to request a complimentary upgrade!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
              <button
                onClick={() => setComparingVendor(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 rounded-xl transition"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                Add Prospective Vendor
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Photography, Catering"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as VendorStatus)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                  >
                    <option value="researching">Researching</option>
                    <option value="contacted">Contacted</option>
                    <option value="quote_received">Quote Received</option>
                    <option value="hired">Hired & Confirmed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Vendor / Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silver Fern Floral Studio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="vendor-contact-name" className="text-xs font-semibold text-stone-700 dark:text-stone-300">Primary Contact</label>
                <input
                  id="vendor-contact-name"
                  type="text"
                  placeholder="Contact person"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Quoted Price ($)</label>
                  <input
                    type="number"
                    placeholder="3500"
                    value={quotedAmount}
                    onChange={(e) => setQuotedAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Deposit Paid ($)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={depositPaid}
                    onChange={(e) => setDepositPaid(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Email</label>
                  <input
                    type="email"
                    placeholder="hello@vendor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Notes / Contract Details</label>
                <textarea
                  rows={2}
                  placeholder="Inclusions, package notes, tasting dates..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 dark:text-stone-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
