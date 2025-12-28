import Link from 'next/link';
import React from 'react';

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href: string;
}

const SidebarItems = ({ icon, title, isActive, href }: Props) => {
  return (
    <Link href={href} className='my-2 block'>
      <div
        className={`flex h-full min-h-12 w-full cursor-pointer items-center gap-2 rounded-lg px-[13px] transition hover:bg-[#2b2f31] ${isActive && 'scale-[.98] bg-[#0f3158] fill-blue-200 hover:bg-[#0f3158d6]'}`}
      >
        {icon}
        <h5 className='text-lg text-slate-200'>{title}</h5>
      </div>
    </Link>
  );
};

export default SidebarItems;
