import React from "react";
import ContactInformation from "./ContactInformation";
import ShippingAddress from "./ShippingAddress";

type Props = {
  formData: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  onFocus?: (field: string) => void;
  onBlur?: (field: string) => void;
};

const CheckoutForm: React.FC<Props> = ({ formData, onChange, onFocus, onBlur }) => {
  return (
    <div className="w-full max-w-[680px] space-y-8">
      <ContactInformation formData={formData} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
      <ShippingAddress formData={formData} onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
    </div>
  );
};

export default CheckoutForm;
