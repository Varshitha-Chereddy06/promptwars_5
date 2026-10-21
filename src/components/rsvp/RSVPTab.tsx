import React, { useState } from 'react';
import { Users, UserPlus, Check, X, Clock, AlertCircle, Search, Mail, MessageCircle, Filter, Download } from 'lucide-react';
import { Guest, RSVPStatus, DietaryOption } from '../../types';

interface RSVPTabProps {
  guests: Guest[];
  onUpdateGuest: (guest: Guest) => void;
  onAddGuest: (guest: Omit<Guest, 'id'>) => void;
  onDraftAIReminder: () => void;
}

export const RSVPTab: React.FC<RSVPTabProps> = ({
  guests,
  onUpdateGuest,
  onAddGuest,
  onDraftAIReminder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New guest state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState('Friends');
  const [plusOnes, setPlusOnes] = useState('0');
  const [dietary, setDietary] = useState<DietaryOption>('none');
  const [mealChoice, setMealChoice] = useState('');
  const [notes, setNotes] = useState('');

  // Calculations
  const confirmedCount = guests.filter(g => g.rsvpStatus === 'confirmed').length;
  const confirmedHeads = guests
    .filter(g => g.rsvpStatus === 'confirmed')
    .reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);

  const pendingCount = guests.filter(g => g.rsvpStatus === 'pending').length;
  const declinedCount = guests.filter(g => g.rsvpStatus === 'declined').length;

  // Dietary counts
  const dietaryBreakdown = guests
    .filter(g => g.dietary !== 'none')
    .reduce((acc, g) => {
      acc[g.dietary] = (acc[g.dietary] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const filteredGuests = guests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          g.group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || g.rsvpStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGuest({
      name: name || 'Guest',
      email: email || '',
      group: group || 'General',
      rsvpStatus: 'pending',
      plusOnes: parseInt(plusOnes) || 0,
      dietary,
      mealChoice,
      notes
    });

    setName('');
    setEmail('');
    setMealChoice('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            Guest List, RSVP & Dietary Tracker
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time headcount attendance, plus-ones, meal selections, and allergy tracking
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onDraftAIReminder}
            className="px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-1.5 transition shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-rose-500" />
            <span>AI RSVP Reminder</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white rounded-xl flex items-center gap-1.5 transition shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Total Invited</span>
          <div className="font-mono text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
            {guests.length}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">Invitations dispatched</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <span className="text-xs text-emerald-700 dark:text-emerald-300 uppercase tracking-wider font-semibold">Confirmed Heads</span>
          <div className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {confirmedHeads}
          </div>
          <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400 mt-0.5 block">
            {confirmedCount} primary + {confirmedHeads - confirmedCount} plus-ones
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 shadow-sm">
          <span className="text-xs text-amber-700 dark:text-amber-300 uppercase tracking-wider font-semibold">Pending RSVP</span>
          <div className="font-mono text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {pendingCount}
          </div>
          <span className="text-[11px] text-amber-600/80 dark:text-amber-400 mt-0.5 block">
            Awaiting response
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-sm">
          <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Declined</span>
          <div className="font-mono text-2xl font-black text-stone-500 mt-1">
            {declinedCount}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">Regrets received</span>
        </div>
      </div>

      {/* Dietary Restrictions Bar */}
      {Object.keys(dietaryBreakdown).length > 0 && (
        <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-purple-600" />
            <span>Special Dietary Requirements:</span>
          </span>
          {Object.entries(dietaryBreakdown).map(([key, count]) => (
            <span key={key} className="px-2.5 py-1 bg-white dark:bg-stone-800 rounded-lg shadow-sm font-medium text-stone-800 dark:text-stone-200 border border-purple-100 dark:border-purple-900">
              {key.replace('_', ' ').toUpperCase()}: <strong>{count}</strong>
            </span>
          ))}
        </div>
      )}

      {/* Guest Table & Controls */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800 space-y-4">
        
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search guest, email, or group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs">
            {(['all', 'confirmed', 'pending', 'declined'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 font-semibold rounded-lg capitalize transition ${
                  statusFilter === st
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-850 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200/60 dark:border-stone-700/60">
              <tr>
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-3">RSVP Status</th>
                <th className="py-3 px-3">+1s</th>
                <th className="py-3 px-3">Group</th>
                <th className="py-3 px-3">Dietary</th>
                <th className="py-3 px-3">Meal Choice</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredGuests.map((guest) => {
                const isConfirmed = guest.rsvpStatus === 'confirmed';
                const isPending = guest.rsvpStatus === 'pending';

                return (
                  <tr key={guest.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-850/50 transition">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                        {guest.name}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {guest.email || 'No email registered'}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={guest.rsvpStatus}
                        onChange={(e) => onUpdateGuest({ ...guest, rsvpStatus: e.target.value as RSVPStatus })}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border-0 cursor-pointer ${
                          isConfirmed
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isPending
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>

                    <td className="py-3 px-3 font-mono">
                      {guest.plusOnes > 0 ? `+${guest.plusOnes}` : '0'}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-stone-600 dark:text-stone-400 text-[11px]">
                        {guest.group}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      {guest.dietary !== 'none' ? (
                        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded font-semibold text-[10px]">
                          {guest.dietary.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="text-stone-400">None</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-stone-700 dark:text-stone-300">
                      {guest.mealChoice || 'Standard'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onUpdateGuest({ ...guest, rsvpStatus: isConfirmed ? 'pending' : 'confirmed' })}
                        className="px-2.5 py-1 text-[11px] font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                      >
                        {isConfirmed ? 'Reset' : 'Confirm ✓'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add Guest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                Add Guest to Invitation List
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Email Address</label>
                  <input
                    type="email"
                    placeholder="maya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Guest Group</label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                  >
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="VIP">VIP</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="Committee">Committee / Volunteers</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Plus-Ones Allowed</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={plusOnes}
                    onChange={(e) => setPlusOnes(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Dietary Need</label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value as DietaryOption)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                  >
                    <option value="none">None (Standard)</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="gluten_free">Gluten-Free</option>
                    <option value="halal">Halal</option>
                    <option value="kosher">Kosher</option>
                    <option value="nut_allergy">Nut Allergy</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Meal Choice</label>
                <input
                  type="text"
                  placeholder="e.g. Pan-seared Salmon, Mushroom Risotto"
                  value={mealChoice}
                  onChange={(e) => setMealChoice(e.target.value)}
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
                  Add to Guest List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
