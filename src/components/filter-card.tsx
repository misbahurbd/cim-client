import { CaretSortIcon } from '@radix-ui/react-icons'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface FilterCardProps {
  label: string
  children: React.ReactNode
}

const FilterCard: React.FC<FilterCardProps> = ({ label, children }) => {
  return (
    <Collapsible className='border rounded'>
      <CollapsibleTrigger
        className='cursor-pointer select-none'
        asChild>
        <div className='flex items-center justify-between px-2 py-1'>
          <span>{label}</span>
          <CaretSortIcon className='h-4 w-4' />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className='px-2 border-t-[1px] py-1.5 max-h-[260px] overflow-y-auto'>
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default FilterCard
