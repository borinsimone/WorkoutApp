'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';
import styles from './styles/layout.module.scss';

const tabs = [
  {
    id: 'dashboard',
    label: 'Panoramica',
    href: '/tab/dashboard',
    icon: (
      <svg
        viewBox='0 0 24 24'
        aria-hidden='true'
      >
        <path d='M3 10.7 12 3l9 7.7V21h-6.3v-6.3h-5.4V21H3z' />
      </svg>
    ),
  },
  {
    id: 'workout',
    label: 'Allenamenti',
    href: '/tab/workout',
    icon: (
      <svg
        viewBox='0 0 24 24'
        aria-hidden='true'
      >
        <path d='M2.5 10.5h3V7.6a2.1 2.1 0 1 1 4.2 0v8.8a2.1 2.1 0 1 1-4.2 0v-2.9h-3zM18.5 10.5h3v2.9h-3v2.9a2.1 2.1 0 1 1-4.2 0V7.6a2.1 2.1 0 1 1 4.2 0zM8.2 10.5h7.6v2.9H8.2z' />
      </svg>
    ),
  },
  {
    id: 'community',
    label: 'Comunità',
    href: '/tab/community',
    icon: (
      <svg
        viewBox='0 0 24 24'
        aria-hidden='true'
      >
        <path d='M6.2 11.7a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2m11.6 0a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2M12 12.9a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2M2.8 20.8c0-3 1.9-5.2 4.4-5.2s4.4 2.2 4.4 5.2M12 20.8c0-3.3 2.1-5.8 5-5.8s5 2.5 5 5.8' />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Impostazioni',
    href: '/tab/settings',
    icon: (
      <svg
        viewBox='0 0 24 24'
        aria-hidden='true'
      >
        <path d='m21.7 14.2-1.7.3a7.9 7.9 0 0 1-.8 1.9l1 1.4a1 1 0 0 1-.1 1.2l-1.5 1.5a1 1 0 0 1-1.2.1l-1.4-1a7.9 7.9 0 0 1-1.9.8l-.3 1.7a1 1 0 0 1-1 .8h-2.1a1 1 0 0 1-1-.8l-.3-1.7a7.9 7.9 0 0 1-1.9-.8l-1.4 1a1 1 0 0 1-1.2-.1L3.9 19a1 1 0 0 1-.1-1.2l1-1.4a7.9 7.9 0 0 1-.8-1.9l-1.7-.3a1 1 0 0 1-.8-1v-2.1a1 1 0 0 1 .8-1l1.7-.3c.2-.7.5-1.3.8-1.9l-1-1.4a1 1 0 0 1 .1-1.2L5.4 2.8a1 1 0 0 1 1.2-.1l1.4 1c.6-.3 1.2-.6 1.9-.8l.3-1.7a1 1 0 0 1 1-.8h2.1a1 1 0 0 1 1 .8l.3 1.7c.7.2 1.3.5 1.9.8l1.4-1a1 1 0 0 1 1.2.1L20.1 4a1 1 0 0 1 .1 1.2l-1 1.4c.3.6.6 1.2.8 1.9l1.7.3a1 1 0 0 1 .8 1v2.1a1 1 0 0 1-.8 1M12 15.8a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6' />
      </svg>
    ),
  },
] as const;

export default function TabLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTabId = pathname.split('/')[2] ?? 'workout';
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTabId),
  );

  return (
    <section className={styles.home}>
      <div className={styles.phoneShell}>
        <div className={styles.phoneGradient} />

        <div className={styles.tabContent}>{children}</div>

        <nav
          className={`${styles.bottomNav} workout-bottom-nav`}
          aria-label='Navigazione principale'
          style={{ '--active-index': activeIndex } as CSSProperties}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;

            return (
              <button
                key={tab.id}
                type='button'
                className={`${styles.navItem} ${isActive ? styles.isActive : ''}`}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                aria-pressed={isActive}
                onClick={() => router.push(tab.href)}
              >
                {tab.icon}
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
