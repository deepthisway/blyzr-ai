'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Monitor, 
  Sparkles, 
  MoreVertical,
  Home
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

interface ChatHeaderProps {
  projectId?: string
  title?: string
  showBackButton?: boolean
  showProjectInfo?: boolean
}

type Theme = 'light' | 'dark' | 'system'

const ChatHeader = ({ 
  projectId, 
  title, 
  showBackButton = true, 
  showProjectInfo = true 
}: ChatHeaderProps) => {
  const router = useRouter()
  const trpc = useTRPC()
  const [theme, setTheme] = useState<Theme>('system')

  // Fetch project data if projectId is provided
  const { data: project } = projectId ? useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  ) : { data: null }

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'system'
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(newTheme)
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const handleBackClick = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const handleHomeClick = () => {
    router.push('/')
  }

  const getDisplayTitle = () => {
    if (title) return title
    if (project) return project.name || 'Untitled Project'
    return 'Chat'
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Left section - Back button and title */}
        <div className="flex items-center space-x-4 flex-1">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-semibold leading-none">
                {getDisplayTitle()}
              </h1>
              {showProjectInfo && project && (
                <p className="text-xs text-muted-foreground">
                  {project.description || 'AI Website Builder'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right section - Theme toggle and menu */}
        <div className="flex items-center space-x-2">
          {/* Home button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHomeClick}
            className="h-8 w-8 p-0"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Go to homepage</span>
          </Button>

          {/* Theme toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                {getThemeIcon()}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => handleThemeChange('light')}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More options menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push('/projects')}>
                View All Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/help')}>
                Help & Support
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default ChatHeader
