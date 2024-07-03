/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetURLSearchParams } from 'react-router-dom'
import Sidebar from '@/components/sidebar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { FilterIcon } from 'lucide-react'
import { useState } from 'react'

interface MobileSidebarProps {
  searchParams: URLSearchParams
  setSearchParams: SetURLSearchParams
  products: any
  brands: any
  categories: any
  className?: string
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  searchParams,
  setSearchParams,
  products,
  categories,
  brands,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}>
      <SheetTrigger
        className={className}
        asChild>
        <Button variant='outline'>
          <FilterIcon className='w-4 h-4 sm:mr-2' />
          <span className='hidden sm:inline'>Filter</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='pt-10 overflow-y-auto'>
        <Sidebar
          className='w-full'
          products={products}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          categories={categories}
          brands={brands}
          setIsOpen={setIsOpen}
        />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
