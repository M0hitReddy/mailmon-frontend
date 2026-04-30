import { useEffect, useRef } from 'react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleLogin({ onSuccess, isDark }) {
  const btnRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          onSuccess(response.credential);
        },
        ux_mode: 'popup',
      });
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: isDark ? 'outline' : 'filled_black',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: 356, // to match max-w of the box roughly
      });
    };
    document.body.appendChild(script);
    return () => script.remove();
  }, [onSuccess, isDark]);

  return <div ref={btnRef} className="flex justify-center" />;
}
