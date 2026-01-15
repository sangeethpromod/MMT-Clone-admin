"use client"

import { ReactNode } from 'react';
import Sidebar from '@/components/template/sidebar';
import Header from '@/components/template/header';

interface DashboardLayoutProps {
  children: ReactNode;
  activePage?: string;
  onNavigate?: (page: string) => void;
  currentItem?: any;
}

function DashboardLayout({ children, activePage, onNavigate, currentItem }: DashboardLayoutProps) {
  return (
    <div className='w-screen h-screen flex'>
      <Sidebar onNavigate={onNavigate} activePage={activePage} />
      <div className='flex-1 flex flex-col'>
        <Header activePage={activePage} currentItem={currentItem} />
        <div className='flex-1 flex overflow-hidden'>
          <main className='flex-1 overflow-y-auto scrollbar-thin'>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
