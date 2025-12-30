import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

const defaultColors = [
  '#000000',
  '#ffffff',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
];

const ColorSelector = ({ control, errors }: any) => {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState('#ffffff');
  return (
    <div className='mt-2'>
      <label className='mb-1 block font-semibold text-gray-300'>Colors</label>
      <Controller
        name='colors'
        control={control}
        render={({ field }) => (
          <div className='flex flex-wrap gap-3'>
            {[...defaultColors, ...customColors].map((color) => {
              const isSelected = (field.value || []).includes(color);
              const isLightColor = ['#ffffff', '#ffff00'].includes(color);

              return (
                <button
                  type='button'
                  key={color}
                  onClick={() =>
                    field.onChange(
                      isSelected
                        ? field.value.filter((c: string) => c !== color)
                        : [...(field.value || []), color]
                    )
                  }
                  className={`my-1 flex h-7 w-7 items-center justify-center rounded-md border-2 pt-2 transition ${isSelected ? 'scale-110 border-white' : 'border-transparent'} ${isLightColor ? 'border-gray-600' : ''}`}
                  style={{ backgroundColor: color }}
                />
              );
            })}

            {/* Add new color */}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              type='button'
              className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-500 bg-gray-800 transition hover:bg-gray-700'
            >
              <Plus size={16} color='white' />
            </button>

            {/* Color Picker */}
            {showColorPicker && (
              <div className='relative flex items-center gap-2'>
                <input
                  type='color'
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className='h-10 w-10 cursor-pointer border-none p-0'
                />
                <button
                  type='button'
                  onClick={() => {
                    setCustomColors([...customColors, newColor]);
                    setShowColorPicker(false);
                  }}
                  className='rounded-md bg-gray-700 px-3 py-1 text-sm text-white'
                >
                  Add
                </button>
              </div>
            )}
          </div>
        )}
      ></Controller>
    </div>
  );
};

export default ColorSelector;
