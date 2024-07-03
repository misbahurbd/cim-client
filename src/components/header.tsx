import { navItems } from '@/constants'
import { cn } from '@/lib/utils'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/redux/hooks'
import { logOut } from '@/redux/features/auth/auth-slice'
import { toast } from 'sonner'
import { ExitIcon, TextAlignLeftIcon } from '@radix-ui/react-icons'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'

interface HeaderProps {
  role: 'buyer' | 'seller'
}

const Header: React.FC<HeaderProps> = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useAppDispatch()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logOut())
    toast.success('Logout successful')
  }

  return (
    <nav className='h-12 z-20 border-b backdrop-blur-sm bg-background/90 border-secondary flex gap-3 items-center px-4 fixed w-full top-0 shadow-sm'>
      <Sheet
        open={isOpen}
        onOpenChange={(open) => setIsOpen(open)}>
        <SheetTrigger
          className='lg:hidden'
          asChild>
          <Button
            type='button'
            size='icon'
            variant='ghost'>
            <TextAlignLeftIcon className='w-7 h-7' />
          </Button>
        </SheetTrigger>
        <SheetContent
          side='left'
          className='p-4 w-full !max-w-[300px]'>
          <SheetHeader>
            <SheetTitle className='text-start font-bold text-2xl'>CIM</SheetTitle>
          </SheetHeader>
          <ul className='mt-4'>
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== '/' && location.pathname.startsWith(item.to))

              if (!item.role.includes(role)) return null

              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'px-3 py-2 group relative hover:text-foreground flex gap-2 items-center text-muted-foreground',
                      isActive && 'bg-muted text-foreground',
                    )}>
                    <item.icon />
                    {item.label}
                    <span
                      className={cn(
                        'absolute transition w-0 left-0 bottom-0 top-0 scale-y-0 bg-foreground group-hover:w-1 group-hover:scale-y-100',
                        isActive && 'w-1 scale-y-100',
                      )}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </SheetContent>
      </Sheet>

      <Link
        to='/'
        className='font-extrabold text-2xl '>
        CIM
      </Link>

      <ul className='hidden lg:flex items-center gap-1 ml-8'>
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.to !== '/' && location.pathname.startsWith(item.to))

          if (!item.role.includes(role)) return null

          return (
            <li key={item.label}>
              <Link
                to={item.to}
                className={cn(
                  'px-3 h-12 group relative hover:text-foreground flex gap-2 items-center text-muted-foreground',
                  isActive && 'bg-muted text-foreground',
                )}>
                <item.icon />
                {item.label}
                <span
                  className={cn(
                    'absolute transition w-full left-0 bottom-0 scale-x-0 right-0 h-0 bg-foreground group-hover:h-0.5 group-hover:scale-x-100',
                    isActive && 'h-0.5 scale-x-100',
                  )}
                />
              </Link>
            </li>
          )
        })}
      </ul>

      <div className='ml-auto'>
        <Button onClick={() => handleLogout()}>
          <ExitIcon className='sm:mr-2' />
          <span className='hidden sm:inline'>Logout</span>
        </Button>
      </div>
    </nav>
  )
}

export default Header
