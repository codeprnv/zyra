import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

const BreadCrumbs = ({ title }: { title: string }) => {
  return (
    <div className='flex w-full items-center text-white'>
      <Link href={`/dashboard`} className='cursor-pointer text-blue-400'>
        Dashboard
      </Link>
      <ChevronRight size={20} className='opacity-[0.8]' />
      <span>{title}</span>
    </div>
  );
};

export default BreadCrumbs;
