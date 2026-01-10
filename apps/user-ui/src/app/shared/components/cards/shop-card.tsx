import { ArrowUpRight, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ShopCardProps {
  shop: {
    id: string;
    name: string;
    description?: string;
    avatar: string;
    coverBanner?: string;
    address?: string;
    followers?: [];
    ratings?: number;
    category?: string;
  };
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  return (
    <div className='w-full cursor-pointer overflow-hidden rounded-md border border-gray-200 bg-white shadow-md transition'>
      {/* Cover Image  */}
      <div className='relative h-[120px] w-full'>
        <Image
          src={
            shop?.coverBanner ||
            'https://ik.imagekit.io/codeprnv/products/206414518_10893159.png'
          }
          alt='Cover image'
          fill
          className='h-full w-full object-cover'
        />
      </div>
      <div className='relative -mt-8 flex justify-center'>
        <div className='h-16 w-16 overflow-hidden rounded-full border-4 border-white shadow-md'>
          <Image
            src={
              shop?.avatar ||
              'https://ik.imagekit.io/codeprnv/products/woman-with-long-brown-hair.jpg?updatedAt=1767619985684'
            }
            alt={shop.name}
            width={64}
            height={64}
            className='object-cover'
          />
        </div>
      </div>
      <div className='px-4 pb-4 pt-2 text-center'>
        <h3 className='text-base font-semibold text-gray-800'>{shop.name}</h3>
        <p className='mt-[0.5] text-xs text-gray-500'>
          {shop?.followers?.length ?? 0} Followers
        </p>
        <div className='mt-2 flex items-center justify-center gap-4 text-xs text-gray-500'>
          {shop.address && (
            <span className='flex max-w-[120px] items-center gap-1'>
              <MapPin className='h-4 w-4 shrink-0' />
              <span className='truncate'>{shop.address}</span>
            </span>
          )}
          <span className='flex items-center gap-1'>
            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
            {shop.ratings ?? 'N/A'}
          </span>
        </div>
        {shop?.category && (
          <div className='mt-3 flex flex-wrap justify-center gap-2 text-xs'>
            <span className='rounded bg-blue-50 px-2 py-0.5 capitalize text-blue-600'>
              {shop.category}
            </span>
          </div>
        )}

        <div className='mt-4'>
          <Link
            href={`/shop/${shop.id}`}
            className='inline-flex items-center text-sm font-medium text-blue-600 transition-colors duration-200 hover:cursor-pointer hover:text-blue-800 hover:underline'
          >
            Visit Shop
            <ArrowUpRight className='ml-1 h-4 w-4' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
