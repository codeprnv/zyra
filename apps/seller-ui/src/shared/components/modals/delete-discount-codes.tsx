import { X } from 'lucide-react';
import React from 'react';

const DeleteDiscountCodeModal = ({
  discount,
  onClose,
  onConfirm,
}: {
  discount: any;
  onClose: () => void;
  onConfirm?: any;
}) => {
  return (
    <div className='fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50'>
      <div className='w-[450px] rounded-lg bg-gray-800 p-6 shadow-lg'>
        <div className='flex items-center justify-between border-b border-gray-700 pb-3'>
          <h3 className='text-xl text-white'>Delete Discount Code</h3>
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
          <span className='font-semibold text-white'>
            {discount.public_name}
          </span>
          ?<br />
          <span className='text-red-500 hover:text-red-700'>
            This action **Cannot be undone**
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
            onClick={onConfirm}
            className='rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDiscountCodeModal;
