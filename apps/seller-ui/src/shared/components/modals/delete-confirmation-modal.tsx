import { X } from 'lucide-react';
import React from 'react';

const DeleteConfirmationModal = ({
  product,
  onClose,
  onConfirm,
  onRestore,
}: any) => {
  return (
    <div className='fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50'>
      <div className='w-[450px] rounded-lg bg-gray-800 p-6 shadow-lg'>
        <div className='flex items-center justify-between border-b border-gray-700 pb-3'>
          <h3 className='text-xl text-white'>Delete Product</h3>
          <button
            type='button'
            className='text-gray-400 hover:text-white'
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>
        <p className='mt-4 text-gray-300'>
          Are you sure you want to delete &nbsp;
          <span className='font-semibold text-white'>{product.title}</span>
          ?<br />
          <span className='text-red-500 hover:text-red-700'>
            This product will be moved to a **delete state** and permanently
            removed **after 24 hours**. You can recover it within this time.
          </span>
        </p>
        <div className='mt-6 flex justify-end gap-3'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-md bg-gray-600 px-4 py-2 font-semibold text-white transition hover:bg-gray-700'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={!product?.isDeleted ? onConfirm : onRestore}
            className={`${product?.isDeleted ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} rounded-md px-4 py-2 font-semibold text-white transition`}
          >
            {product?.isDeleted ? 'Restore' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
