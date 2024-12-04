import React, { useEffect, useRef } from 'react';

interface RazorpayButtonProps {
  buttonId: string;
  userId?: string;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({ buttonId, userId }) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const callbackName = `razorpayPaymentSuccess_${Math.random().toString(36).slice(2)}`;
    
    (window as any)[callbackName] = () => {
      console.log("Transaction completed - Refreshing page");
      localStorage.removeItem('current_user_id');
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    };

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.async = true;
    script.dataset.payment_button_id = buttonId;
    script.dataset.callback = callbackName;
    
    if (userId) {
      script.dataset.user_id = userId;
    }
    
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('referrerpolicy', 'origin');
    
    if (formRef.current) {
      formRef.current.appendChild(script);
    }

    return () => {
      if (formRef.current && script.parentNode === formRef.current) {
        formRef.current.removeChild(script);
      }
      delete (window as any)[callbackName];
    };
  }, [buttonId, userId]);

  return <form ref={formRef}></form>;
};

export default RazorpayButton;