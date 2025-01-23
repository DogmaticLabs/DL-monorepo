import { Navbar, NavbarSection, NavbarSpacer } from '@/components/catalyst/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/catalyst/sidebar'
import { SidebarLayout } from '@/components/catalyst/sidebar-layout'
import OnboardingTour from '@/components/OnboardingTour'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'
import {
  CalendarDaysIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid'
import { useQueryClient } from '@tanstack/react-query'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@workspace/ui/components/breadcrumb'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import _ from 'lodash'
import { BellIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import LoginDialog from '../LoginDialog'

const MainLayout = ({
  title,
  children,
  controls,
  noHeader = false,
}: {
  title?: string
  children: React.ReactNode
  controls?: React.ReactNode
  noHeader?: boolean
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const [showTour, setShowTour] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  // Create breadcrumb items from pathname
  const pathSegments =
    pathname
      ?.split('/')
      .filter(Boolean)
      .map((segment, index, array) => {
        const path = '/' + array.slice(0, index + 1).join('/')
        return (
          <BreadcrumbItem key={path}>
            {index === array.length - 1 ? (
              <BreadcrumbPage>{_.startCase(segment)}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={path}>{_.startCase(segment)}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
        )
      }) ?? []

  const sidebarItems = (
    <>
      <SidebarSection>
        <SidebarItem href='/' current={pathname === '/'} className='w-full justify-start'>
          <HomeIcon className='h-4 w-4' />
          <SidebarLabel>Home</SidebarLabel>
        </SidebarItem>
        <SidebarItem
          href='/schedule'
          current={pathname.startsWith('/schedule')}
          className='w-full justify-start'
        >
          <CalendarDaysIcon className='h-4 w-4' />
          <SidebarLabel>Schedule</SidebarLabel>
        </SidebarItem>
        <SidebarItem
          href='/notifications'
          current={pathname === '/notifications'}
          className='w-full justify-start'
        >
          <BellIcon className='h-4 w-4' />
          <SidebarLabel>Notifications</SidebarLabel>
        </SidebarItem>
      </SidebarSection>

      <SidebarSpacer />

      <SidebarSection>
        <SidebarItem href='/about' current={pathname === '/about'} className='w-full justify-start'>
          <InformationCircleIcon className='h-4 w-4' />
          <SidebarLabel>About</SidebarLabel>
        </SidebarItem>
        <SidebarItem
          href='/feedback'
          current={pathname === '/feedback'}
          className='w-full justify-start'
        >
          <ChatBubbleOvalLeftEllipsisIcon className='h-4 w-4' />
          <SidebarLabel>Feedback</SidebarLabel>
        </SidebarItem>
        <SidebarItem onClick={() => setShowTour(true)} className='w-full justify-start'>
          <QuestionMarkCircleIcon className='h-4 w-4' />
          <SidebarLabel>Tutorial</SidebarLabel>
        </SidebarItem>
      </SidebarSection>
    </>
  )

  return (
    <>
      <SidebarLayout
        navbar={
          <Navbar>
            <NavbarSpacer />
            <NavbarSection>
              <AccountDropdownMenu variant='default' onLoginClick={() => setLoginModalOpen(true)} />
            </NavbarSection>
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <Button
                variant='ghost'
                className='w-full justify-start'
                onClick={() => router.push('/')}
              >
                <ShieldCheckIcon className='!fill-zinc-950 !h-4 !w-4' />
                <SidebarLabel className='text-zinc-950 font-bold'>Conceal DC</SidebarLabel>
              </Button>
            </SidebarHeader>

            <SidebarBody>{sidebarItems}</SidebarBody>

            <SidebarFooter className='max-lg:hidden'>
              <AccountDropdownMenu variant='sidebar' onLoginClick={() => setLoginModalOpen(true)} />
            </SidebarFooter>
          </Sidebar>
        }
      >
        {!noHeader && (
          <header className='flex flex-col gap-2 border-b border-gray-200 lg:px-6 py-4'>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href='/'>Home</BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.length > 0 && (
                  <>
                    <BreadcrumbSeparator />
                    {pathSegments.map((segment, i) => (
                      <React.Fragment key={`segment-${i}`}>
                        {segment}
                        {i < pathSegments.length - 1 && <BreadcrumbSeparator />}
                      </React.Fragment>
                    ))}
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            <div className='flex flex-col lg:flex-row items-start lg:items-center gap-2 h-18 lg:h-9 justify-between w-full'>
              {title && <h1 className='text-base font-semibold text-gray-900'>{title}</h1>}
              {controls}
            </div>
          </header>
        )}
        <div className='flex-1 overflow-auto'>{children}</div>
      </SidebarLayout>
      <LoginDialog loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen} />
      <OnboardingTour open={showTour} onOpenChange={setShowTour} />
    </>
  )
}

export default MainLayout

function AccountDropdownMenu({
  variant = 'default',
  onLoginClick,
}: {
  variant?: 'default' | 'sidebar'
  onLoginClick: () => void
}) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const queryClient = useQueryClient()

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        setIsLoggedIn(true)
        try {
          const payload = JSON.parse(atob(token.split('.')[1] ?? ''))
          setUserEmail(payload.sub)
        } catch (e) {
          console.error('Error decoding token:', e)
        }
      } else {
        setIsLoggedIn(false)
        setUserEmail('')
      }
    }

    checkAuthStatus()
    window.addEventListener('storage', checkAuthStatus)
    window.addEventListener('authStateChange', checkAuthStatus)

    return () => {
      window.removeEventListener('storage', checkAuthStatus)
      window.removeEventListener('authStateChange', checkAuthStatus)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.dispatchEvent(new Event('authStateChange'))
    toast.success('Logged out successfully')
    queryClient.clear()
    router.push('/')
  }

  const buttonContent = (
    <span className='flex flex-col items-start flex-1 w-full'>
      <div className='flex items-center gap-2'>
        <UserCircleIcon className='h-4 w-4' />
        <span className='truncate text-sm/5 font-medium'>
          {isLoggedIn ? userEmail.split('@')[0] : 'Sign In'}
        </span>
      </div>
      {isLoggedIn && (
        <span className='block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400'>
          {userEmail}
        </span>
      )}
    </span>
  )

  return isLoggedIn ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-12 justify-between hover:bg-zinc-200'>
          {buttonContent}
          <ChevronUpIcon className='ml-auto h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align={variant === 'sidebar' ? 'start' : 'end'}>
        {/* <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/account')}>
          <UserCircleIcon className='mr-2 h-4 w-4' />
          Account
        </DropdownMenuItem> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
          <ArrowRightStartOnRectangleIcon className='mr-2 h-4 w-4' />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button variant='ghost' className='h-12 justify-between' onClick={onLoginClick}>
      {buttonContent}
    </Button>
  )
}
