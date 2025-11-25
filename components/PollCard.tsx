import React from 'react';
import { Poll } from '../types';

interface PollCardProps {
  poll: Poll;
  variant?: 'highlight' | 'standard';
}

const PollCard: React.FC<PollCardProps> = ({ poll, variant = 'standard' }) => {
  const isHighlight = variant === 'highlight';

  return (
    <div className={`
      relative overflow-hidden rounded-lg border border-npi-gold/20 
      ${isHighlight ? 'bg-gradient-to-br from-npi-red/40 to-npi-dark' : 'bg-npi-dark/60'}
      p-6 transition-transform hover:-translate-y-1 hover:border-npi-gold/50 duration-300
    `}>
      {/* Category Tag */}
      <span className={`
        inline-block text-xs font-bold tracking-wider uppercase px-2 py-1 rounded mb-3
        ${poll.category === 'Approve' ? 'bg-blue-900/50 text-blue-200 border border-blue-500/30' : 
          poll.category === 'Trust' ? 'bg-green-900/50 text-green-200 border border-green-500/30' :
          poll.category === 'Support' ? 'bg-npi-gold/20 text-npi-gold border border-npi-gold/30' :
          'bg-gray-800 text-gray-300'}
      `}>
        {poll.category}
      </span>

      <h3 className="font-serif text-xl text-white mb-4 leading-tight min-h-[3.5rem]">
        {poll.question}
      </h3>

      <div className="space-y-3 mb-6">
        {poll.data.map((item, idx) => (
          <div key={idx} className="relative">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">{item.label}</span>
              <span className="font-bold text-white">{item.value}%</span>
            </div>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ width: `${item.value}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-white/10 pt-4">
        <span className="text-xs text-gray-500">n={poll.totalVotes}</span>
        <button className="text-sm text-npi-gold hover:text-white underline decoration-npi-gold/50 transition-colors">
          See Full Report
        </button>
      </div>
    </div>
  );
};

export default PollCard;