import React from 'react';

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className='relative'>
      <h1 className='relative z-10 text-xl font-semibold md:text-3xl'>
        {title}
      </h1>
      {/* <TitleBorder className='absolute top-[45%]' /> */}
    </div>
  );
};

export default SectionTitle;
