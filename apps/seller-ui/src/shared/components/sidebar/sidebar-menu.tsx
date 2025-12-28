import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

const SidebarMenu = ({ title, children }: Props) => {
  return (
    <div className='block'>
      <h3 className='pl-1 text-xs tracking-[0.04rem]'>{title}</h3>
      {children}
    </div>
  );
};

export default SidebarMenu;
