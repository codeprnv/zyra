'use client';
import { useQueryClient } from '@tanstack/react-query';
import {
    Bell,
    CheckCircle,
    Clock,
    Inbox,
    Loader2,
    Lock,
    LogOut,
    MapPin,
    ShoppingBag,
    Truck,
    User,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import StatsCard from '../../shared/components/cards/stats-card';
import axiosInstance from '../../utils/axiosInstance';

const NavItem = ({ label, Icon, active, danger, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition duration-200 ${active ? 'bg-blue-100 text-blue-600' : danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'}`}
  >
    <Icon className='h-4 w-4' />
    {label}
  </button>
);

const ProfilePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const queryTab = searchParams.get('active') || 'Profile';
  const { user, isLoading } = useUser();

  const [activeTab, setActiveTab] = useState(queryTab);

  useEffect(() => {
    if (activeTab !== queryTab) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('active', activeTab);
      router.replace(`/profile?${newParams.toString()}`);
    }
  }, [activeTab]);

  const logOutHandler = async () => {
    try {
      const res = await axiosInstance.get('/api/logout-user');
      if (res) {
        queryClient.invalidateQueries({ queryKey: ['user'] });
        router.push('/login');
      }
    } catch (error) {
      console.error('Error in logout: ', error);
    }
  };
  return (
    <div className='bg-gray-50 p-6 pb-14'>
      <div className='mx-auto md:max-w-7xl'>
        <div className='mb-10 text-center'>
          <h1 className='text-3xl font-bold text-gray-800'>
            Welcome back,{' '}
            <span className='text-blue-600'>
              {isLoading ? (
                <Loader2 className='inline h-5 w-5 animate-spin' />
              ) : (
                `${user?.name || 'User'}`
              )}
            </span>{' '}
            👋
          </h1>
        </div>
        {/* Profile overview grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
          <StatsCard title='Total Orders' count={10} Icon={Clock} />
          <StatsCard title='Processing Orders' count={4} Icon={Truck} />
          <StatsCard title={'Completed Orders'} count={5} Icon={CheckCircle} />
        </div>

        {/* Sidebar and content layout */}
        <div className='mt-10 flex flex-col gap-6 md:flex-row'>
          {/* Left navigation */}
          <div className='w-full rounded-e-md border border-gray-100 bg-white p-4 shadow-md md:w-1/5'>
            <nav className='space-y-2'>
              <NavItem
                label='Profile'
                Icon={User}
                active={activeTab === 'Profile'}
                onClick={() => setActiveTab('Profile')}
              />
              <NavItem
                label='My Orders'
                Icon={ShoppingBag}
                active={activeTab === 'My Orders'}
                onClick={() => setActiveTab('My Orders')}
              />
              <NavItem
                label='Inbox'
                Icon={Inbox}
                active={activeTab === 'Inbox'}
                onClick={() => router.push('/inbox')}
              />
              <NavItem
                label='Notifications'
                Icon={Bell}
                active={activeTab === 'Notifications'}
                onClick={() => setActiveTab('Notifications')}
              />
              <NavItem
                label='Shipping Address'
                Icon={MapPin}
                active={activeTab === 'Shipping Address'}
                onClick={() => setActiveTab('Shipping Address')}
              />
              <NavItem
                label='Change Password'
                Icon={Lock}
                active={activeTab === 'Change Password'}
                onClick={() => setActiveTab('Change Password')}
              />
              <NavItem
                label='Logout'
                Icon={LogOut}
                danger
                onClick={() => logOutHandler()}
              />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
