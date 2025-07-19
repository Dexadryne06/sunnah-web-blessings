
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/use-analytics';

export const AnalyticsTracker = () => {
  const { trackClick } = useAnalytics();
  const location = useLocation();

  useEffect(() => {
    // Non tracciare nella dashboard per evitare chiamate API eccessive
    if (location.pathname === '/dashboard') {
      console.log('📊 Analytics disabled for dashboard');
      return;
    }

    console.log('📊 Analytics enabled for:', location.pathname);

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const elementText = target.textContent?.trim() || '';
      const elementId = target.id || '';
      const tagName = target.tagName.toLowerCase();
      const className = target.className || '';
      
      let metadata: Record<string, any> = {
        tagName,
        className,
        href: tagName === 'a' ? (target as HTMLAnchorElement).href : undefined
      };

      if (elementText.includes('Yusuf')) {
        metadata.specialElement = 'yusuf_credit';
      }
      
      if (elementText.includes('Scarica PDF')) {
        metadata.specialElement = 'pdf_download';
      }

      if (target.closest('[data-track]')) {
        const trackElement = target.closest('[data-track]') as HTMLElement;
        metadata.trackingId = trackElement.getAttribute('data-track');
      }

      trackClick(elementText, elementId, metadata);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackClick, location.pathname]);

  return null;
};
