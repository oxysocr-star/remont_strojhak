/**
 * События аналитики согласно ТЗ
 * hero_cta_click, secondary_cta_click
 * tariff_select, calculator_started, calculator_step_completed, calculator_completed
 * case_opened, faq_opened, contact_form_started, contact_form_submitted
 * ai_opened, ai_message_sent, ai_lead_created
 */
export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  console.log(`%c[Analytics] ${eventName}`, 'color: #D5FF00; background: black; padding: 2px 5px; font-weight: bold;', data || {});
  
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({ event: eventName, ...data });
  }
};
