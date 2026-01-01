import { Pencil, WandSparkles, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

const ImagePlaceholder = ({
  size,
  small,
  onImageChange,
  onRemove,
  defaultImage = null,
  index = null,
  setOpenImageModal,
  setSelectedImage,
  images,
  pictureUploadingLoader,
}: {
  size: string;
  small?: boolean;
  onImageChange: (file: File | null, index: number) => void;
  onRemove: (index: number) => void;
  defaultImage?: string | null;
  setOpenImageModal: (openImageModal: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  index?: any;
  setSelectedImage: (e: string) => void;
  images: any;
    pictureUploadingLoader: boolean;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onImageChange(file, index);
    }
  };

  return (
    <div
      className={`relative ${small ? 'h-[180px]' : 'h-[450px]'} flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-600 bg-[#1e1e1e]`}
    >
      <input
        type='file'
        accept='image/*'
        className='hidden'
        id={`image-upload-${index}`}
        onChange={handleFileChange}
      />
      {imagePreview ? (
        <>
          <button
            type='button'
            disabled={pictureUploadingLoader}
            onClick={() => onRemove?.(index)}
            className='absolute right-3 top-3 rounded-lg bg-red-600 p-2 shadow-lg'
          >
            <X size={16} />
          </button>
          <button
            disabled={pictureUploadingLoader}
            className='bg-blue-5000 absolute right-[70px] top-3 rounded-lg p-2 shadow-lg'
            onClick={() => {
              setOpenImageModal(true);
              setSelectedImage(images[index].file_url);
            }}
          >
            <WandSparkles size={16} />
          </button>
        </>
      ) : (
        <label
          className='absolute right-3 top-3 cursor-pointer rounded-lg bg-slate-700 p-2 shadow-lg'
          htmlFor={`image-upload-${index}`}
        >
          <Pencil size={16} />
        </label>
      )}

      {imagePreview ? (
        <Image
          width={400}
          height={300}
          src={imagePreview}
          alt='uploaded'
          className='h-full w-full rounded-lg object-cover'
        />
      ) : (
        <>
          <p
            className={`text-gray-400 ${small ? 'text-xl' : 'text-4xl'} font-semibold`}
          >
            {size}
          </p>
          <p
            className={`text-gray-500 ${small ? 'text-sm' : 'text-lg'} pt-2 text-center`}
          >
            Please choose an image <br />
            according to the expected ratio
          </p>
        </>
      )}
    </div>
  );
};

export default ImagePlaceholder;
