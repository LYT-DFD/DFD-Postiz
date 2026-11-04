import Image from 'next/image';

export const Logo = () => (
  <Image src="/dfd-puppy.png" alt="Dogfood" width={60} height={60}
    className="mt-[8px] min-w-[60px] min-h-[60px] object-contain" priority />
);
