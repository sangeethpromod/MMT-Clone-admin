"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import DashboardLayout from "@/components/layout/layout";
import DashboardContent from "./pages/dashboard";
import HostUserList from "./pages/hostUser";
import HostApproval from "./pages/hostApproval";
import StoryApproval from "./pages/storyApproval";
import TravellerUser from "./pages/travellerUser";
import BookingList from "./pages/bookingList";
import Stories from "./pages/stories";
import StoryDetails from "./pages/stroyDetails";
import TravellerDetails from "./pages/travellerDetails";
import HostDetails from "./pages/hostDetails";
import FeeList from "./pages/commisionList";
import FeeCreate from "./pages/feeCreate";
import FeeEdit from "./pages/feeEdit";
import TransactionList from "./pages/transactionList";
import TransactionDetails from "./pages/transactionDetails";

type CurrentItemData = 
  | { storyId: string }
  | { userId: string }
  | { feeId: string }
  | { razorpayOrderId: string }
  | null;

function DashboardPage() {  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthChecked } = useSelector((state: RootState) => state.auth);
  
  // Initialize state from URL params or localStorage
  const [activePage, setActivePage] = useState<string>(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) return pageParam;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activePage') || 'dashboard';
    }
    return 'dashboard';
  });
  
  const [currentItem, setCurrentItem] = useState<CurrentItemData>(() => {
    const storyIdParam = searchParams.get('storyId');
    const hostIdParam = searchParams.get('hostId');
    const userIdParam = searchParams.get('userId');
    const travellerIdParam = searchParams.get('travellerId');
    const feeIdParam = searchParams.get('feeId');
    
    if (storyIdParam) return { storyId: storyIdParam };
    if (hostIdParam) return { userId: hostIdParam };
    if (userIdParam) return { userId: userIdParam };
    if (travellerIdParam) return { userId: travellerIdParam };
    if (feeIdParam) return { feeId: feeIdParam };
    
    if (typeof window !== 'undefined') {
      const savedItem = localStorage.getItem('currentItem');
      if (savedItem) {
        try {
          return JSON.parse(savedItem) as CurrentItemData;
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const getSidebarActive = (page: string) => {
    switch (page) {
      case 'traveller-details':
        return 'travellers';
      case 'host-details':
        return 'hosts';
      case 'story-details':
        return 'stories';
      case 'transaction-details':
        return 'transactions';
      case 'fee-create':
        return 'commission-model';
      case 'fee-edit':
        return 'commission-model';
      default:
        return page;
    }
  };

  // Sync to localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activePage', activePage);
      localStorage.setItem('currentItem', JSON.stringify(currentItem));
    }
  }, [activePage, currentItem]);

  const handleNavigate = (page: string, data?: unknown) => {
    let itemData: CurrentItemData = null;
    
    if (data && typeof data === 'object') {
      if ('storyId' in data && typeof data.storyId === 'string') {
        itemData = { storyId: data.storyId };
      } else if ('userId' in data && typeof data.userId === 'string') {
        itemData = { userId: data.userId };
      } else if ('feeId' in data && typeof data.feeId === 'string') {
        itemData = { feeId: data.feeId };
      } else if ('razorpayOrderId' in data && typeof data.razorpayOrderId === 'string') {
        itemData = { razorpayOrderId: data.razorpayOrderId };
      } else if ('userID' in data && typeof data.userID === 'string') {
        itemData = { userId: data.userID };
      }
    } else if (typeof data === 'string') {
      itemData = { userId: data };
    }
    
    setActivePage(page);
    setCurrentItem(itemData);
    
    const params = new URLSearchParams();
    params.set('page', page);
    if (itemData) {
      if ('storyId' in itemData) params.set('storyId', itemData.storyId);
      if ('userId' in itemData) params.set('userId', itemData.userId);
      if ('feeId' in itemData) params.set('feeId', itemData.feeId);
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  const sidebarActive = getSidebarActive(activePage);

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardContent />;
      case 'hosts':
        return <HostUserList onNavigate={handleNavigate} />;
      case 'host-approval':
        return <HostApproval />;
      case 'stories':
        return <Stories onNavigate={handleNavigate} />;
      case 'story-approval':
        return <StoryApproval />;
      case 'travellers':
        return <TravellerUser onNavigate={handleNavigate} />;
      case 'bookings':
        return <BookingList />;
      case 'commission-model':
        return <FeeList onNavigate={handleNavigate} />;
      case 'transactions':
        return <TransactionList onNavigate={handleNavigate} />;
      case 'transaction-details':
        return <TransactionDetails razorpayOrderId={currentItem && 'razorpayOrderId' in currentItem ? currentItem.razorpayOrderId : ''} />;
      case 'host-details':
        return <HostDetails userId={currentItem && 'userId' in currentItem ? currentItem.userId : ''} />;
      case 'traveller-details':
        return <TravellerDetails userId={currentItem && 'userId' in currentItem ? currentItem.userId : ''} />;
      case 'story-details':
        return <StoryDetails storyId={currentItem && 'storyId' in currentItem ? currentItem.storyId : ''} />;
      case 'fee-create':
        return <FeeCreate onNavigate={handleNavigate} />;
      case 'fee-edit':
        return <FeeEdit feeId={currentItem && 'feeId' in currentItem ? currentItem.feeId : ''} onNavigate={handleNavigate} />;
      default:
        return <DashboardContent />;
    }
  };

  if (!isAuthChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2B36]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Please log in to access the dashboard</p>
      </div>
    );
  }

  return (
    <DashboardLayout activePage={sidebarActive} onNavigate={handleNavigate}>
      {renderContent()}
    </DashboardLayout>
  );
}

export default DashboardPage;