'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, CheckCircle2, Award, Users, RefreshCw } from 'lucide-react';
import { ArticlePoll as PollType } from '@/types/database';

interface ArticlePollProps {
  articleId: string;
  initialPoll?: PollType;
}

export default function ArticlePoll({ articleId, initialPoll }: ArticlePollProps) {
  const [poll, setPoll] = useState<PollType | null>(initialPoll || null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedVote = localStorage.getItem(`sada_poll_voted_${articleId}`);
      if (savedVote) {
        setHasVoted(true);
        setVotedOptionId(savedVote);
      }
    }

    if (!initialPoll) {
      fetch(`/api/articles/${articleId}/poll`)
        .then((res) => res.json())
        .then((data) => {
          if (data.poll) setPoll(data.poll);
        })
        .catch(() => {});
    }
  }, [articleId, initialPoll]);

  const handleVote = async () => {
    if (!selectedOption || isSubmitting || hasVoted) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/articles/${articleId}/poll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option_id: selectedOption }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.poll) {
          setPoll(data.poll);
        }
        setHasVoted(true);
        setVotedOptionId(selectedOption);
        if (typeof window !== 'undefined') {
          localStorage.setItem(`sada_poll_voted_${articleId}`, selectedOption);
        }
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!poll) {
    return null;
  }

  const totalVotes = Math.max(poll.total_votes, 1);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-red-50/30 rounded-xl border border-brand-border p-5 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-red/10 text-brand-red flex items-center justify-center font-bold">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-red">
              استطلاع رأي القراء
            </span>
            <h3 className="font-heading font-black text-lg text-brand-navy leading-snug">
              شارك برأيك في هذا الخبر
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-brand-muted bg-white px-2.5 py-1 rounded-full border border-gray-200">
          <Users className="w-3.5 h-3.5 text-brand-muted" />
          <span className="font-semibold">{poll.total_votes.toLocaleString('ar-TN')}</span>
          <span>مشارك</span>
        </div>
      </div>

      {/* Poll Question */}
      <p className="font-tajawal font-bold text-sm md:text-base text-gray-800 mb-5 leading-relaxed">
        {poll.question}
      </p>

      {/* Options */}
      <div className="space-y-3 mb-5">
        {poll.options.map((option) => {
          const percentage = Math.round((option.votes / totalVotes) * 100);
          const isSelected = selectedOption === option.id;
          const isUserVote = votedOptionId === option.id;

          if (hasVoted) {
            // Results Mode (After voting)
            return (
              <div
                key={option.id}
                className={`relative overflow-hidden rounded-lg p-3.5 border transition ${
                  isUserVote
                    ? 'border-brand-red bg-red-50/40 shadow-sm'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* Progress bar background */}
                <div
                  className={`absolute top-0 bottom-0 right-0 transition-all duration-700 ease-out opacity-20 ${
                    isUserVote ? 'bg-brand-red' : 'bg-brand-navy'
                  }`}
                  style={{ width: `${percentage}%` }}
                />

                <div className="relative flex items-center justify-between gap-3 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    {isUserVote ? (
                      <CheckCircle2 className="w-4 h-4 text-brand-red flex-shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                    )}
                    <span className={`font-tajawal ${isUserVote ? 'font-bold text-brand-navy' : 'text-gray-700'}`}>
                      {option.text}
                    </span>
                    {isUserVote && (
                      <span className="text-[10px] bg-brand-red text-white px-2 py-0.5 rounded-full font-bold">
                        صوتك
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono flex-shrink-0">
                    <span className="text-gray-500 text-xs">({option.votes})</span>
                    <span className="font-bold text-brand-navy min-w-[3rem] text-left">
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // Voting Mode (Before voting)
          return (
            <label
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition select-none ${
                isSelected
                  ? 'border-brand-red bg-red-50/50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`poll-${poll.id}`}
                  value={option.id}
                  checked={isSelected}
                  onChange={() => setSelectedOption(option.id)}
                  className="w-4 h-4 text-brand-red border-gray-300 focus:ring-brand-red accent-brand-red"
                />
                <span className={`font-tajawal text-xs md:text-sm ${isSelected ? 'font-bold text-brand-navy' : 'text-gray-700'}`}>
                  {option.text}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      {/* Action / Result Feedback */}
      {hasVoted ? (
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-green-700 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>شكراً لمشاركتك! تم تسجيل رأيك ضمن سبر آراء هذا المقال.</span>
          </div>
          <span className="text-[11px] text-gray-400">التصويت مجهول ومحمي</span>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            onClick={handleVote}
            disabled={!selectedOption || isSubmitting}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold text-white transition shadow-sm ${
              !selectedOption || isSubmitting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-brand-red hover:bg-brand-redDark'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>جاري تسجيل الصوت...</span>
              </>
            ) : (
              <span>تسجيل رأيي الآن</span>
            )}
          </button>
          <span className="text-xs text-gray-500 font-tajawal">
            اختر إجابة واحدة ثم اضغط تسجيل
          </span>
        </div>
      )}
    </div>
  );
}
