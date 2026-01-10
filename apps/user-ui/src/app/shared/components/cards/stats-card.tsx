import React from 'react';

const StatsCard = ({ title, count, Icon }: any) => {
  return (
    <div className='items-center justify-between rounded-md border border-gray-100 bg-white p-5 shadow-sm'>
      <div>
        <h3 className='text-sm text-gray-500'>{title}</h3>
        <p className='text-2xl font-bold text-gray-800'>{count}</p>
      </div>
      <Icon className='h-10 w-10 text-blue-500' />
    </div>
  );
};

export default StatsCard;
