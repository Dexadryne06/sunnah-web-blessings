import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

// Generate unique session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
};

// Get or create session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

interface AnalyticsEvent {
  eventType: string;
  eventName: string;
  elementText?: string;
  elementId?: string;
  metadata?: Record<string, any>;
}

export const useAnalytics = () => {
  const location = useLocation();
  const sessionId = useRef(getSessionId());
  const sessionStartTime = useRef(Date.now());
  const clickCount = useRef(0);
  const pageViews = useRef(new Set<string>());

  // Track page view
  useEffect(() => {
    const pageUrl = location.pathname + location.search;
    pageViews.current.add(pageUrl);
    
    trackEvent({
      eventType: 'page_view',
      eventName: 'Page Viewed',
      metadata: {
        page: pageUrl,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      }
    });

    // Update session with new page
    updateSession();
  }, [location]);

  // Track session end on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      endSession();
    };
  }, []);

  const trackEvent = async (event: AnalyticsEvent) => {
    try {
      await supabase.from('analytics_events').insert({
        event_type: event.eventType,
        event_name: event.eventName,
        user_session: sessionId.current,
        page_url: location.pathname,
        element_text: event.elementText,
        element_id: event.elementId,
        metadata: event.metadata,
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackClick = (elementText?: string, elementId?: string, metadata?: Record<string, any>) => {
    clickCount.current++;
    trackEvent({
      eventType: 'click',
      eventName: 'Element Clicked',
      elementText,
      elementId,
      metadata: {
        ...metadata,
        clickCount: clickCount.current,
        timestamp: new Date().toISOString()
      }
    });
    updateSession();
  };

  const trackDownload = (fileName: string, downloadUrl: string) => {
    trackEvent({
      eventType: 'download',
      eventName: 'File Downloaded',
      metadata: {
        fileName,
        downloadUrl,
        timestamp: new Date().toISOString()
      }
    });
  };

  const trackInteraction = (interactionType: string, details?: Record<string, any>) => {
    trackEvent({
      eventType: 'interaction',
      eventName: interactionType,
      metadata: {
        ...details,
        timestamp: new Date().toISOString()
      }
    });
  };

  const updateSession = async () => {
    try {
      // Silently fail analytics - don't block the app
      const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      
      await supabase.from('user_sessions').upsert({
        session_id: sessionId.current,
        pages_visited: pageViews.current.size,
        total_clicks: clickCount.current,
        duration_seconds: duration,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'session_id'
      });
    } catch (error) {
      // Silent fail - analytics should never block the app
    }
  };

  const endSession = async () => {
    try {
      // Silently fail analytics - don't block the app
      const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      
      await supabase.from('user_sessions').update({
        end_time: new Date().toISOString(),
        duration_seconds: duration,
        pages_visited: pageViews.current.size,
        total_clicks: clickCount.current,
        updated_at: new Date().toISOString()
      }).eq('session_id', sessionId.current);
    } catch (error) {
      // Silent fail - analytics should never block the app
    }
  };

  return {
    trackEvent,
    trackClick,
    trackDownload,
    trackInteraction
  };
};

// Helper function to get client IP (simplified)
const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
};