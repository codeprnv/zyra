import React from 'react';
import SidebarWrapper from '../../../shared/components/sidebar/sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex h-full min-h-screen bg-black'>
      {/* Sidebar */}
      <aside className='w-[280px] min-w-[250px] max-w-[300px] border-r border-r-slate-800 p-4 text-white'>
        <div className='sticky top-0'>
          <SidebarWrapper />
        </div>
      </aside>

      <main className='flex-1'>
        <div className='overflow-auto'>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
