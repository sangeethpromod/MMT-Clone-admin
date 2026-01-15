

interface CurrentItem {
  hostName?: string;
  travellerName?: string;
  storyTitle?: string;
}

interface HeaderProps {
  activePage?: string;
  currentItem?: CurrentItem;
}

function Header({ activePage = 'dashboard', currentItem }: HeaderProps) {
  const getPageInfo = () => {
    switch (activePage) {
      case 'hosts':
        return { title: 'Hosts', breadcrumb: ['User Management', 'Hosts'] };
      case 'travellers':
        return { title: 'Travellers', breadcrumb: ['User Management', 'Travellers'] };
      case 'approvals-hosts':
        return { title: 'Host Approval', breadcrumb: ['Approvals', 'Host Approval'] };
      case 'approvals-stories':
        return { title: 'Story Approval', breadcrumb: ['Approvals', 'Story Approval'] };
      case 'stories':
        return { title: 'Stories', breadcrumb: ['Stories'] };
      case 'bookings':
        return { title: 'Bookings', breadcrumb: ['Bookings'] };
      case 'host-details':
        return { title: currentItem?.hostName || 'Host Details', breadcrumb: ['User Management', 'Hosts', currentItem?.hostName || 'Details'] };
      case 'traveller-details':
        return { title: currentItem?.travellerName || 'Traveller Details', breadcrumb: ['User Management', 'Travellers', currentItem?.travellerName || 'Details'] };
      case 'story-details':
        return { title: currentItem?.storyTitle || 'Story Details', breadcrumb: ['Stories', currentItem?.storyTitle || 'Details'] };
      case 'dashboard':
      default:
        return { title: 'Dashboard', breadcrumb: ['Dashboard'] };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className='w-full h-[6vh] bg-white border-b flex justify-between items-center border-[#e4e4e4] px-4'>
      {/* Breadcrumb */}
      <div className='flex items-center gap-2 text-sm'>
        <span className='text-black font-semibold'>Offbeat</span>
        {pageInfo.breadcrumb.map((crumb, index) => (
          <span key={index} className='flex items-center'>
            <span className='text-gray-400'>/</span>
            <span className={index === pageInfo.breadcrumb.length - 1 ? 'text-gray-600 ml-2' : 'text-black font-semibold ml-2'}>{crumb}</span>
          </span>
        ))}
      </div>

    </div>
  )
}

export default Header
