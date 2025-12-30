import { PlusCircleIcon, Trash2 } from 'lucide-react';
import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import Input from '../input';

const CustomSpecifications = ({ control, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'custom_specifications',
  });
  return (
    <div>
      <label className='mb-1 block font-semibold text-gray-300'>
        Custom Specifications
      </label>
      <div className='flex flex-col gap-3'>
        {fields?.map((item, index) => (
          <div key={index} className='flex items-center gap-2'>
            <Controller
              name={`custom_specifications.${index}.name`}
              control={control}
              rules={{
                required: 'Specification name is required!',
              }}
              render={(field) => (
                <Input
                  label='Specification Name'
                  placeholder='e.g., Battery Life, Weight, Material'
                  {...field}
                />
              )}
            />
            <Controller
              name={`custom_specifications.${index}.value`}
              control={control}
              rules={{
                required: 'Value is required!',
              }}
              render={(field) => (
                <Input
                  label='Value'
                  placeholder='e.g., 4000mAh, 1.5kg, Plastic'
                  {...field}
                />
              )}
            />
            <button
              type='button'
              className='text-red-500 hover:text-red-700'
              onClick={() => remove(index)}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        <button
          type='button'
          className='flex items-center gap-2 text-blue-500 hover:text-blue-600'
          onClick={() =>
            append({
              name: '',
              value: '',
            })
          }
        >
          <PlusCircleIcon size={20} /> Add Specification
        </button>
      </div>
    </div>
  );
};

export default CustomSpecifications;
