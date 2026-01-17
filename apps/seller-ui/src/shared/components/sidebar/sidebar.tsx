'use client';
import {
  BellDot,
  BellPlus,
  CalendarPlus,
  HandCoins,
  ListOrdered,
  LogOut,
  Mail,
  PackageSearch,
  Settings,
  SquarePlus,
  TicketPercent,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import Home from '../../../assets/icons/home';
import Logo from '../../../assets/svgs/logo';
import useSeller from '../../../hooks/useSeller';
import useSidebar from '../../../hooks/useSidebar';
import Box from './box';
import SidebarItems from './sidebar-items';
import SidebarMenu from './sidebar-menu';
import { Sidebar } from './sidebar-styles';

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? '#0085ff' : '#969696';

  return (
    <Box
      css={{
        height: '100vh',
        zIndex: '202',
        position: 'sticky',
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
                {seller?.shop?.name}
              </h3>
              <h5 className='max-w-[170px] overflow-hidden text-ellipsis whitespace-nowrap pl-2 text-xs font-medium text-[#ecedeecf]'>
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className='my-3 block h-full'>
        <Sidebar.Body>
          <SidebarItems
            title='Dashboard'
            icon={<Home fill={getIconColor('/dashboard')} fontSize={24} />}
            isActive={activeSidebar === '/dashboard'}
            href='/dashboard'
          />
          <div className='mt-2 block'>
            <SidebarMenu title='Main Menu'>
              <SidebarItems
                title='Orders'
                icon={
                  <ListOrdered
                    size={24}
                    color={getIconColor('/dashboard/orders')}
                  />
                }
                isActive={activeSidebar === '/dashboard/orders'}
                href='/dashboard/orders'
              />
              <SidebarItems
                title='Payments'
                icon={
                  <HandCoins
                    size={24}
                    color={getIconColor('/dashboard/payments')}
                  />
                }
                isActive={activeSidebar === '/dashboard/payments'}
                href='/dashboard/payments'
              />
            </SidebarMenu>
            <SidebarMenu title='Products'>
              <SidebarItems
                title='Create Product'
                icon={
                  <SquarePlus
                    size={24}
                    color={getIconColor('/dashboard/create-product')}
                  />
                }
                isActive={activeSidebar === '/dashboard/create-product'}
                href='/dashboard/create-product'
              />
              <SidebarItems
                title='All Products'
                icon={
                  <PackageSearch
                    size={24}
                    color={getIconColor('/dashboard/all-products')}
                  />
                }
                isActive={activeSidebar === '/dashboard/all-products'}
                href='/dashboard/all-products'
              />
            </SidebarMenu>
            <SidebarMenu title='Events'>
              <SidebarItems
                title='Create Event'
                icon={
                  <CalendarPlus
                    size={24}
                    color={getIconColor('/dashboard/create-event')}
                  />
                }
                isActive={activeSidebar === '/dashboard/create-event'}
                href='/dashboard/create-event'
              />
              <SidebarItems
                title='All Events'
                icon={
                  <BellPlus
                    size={26}
                    color={getIconColor('/dashboard/all-events')}
                  />
                }
                isActive={activeSidebar === '/dashboard/all-events'}
                href='/dashboard/all-events'
              />
            </SidebarMenu>
            <SidebarMenu title='Controllers'>
              <SidebarItems
                title='Inbox'
                icon={
                  <Mail size={24} color={getIconColor('/dashboard/inbox')} />
                }
                isActive={activeSidebar === '/dashboard/inbox'}
                href='/dashboard/inbox'
              />
              <SidebarItems
                title='Settings'
                icon={
                  <Settings
                    size={24}
                    color={getIconColor('/dashboard/settings')}
                  />
                }
                isActive={activeSidebar === '/dashboard/settings'}
                href='/dashboard/settings'
              />
              <SidebarItems
                title='Notifications'
                icon={
                  <BellDot
                    size={24}
                    color={getIconColor('/dashboard/notifications')}
                  />
                }
                isActive={activeSidebar === '/dashboard/notifications'}
                href='/dashboard/notifications'
              />
            </SidebarMenu>
            <SidebarMenu title='Extras'>
              <SidebarItems
                title='Discount Codes'
                icon={
                  <TicketPercent
                    size={24}
                    color={getIconColor('/dashboard/discount-codes')}
                  />
                }
                isActive={activeSidebar === '/dashboard/discount-codes'}
                href='/dashboard/discount-codes'
              />
              <SidebarItems
                title='Logout'
                icon={<LogOut size={24} color={getIconColor('/logout')} />}
                isActive={activeSidebar === '/logout'}
                href='/'
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SidebarWrapper;
