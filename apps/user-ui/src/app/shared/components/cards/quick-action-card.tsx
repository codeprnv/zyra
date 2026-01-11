import React from 'react';

const QuickActionCard = ({ Icon, title, description }: any) => {
  return (
    <div className='flex cursor-pointer items-start gap-4 rounded-md border border-gray-100 bg-white p-4 shadow-sm'>
      <Icon className='mt-1 h-6 w-6 text-blue-500' />
      <div className=''>
        <h4 className='mb-1 text-sm font-semibold text-gray-800'>{title}</h4>
        <p className='text-xs text-gray-500'>{description}</p>
      </div>
    </div>
  );
};

export default QuickActionCard;
