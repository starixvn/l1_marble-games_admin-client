'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'
import type { ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          error: '!text-red-500 !border-red-500/20',
          success: '!text-green-500 !border-green-500/20',
          warning: '!text-yellow-500 !border-yellow-500/20',
          info: '!text-blue-500 !border-blue-500/20',
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--error-text': '#ef4444',
          '--success-text': '#22c55e',
          '--warning-text': '#eab308',
          '--info-text': '#3b82f6',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
