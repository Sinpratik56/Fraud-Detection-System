import React from 'react';

interface RiskScoreGaugeProps {
  score: number;
}

const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ score }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s > 90) return 'stroke-red-500 text-red-500';
    if (s > 75) return 'stroke-orange-500 text-orange-500';
    if (s > 60) return 'stroke-yellow-500 text-yellow-500';
    return 'stroke-green-500 text-green-500';
  };
  
  const colorClasses = getColor(score);

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="stroke-purple-700"
          strokeWidth="10"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className={`transition-all duration-1000 ease-out ${colorClasses}`}
          strokeWidth="10"
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className={`absolute flex flex-col items-center justify-center ${colorClasses}`}>
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-sm font-medium">Risk Score</span>
      </div>
    </div>
  );
};

export default RiskScoreGauge;