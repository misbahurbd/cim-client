import { SetURLSearchParams } from 'react-router-dom'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

interface ClientPaginationProps {
  currentPage: number
  totalPages: number
  searchParams: URLSearchParams
  setSearchParams: SetURLSearchParams
}

const ClientPagination: React.FC<ClientPaginationProps> = ({
  currentPage,
  totalPages,
  searchParams,
  setSearchParams,
}) => {
  const pageNumbers = []
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  const handlePaginate = (page: number) => {
    searchParams.set('page', page.toString())
    setSearchParams(searchParams)
  }

  if (pageNumbers.length == 0) {
    return null
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              'cursor-pointer',
              currentPage === 1 && 'cursor-default pointer-events-none text-muted-foreground',
            )}
            onClick={() => handlePaginate(currentPage - 1)}
          />
        </PaginationItem>
        {pageNumbers[0] !== 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={currentPage === page}
              className={cn(
                'cursor-pointer',
                currentPage === page && 'cursor-default pointer-events-none text-muted-foreground',
              )}
              onClick={() => handlePaginate(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {pageNumbers[pageNumbers.length - 1] !== totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            className={cn(
              'cursor-pointer',
              currentPage === totalPages &&
                'cursor-default pointer-events-none text-muted-foreground',
            )}
            onClick={() => handlePaginate(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default ClientPagination
