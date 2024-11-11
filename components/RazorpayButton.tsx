import React, { useEffect, useRef } from 'react';

interface RazorpayButtonProps {
  buttonId: string;
  userId?: string;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({ buttonId, userId }) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    (window as any).onRazorpayModalClose = () => {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    };

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.async = true;
    script.dataset.payment_button_id = buttonId;
    script.dataset.modal_closing_behavior = "onRazorpayModalClose";
    if (userId) {
      script.dataset.user_id = userId;
    }
    
    if (formRef.current) {
      formRef.current.appendChild(script);
    }

    return () => {
      if (formRef.current && script.parentNode === formRef.current) {
        formRef.current.removeChild(script);
      }
      delete (window as any).onRazorpayModalClose;
    };
  }, [buttonId, userId]);

  return <form ref={formRef}></form>;
};

export default RazorpayButton;