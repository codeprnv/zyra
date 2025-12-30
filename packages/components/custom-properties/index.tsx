import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import Input from '../input';

const CustomProperties = ({ control, errors }: any) => {
  const [properties, setProperties] = useState<
    {
      label: string;
      values: string[];
    }[]
  >([]);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  return (
    <div>
      <div className='flex flex-col gap-3'>
        <Controller
          name={'customProperties'}
          control={control}
          render={({ field }) => {
            useEffect(() => {
              field.onChange(properties);
            }, [properties]);

            const addProperty = () => {
              if (!newLabel.trim()) return;
              setProperties([...properties, { label: newLabel, values: [] }]);
              setNewLabel('');
            };

            const addValue = (index: number) => {
              if (!newValue.trim()) return;
              const updatedProperties = [...properties];
              updatedProperties[index].values.push(newValue);
              setProperties(updatedProperties);
              setNewValue('');
            };

            const removeProperty = (index: number) => {
              setProperties(properties.filter((_, i) => i !== index));
            };

            return (
              <div className='mt-2'>
                <label className='mb-1 block font-semibold text-gray-300'>
                  Custom Properties
                </label>
                <div className='flex flex-col gap-3'>
                  {/* Existing Properties */}
                  {properties.map((property, index) => (
                    <div
                      key={index}
                      className='rounded-lg border border-gray-700 bg-gray-900 p-3'
                    >
                      <div className='flex items-center justify-between'>
                        <span className='font-medium text-white'>
                          {property.label}
                        </span>
                        <button
                          type='button'
                          onClick={() => removeProperty(index)}
                        >
                          <X size={18} className='text-red-500' />
                        </button>
                      </div>

                      {/* Add values to the property */}
                      <div className='mt-2 flex items-center gap-2'>
                        <input
                          type='text'
                          className='w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none'
                          placeholder='Enter value...'
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                        />
                        <button
                          type='button'
                          className='rounded-md bg-blue-500 px-3 py-1 text-white'
                          onClick={() => addValue(index)}
                        >
                          Add
                        </button>
                      </div>

                      {/* Show values */}
                      <div className='mt-2 flex flex-wrap gap-2'>
                        {property.values.map((value, i) => (
                          <span
                            key={i}
                            className='rounded-md bg-gray-700 px-2 py-1 text-white'
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className='mt-1 flex items-center gap-2'>
                    <Input
                      placeholder='Enter property label (e.g., Material, Warranty)'
                      value={newLabel}
                      onChange={(e: any) => setNewLabel(e.target.value)}
                    />
                    <button
                      type='button'
                      className='flex items-center justify-center rounded-md bg-blue-500 px-3 py-2 text-white'
                      onClick={addProperty}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                {errors.customProperties && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.customProperties.message as string}
                  </p>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default CustomProperties;
