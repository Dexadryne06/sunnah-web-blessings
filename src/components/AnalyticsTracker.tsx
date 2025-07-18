import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

export const AnalyticsTracker = () => {
  const { trackClick } = useAnalytics();

  useEffect(() => {
    // Track all clicks on the page
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const elementText = target.textContent?.trim() || '';
      const elementId = target.id || '';
      const tagName = target.tagName.toLowerCase();
      const className = target.className || '';
      
      // Get more specific info for buttons and links
      let metadata: Record<string, any> = {
        tagName,
        className,
        href: tagName === 'a' ? (target as HTMLAnchorElement).href : undefined
      };

      // Special tracking for specific elements
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
  }, [trackClick]);

  return null;
};