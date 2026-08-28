import JoinGroup from '@/components/groups/Join'
import Image from 'next/image'
import Link from 'next/link'

export default function JoinGroupPage () {
  return (
    <div className='p-6 max-w-4xl mx-auto my-[10vh]'>
      <Link href='/groups' className='fixed top-4 left-4 z-50'>
        <Image
          src='/images/LOGO06.png'
          alt='Logo Execo'
          width={200}
          height={100}
          className='cursor-pointer transition-transform hover:scale-105'
        />
      </Link>

      <JoinGroup />
    </div>
  )
}
