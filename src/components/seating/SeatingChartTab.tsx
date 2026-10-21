import React, { useState } from 'react';
import { Armchair, Plus, Users, AlertCircle, CheckCircle2, Trash2, X, Move, Sparkles } from 'lucide-react';
import { Table, Guest, TableShape } from '../../types';

interface SeatingChartTabProps {
  tables: Table[];
  guests: Guest[];
  onUpdateTables: (tables: Table[]) => void;
  onUpdateGuest: (guest: Guest) => void;
}

export const SeatingChartTab: React.FC<SeatingChartTabProps> = ({
  tables,
  guests,
  onUpdateTables,
  onUpdateGuest
}) => {
  const [selectedTableId, setSelectedTableId] = useState<string>(tables[0]?.id || '');
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableShape, setNewTableShape] = useState<TableShape>('round');
  const [newTableCapacity, setNewTableCapacity] = useState('8');

  // Confirmed guests who are not yet assigned to any table
  const confirmedGuests = guests.filter(g => g.rsvpStatus === 'confirmed');
  const assignedGuestIds = new Set(tables.flatMap(t => t.guestIds));
  const unseatedGuests = confirmedGuests.filter(g => !assignedGuestIds.has(g.id));

  const selectedTable = tables.find(t => t.id === selectedTableId) || tables[0];

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    const newTable: Table = {
      id: `table-${Date.now()}`,
      name: newTableName || `Table ${tables.length + 1}`,
      shape: newTableShape,
      capacity: parseInt(newTableCapacity) || 8,
      x: 100,
      y: 100,
      guestIds: []
    };
    const updated = [...tables, newTable];
    onUpdateTables(updated);
    setSelectedTableId(newTable.id);
    setNewTableName('');
    setIsAddTableOpen(false);
  };

  const handleAssignGuest = (guestId: string, tableId: string) => {
    const updated = tables.map(t => {
      // Remove from any previous table
      const filtered = t.guestIds.filter(id => id !== guestId);
      if (t.id === tableId) {
        if (filtered.length < t.capacity) {
          return { ...t, guestIds: [...filtered, guestId] };
        }
      }
      return { ...t, guestIds: filtered };
    });
    onUpdateTables(updated);
  };

  const handleRemoveGuestFromTable = (guestId: string, tableId: string) => {
    const updated = tables.map(t => {
      if (t.id === tableId) {
        return { ...t, guestIds: t.guestIds.filter(id => id !== guestId) };
      }
      return t;
    });
    onUpdateTables(updated);
  };

  const handleDeleteTable = (tableId: string) => {
    if (tables.length <= 1) return;
    const updated = tables.filter(t => t.id !== tableId);
    onUpdateTables(updated);
    setSelectedTableId(updated[0]?.id || '');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            Interactive Seating Chart Builder
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Arrange tables, assign confirmed guests, monitor capacities, and flag dietary requirements
          </p>
        </div>

        <button
          onClick={() => setIsAddTableOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white rounded-xl flex items-center gap-1.5 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Table</span>
        </button>
      </div>

      {/* Main Seating Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Tables Floor Grid (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Reception Floor Layout ({tables.length} Tables)
            </h3>
            <span className="text-xs text-stone-500 font-mono">
              {tables.reduce((sum, t) => sum + t.guestIds.length, 0)} / {confirmedGuests.length} Guests Seated
            </span>
          </div>

          {/* Tables Interactive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tables.map((table) => {
              const isSelected = selectedTable?.id === table.id;
              const isFull = table.guestIds.length >= table.capacity;
              const tableGuests = table.guestIds
                .map(id => guests.find(g => g.id === id))
                .filter(Boolean) as Guest[];

              // Count dietaries at this table
              const hasAllergies = tableGuests.some(g => g.dietary !== 'none');

              return (
                <div
                  key={table.id}
                  onClick={() => setSelectedTableId(table.id)}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20 dark:bg-rose-950/20 shadow-md'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/40 dark:bg-stone-850'
                  }`}
                >
                  {/* Table Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        table.shape === 'head'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                      }`}>
                        {table.shape === 'head' ? '👑' : '🍽️'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          {table.name}
                        </h4>
                        <span className="text-[11px] text-stone-400 capitalize">
                          {table.shape} Table
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 text-xs font-mono font-semibold rounded-lg ${
                      isFull
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {table.guestIds.length} / {table.capacity} Seats
                    </span>
                  </div>

                  {/* Dietary Badge */}
                  {hasAllergies && (
                    <div className="mb-2 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[10px] font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-purple-500" />
                      <span>Special Dietary Guest at Table</span>
                    </div>
                  )}

                  {/* Table Guest List */}
                  <div className="space-y-1.5 min-h-[70px]">
                    {tableGuests.length === 0 ? (
                      <p className="text-xs text-stone-400 italic py-2">
                        No guests seated yet. Click to select table and assign guests.
                      </p>
                    ) : (
                      tableGuests.map((g) => (
                        <div
                          key={g.id}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700/60 text-xs"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-medium text-stone-800 dark:text-stone-200 truncate">
                              {g.name}
                            </span>
                            {g.dietary !== 'none' && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/60 font-semibold uppercase">
                                {g.dietary}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveGuestFromTable(g.id, table.id);
                            }}
                            className="text-stone-400 hover:text-rose-600 p-0.5"
                            title="Unseat guest"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Unseated Guests & Assignment Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-sm border border-stone-200 dark:border-stone-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Unassigned Guests
              </h3>
              <p className="text-xs text-stone-500">
                Confirmed guests ready for table placement
              </p>
            </div>
            <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {unseatedGuests.length} unseated
            </span>
          </div>

          {selectedTable && (
            <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 text-xs">
              <span className="text-stone-500 block">Currently Selected Table:</span>
              <strong className="text-sm text-stone-900 dark:text-stone-100">
                {selectedTable.name}
              </strong>
              <span className="text-stone-500 block mt-0.5">
                Seats available: {selectedTable.capacity - selectedTable.guestIds.length}
              </span>
            </div>
          )}

          {/* Unseated list */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {unseatedGuests.length === 0 ? (
              <div className="py-8 text-center text-stone-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p>All confirmed guests have been seated!</p>
              </div>
            ) : (
              unseatedGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60 flex items-center justify-between gap-2"
                >
                  <div className="truncate">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block truncate">
                      {guest.name}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      {guest.group} {guest.dietary !== 'none' ? `• ${guest.dietary}` : ''}
                    </span>
                  </div>

                  <button
                    disabled={!selectedTable || selectedTable.guestIds.length >= selectedTable.capacity}
                    onClick={() => handleAssignGuest(guest.id, selectedTable.id)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    Seat Here →
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Add Table Modal */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                Add Table
              </h3>
              <button onClick={() => setIsAddTableOpen(false)} className="p-1 text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTable} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Table Name / Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 4: Peony, VIP Head Table"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Shape</label>
                  <select
                    value={newTableShape}
                    onChange={(e) => setNewTableShape(e.target.value as TableShape)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                  >
                    <option value="round">Round (8-10)</option>
                    <option value="rectangular">Rectangular (8-12)</option>
                    <option value="head">Head Table</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Max Capacity</label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddTableOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 dark:text-stone-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
