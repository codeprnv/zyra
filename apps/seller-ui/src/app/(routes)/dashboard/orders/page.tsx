'use client';
import { useQuery } from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { formatDate } from 'date-fns';
import { ChevronRight, Eye, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import axiosInstance from '../../../../utils/axiosInstance';

const fetchOrders = async () => {
  try {
    const res = await axiosInstance.get('/order/api/get-seller-orders');
    console.log(res.data);
    return res?.data?.orders;
  } catch (error) {
    console.error('Error fetching all orders: ', error);
  }
};

const ProductList = () => {
  const [globalFilter, setGlobalFilter] = useState('');

  //   const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Order ID',
        cell: ({ row }: any) => {
          return (
            <span className='truncate text-sm text-white'>
              #{row.original.id.slice(-6).toUpperCase() || 'N/A'}
            </span>
          );
        },
      },
      {
        accessorKey: 'user.name',
        header: 'Buyer',
        cell: ({ row }: any) => {
          return (
            <span className='text-white'>
              {row.original.user?.name || 'Guest'}
            </span>
          );
        },
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }: any) => <span>${row.original.total || 'N/A'}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }: any) => (
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${row.original.status === 'Paid' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-white'}`}
          >
            {row.original.status || 'N/A'}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }: any) => {
          const date = formatDate(row.original.createdAt, 'dd/MM/yyyy');
          return <span className='text-sm text-white'>{date}</span>;
        },
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }: any) => (
          <Link
            href={`/order/${row.original.id}`}
            className='text-blue-400 transition hover:text-blue-300'
          >
            <Eye size={18} />
          </Link>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className='min-h-screen w-full p-8'>
      <div className='mb-1 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold text-white'>All Orders</h2>
      </div>
      <div className='mb-4 flex items-center'>
        <Link href={`/dashboard`} className='cursor-pointer text-blue-400'>
          Dashboard
        </Link>
        <ChevronRight size={20} className='text-gray-200' />
        <span className='text-white'>All Orders</span>
      </div>
      <div className='mb-4 flex h-12 flex-1 items-center rounded-md bg-gray-900 p-2'>
        <Search size={18} className='mr-2 text-gray-400' />
        <input
          type='text'
          placeholder='Search Orders...'
          className='h-full w-full bg-transparent text-white outline-none'
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <div className='overflow-x-auto rounded-lg bg-gray-900 p-4'>
        {isLoading ? (
          <p className='text-center text-white'>Loading Orders...</p>
        ) : (
          <table className='w-full text-white'>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='border-b border-gray-800'>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className='p-3 text-left'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className='border-b border-gray-800 transition hover:bg-gray-900'
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='p-3'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!isLoading && orders?.length === 0 && (
          <p className='py-3 text-center text-white'>No Orders found!</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
