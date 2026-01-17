'use client';
import {
  BellPlus,
  BellRing,
  FileClock,
  HandCoins,
  ListOrdered,
  LogOut,
  PackageSearch,
  PencilRuler,
  Settings,
  Store,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import useSidebar from '../../../../src/hooks/useSidebar';
import Home from '../../../assets/svgs/home';
import Logo from '../../../assets/svgs/logo';
import useAdmin from '../../../hooks/useAdmin';
import Box from '../box';
import SidebarItem from './sidebar-item';
import SidebarMenu from './sidebar-menu';
import { Sidebar } from './sidebar-styles';

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { admin } = useAdmin();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? '#0085ff' : '#969696';

  return (
    <Box
      css={{
        height: '100vh',
        zIndex: 202,
        position: 'sticky',
        padding: '8px',
        top: '0',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
      }}
      className='sidebar-wrapper'
    >
      <Sidebar.Header>
        <Box>
          <Link href={'/'} className='flex justify-center gap-2 text-center'>
            <Logo />
            <Box>
              <h3 className='text-xl font-medium text-[#ecedee]'>
                {admin?.name}
              </h3>
              <h5 className='max-w-[170px] overflow-hidden text-ellipsis whitespace-nowrap pl-2 text-xs font-medium text-[#ecedeecf]'>
                {admin?.email}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className='my-3 block h-full'>
        <Sidebar.Body className='body sidebar'>
          <SidebarItem
            title='Dashboard'
            icon={<Home fill={getIconColor('/dashboard')} />}
            isActive={activeSidebar === '/dashboard'}
            href={`/dashboard`}
          />
          <div className='mt-2 block'>
            <SidebarMenu title='Main Menu'>
              <SidebarItem
                title='Orders'
                icon={
                  <ListOrdered
                    size={22}
                    color={getIconColor('/dashboard/orders')}
                  />
                }
                isActive={activeSidebar === '/dashboard/orders'}
                href='/dashboard/orders'
              />
              <SidebarItem
                title='Payments'
                icon={
                  <HandCoins
                    size={22}
                    color={getIconColor('/dashboard/payments')}
                  />
                }
                isActive={activeSidebar === '/dashboard/payments'}
                href='/dashboard/payments'
              />
              <SidebarItem
                title='Products'
                icon={
                  <PackageSearch
                    size={22}
                    color={getIconColor('/dashboard/products')}
                  />
                }
                isActive={activeSidebar === '/dashboard/products'}
                href='/dashboard/products'
              />
              <SidebarItem
                title='Events'
                icon={
                  <BellPlus
                    size={24}
                    color={getIconColor('/dashboard/events')}
                  />
                }
                isActive={activeSidebar === '/dashboard/events'}
                href='/dashboard/events'
              />
              <SidebarItem
                title='Users'
                icon={
                  <Users size={22} color={getIconColor('/dashboard/users')} />
                }
                isActive={activeSidebar === '/dashboard/users'}
                href='/dashboard/users'
              />
              <SidebarItem
                title='Sellers'
                icon={
                  <Store size={22} color={getIconColor('/dashboard/sellers')} />
                }
                isActive={activeSidebar === '/dashboard/sellers'}
                href='/dashboard/sellers'
              />
            </SidebarMenu>
            <SidebarMenu title='Controllers'>
              <SidebarItem
                title='Loggers'
                icon={
                  <FileClock
                    size={22}
                    color={getIconColor('/dashboard/loggers')}
                  />
                }
                isActive={activeSidebar === '/dashboard/loggers'}
                href='/dashboard/loggers'
              />
              <SidebarItem
                title='Management'
                icon={
                  <Settings
                    size={22}
                    color={getIconColor('/dashboard/management')}
                  />
                }
                isActive={activeSidebar === '/dashboard/management'}
                href='/dashboard/management'
              />
              <SidebarItem
                title='Notifications'
                icon={
                  <BellRing
                    size={24}
                    color={getIconColor('/dashboard/notifications')}
                  />
                }
                isActive={activeSidebar === '/dashboard/notifications'}
                href='/dashboard/loggers'
              />
            </SidebarMenu>
            <SidebarMenu title='Customization'>
              <SidebarItem
                title='All Customization'
                icon={
                  <PencilRuler
                    size={22}
                    color={getIconColor('/dashboard/customization')}
                  />
                }
                isActive={activeSidebar === '/dashboard/customization'}
                href='/dashboard/customization'
              />
            </SidebarMenu>
            <SidebarMenu title='Extras'>
              <SidebarItem
                title='Logout'
                icon={<LogOut size={20} color={getIconColor('/logout')} />}
                isActive={activeSidebar === '/logout'}
                href='/logout'
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SidebarWrapper;
