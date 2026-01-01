import { Controller } from 'react-hook-form';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SizeSelector = ({ control, errors }: any) => {
  return (
    <div className='mt-2'>
      <label className='mb-1 block font-semibold text-gray-300'>Sizes</label>
      <Controller
        name='sizes'
        control={control}
        render={({ field }) => (
          <div className='flex flex-wrap gap-2' >
            {sizes.map((size) => {
              const isSelected = (field.value || []).includes(size);

              return (
                <button
                  type='button'
                  key={size}
                  onClick={() =>
                    field.onChange(
                      isSelected
                        ? field.value.filter((s: string) => s !== size)
                        : [...(field.value || []), size]
                    )
                  }
                  className={`font-Poppins rounded-lg px-3 py-1 transition-colors ${isSelected ? 'border border-[#fffffff6b] bg-gray-700 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      />
      {errors.sizes && (
        <p className='mt-1 text-xs text-red-500'>
          {errors.sizes.message as string}
        </p>
      )}
    </div>
  );
};

export default SizeSelector