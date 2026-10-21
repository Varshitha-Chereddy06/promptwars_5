import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock, AlertCircle, Plus, Filter, Wand2, X, User } from 'lucide-react';
import { Milestone, MilestoneStatus, FullEventPlan } from '../../types';
import { formatDate, isMilestoneOverdue, calculateDueDate } from '../../services/calculationService';

interface TimelineTabProps {
  milestones: Milestone[];
  eventDate: string;
  onUpdateMilestoneStatus: (id: string, status: MilestoneStatus) => void;
  onAddMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  onTriggerAITimeline: () => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  milestones,
  eventDate,
  onUpdateMilestoneStatus,
  onAddMilestone,
  onTriggerAITimeline
}) => {
  const [filter, setFilter] = useState<'all' | 'overdue' | 'due_soon' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDaysBefore, setNewDaysBefore] = useState('30');
  const [newCategory, setNewCategory] = useState('Planning');
  const [newAssignee, setNewAssignee] = useState('Host');
  const [newNotes, setNewNotes] = useState('');

  // Process overdue status
  const processedMilestones = milestones.map((m) => ({
    ...m,
    isOverdue: isMilestoneOverdue(m.calculatedDueDate, m.status)
  }));

  const overdueCount = processedMilestones.filter(m => m.isOverdue).length;
  const completedCount = processedMilestones.filter(m => m.status === 'completed').length;

  // Filter logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = processedMilestones.filter((m) => {
    if (filter === 'completed') return m.status === 'completed';
    if (filter === 'overdue') return m.isOverdue;
    if (filter === 'due_soon') {
      if (m.status === 'completed') return false;
      const due = new Date(m.calculatedDueDate);
      const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return diffDays >= 0 && diffDays <= 14;
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const days = parseInt(newDaysBefore) || 30;
    const dueDate = calculateDueDate(eventDate, days);

    onAddMilestone({
      title: newTitle || 'Custom Milestone',
      daysBeforeEvent: days,
      calculatedDueDate: dueDate,
      category: newCategory,
      status: 'pending',
      assignee: newAssignee,
      notes: newNotes
    });

    setNewTitle('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            Reverse-Scheduled Timeline
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Milestones counted backwards from event date with real calendar deadlines
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onTriggerAITimeline}
            className="px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-1.5 transition shadow-sm"
          >
            <Wand2 className="w-4 h-4 text-rose-500" />
            <span>AI Run-of-Show</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white rounded-xl flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* Stats and Filter Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
              filter === 'all'
                ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            All Milestones ({milestones.length})
          </button>

          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
              filter === 'overdue'
                ? 'bg-rose-600 text-white'
                : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Overdue ({overdueCount})</span>
          </button>

          <button
            onClick={() => setFilter('due_soon')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
              filter === 'due_soon'
                ? 'bg-amber-600 text-white'
                : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            Due Soon (Next 14d)
          </button>

          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
              filter === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed ({completedCount})</span>
          </button>
        </div>

        <span className="text-xs text-stone-400 px-2">
          {Math.round((completedCount / (milestones.length || 1)) * 100)}% progress complete
        </span>
      </div>

      {/* Milestones Timeline List */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800 space-y-4">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-stone-400 text-xs">
            No milestones match this filter.
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-stone-200 dark:border-stone-800 space-y-6">
            {filtered.map((m) => {
              const isDone = m.status === 'completed';
              const isInProgress = m.status === 'in_progress';

              return (
                <div key={m.id} className="relative group">
                  {/* Timeline bullet node */}
                  <button
                    onClick={() => onUpdateMilestoneStatus(m.id, isDone ? 'pending' : 'completed')}
                    aria-label={`Toggle status for ${m.title}`}
                    className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                        : m.isOverdue
                        ? 'bg-rose-500 text-white ring-4 ring-rose-100 dark:ring-rose-950 animate-pulse'
                        : isInProgress
                        ? 'bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-950'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-400 hover:bg-stone-300'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Milestone Card */}
                  <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-stone-50/40 dark:bg-stone-850/40 border-stone-200/50 dark:border-stone-800 opacity-80'
                      : m.isOverdue
                      ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60 shadow-sm'
                      : 'bg-stone-50/70 dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          {m.daysBeforeEvent === 0 ? 'Day-of' : `T - ${m.daysBeforeEvent}d`}
                        </span>

                        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300">
                          {m.category}
                        </span>

                        {m.isOverdue && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            <span>Overdue</span>
                          </span>
                        )}
                      </div>

                      {/* Due date */}
                      <span className="text-xs text-stone-500 font-mono flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Due: {formatDate(m.calculatedDueDate)}</span>
                      </span>
                    </div>

                    <h4 className={`text-sm sm:text-base font-semibold mt-2 ${
                      isDone ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-900 dark:text-stone-100'
                    }`}>
                      {m.title}
                    </h4>

                    {m.notes && (
                      <p className="text-xs text-stone-500 mt-1">
                        {m.notes}
                      </p>
                    )}

                    {/* Footer Row */}
                    <div className="flex items-center justify-between text-xs text-stone-400 pt-3 mt-3 border-t border-stone-200/40 dark:border-stone-700/40">
                      <span className="flex items-center gap-1 text-stone-500">
                        <User className="w-3.5 h-3.5" />
                        <span>Assigned to: <strong>{m.assignee || 'Unassigned'}</strong></span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateMilestoneStatus(m.id, 'in_progress')}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition ${
                            isInProgress
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300'
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => onUpdateMilestoneStatus(m.id, isDone ? 'pending' : 'completed')}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition ${
                            isDone
                              ? 'bg-emerald-600 text-white font-semibold'
                              : 'hover:bg-emerald-100 text-emerald-700 dark:hover:bg-emerald-950/60'
                          }`}
                        >
                          {isDone ? 'Done ✓' : 'Mark Complete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Milestone Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="milestone-modal-title">
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
              <h3 id="milestone-modal-title" className="text-base font-semibold text-stone-900 dark:text-stone-100">
                Add Reverse-Scheduled Milestone
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Milestone Action</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Confirm wedding rehearsal schedule, Order favors"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Days Before Event</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="30"
                    value={newDaysBefore}
                    onChange={(e) => setNewDaysBefore(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-mono"
                  />
                  <span className="text-[10px] text-stone-400">0 = Event Day</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Assignee</label>
                <input
                  type="text"
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Additional context or links..."
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition"
                >
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
