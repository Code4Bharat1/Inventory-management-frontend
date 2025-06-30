'use client';

import CountUp from 'react-countup';

const DashboardCard = ({ title, count, percentage, isPositive }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-2xl w-full max-w-sm mx-4 shadow-sm">
      <h3 className="text-gray-500 text-base font-medium tracking-wide">
        {title}
      </h3>
      <p className="text-3xl font-semibold text-gray-800 mt-1">
        <CountUp end={count} duration={1.5} separator="," />
      </p>
    </div>
  );
};

export default DashboardCard;
