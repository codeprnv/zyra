'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  BarChart,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Star,
  Trash,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from '../../../../shared/components/modals/delete-confirmation-modal';
import axiosInstance from '../../../../utils/axiosInstance';

const fetchProducts = async () => {
  try {
    const res = await axiosInstance.get('/product/api/get-shop-products');
    return res?.data?.products;
  } catch (error) {
    console.error('Error fetching all products: ', error);
  }
};

const deleteProduct = async (productId: string) => {
  try {
    const res = await axiosInstance.delete(
      `/product/api/delete-product/${productId}`
    );
    console.log(res?.data?.message);
    toast.success(res?.data?.message || 'Product deleted successfully!', {
      duration: 4000,
    });
  } catch (error) {
    toast.error('Error deleting the product!');
    console.error('Error deleting the product : ', error);
  }
};

const restoreProduct = async (productId: string) => {
  try {
    const res = await axiosInstance.put(
      `/product/api/restore-product/${productId}`
    );
    console.log(res?.data?.message);
    toast.success(res?.data?.message || 'Restored the product successfully!', {
      duration: 4000,
    });
  } catch (error) {
    toast.error('Error restoring the product!');
    console.error('Error restoring the product : ', error);
  }
};

const ProductList = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>();

  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      setShowDeleteModal(false);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      setShowDeleteModal(false);
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }: any) => {
          return (
            <Image
              width={65}
              height={65}
              src={row.original.images[0]?.url}
              alt={row.original.images[0]?.url}
              className='rounded-md object-cover'
            />
          );
        },
      },
      {
        accessorKey: 'name',
        header: 'Product Name',
        cell: ({ row }: any) => {
          const truncatedTitle =
            row.original.title.length > 25
              ? `${row.original.title.substring(0, 25)}...`
              : row.original.title;

          return (
            <Link
              href={`${process.env.NEXT_PUBLIC_USER_UI_LINK}/product/${row.original.slug}`}
              className='text-blue-400 hover:underline'
              title={row.original.title}
            >
              {truncatedTitle}
            </Link>
          );
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }: any) => <span>${row.original.sale_price}</span>,
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }: any) => (
          <span
            className={row.original.stock < 10 ? 'text-red-500' : 'text-white'}
          >
            {row.original.stock} left
          </span>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }: any) => (
          <div className='flex items-center gap-1 text-yellow-400'>
            <Star fill='#fde047' size={18} />
            &nbsp;
            <span className='text-white'>{row.original.ratings || 5}</span>
          </div>
        ),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }: any) => (
          <div className='flex gap-3'>
            <Link
              href={`/product/${row.original.id}`}
              className='text-blue-400 transition hover:text-blue-300'
            >
              <Eye size={18} />
            </Link>
            <Link
              href={`/product/edit/${row.original.id}`}
              className='text-yellow-400 transition hover:text-yellow-300'
            >
              <Pencil size={18} />
            </Link>
            <button
              className='text-gren-400 transition hover:text-green-300'
              onClick={() => openAnalytics(row.original)}
            >
              <BarChart size={18} />
            </button>
            <button
              className='text-red-400 transition hover:text-red-300'
              onClick={() => openDeleteModal(row.original)}
            >
              <Trash size={18} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  const openDeleteModal = (product: any) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  return (
    <div className='min-h-screen w-full p-8'>
      <div className='mb-1 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold text-white'>All Products</h2>
        <Link
          href={`/dashboard/create-product`}
          className='flex items-center justify-between gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>
      <div className='mb-4 flex items-center'>
        <Link href={`/dashboard`} className='cursor-pointer text-blue-400'>
          Dashboard
        </Link>
        <ChevronRight size={20} className='text-gray-200' />
        <span className='text-white'>All Products</span>
      </div>
      <div className='mb-4 flex h-12 flex-1 items-center rounded-md bg-gray-900 p-2'>
        <Search size={18} className='mr-2 text-gray-400' />
        <input
          type='text'
          placeholder='Search Products...'
          className='h-full w-full bg-transparent text-white outline-none'
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <div className='overflow-x-auto rounded-lg bg-gray-900 p-4'>
        {isLoading ? (
          <p className='text-center text-white'>Loading Products...</p>
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
        {showDeleteModal && (
          <DeleteConfirmationModal
            product={selectedProduct}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => deleteMutation.mutate(selectedProduct?.id)}
            onRestore={() => restoreMutation.mutate(selectedProduct?.id)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;
