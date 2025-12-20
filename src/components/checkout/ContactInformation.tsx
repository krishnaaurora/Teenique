import React from "react";
import Input from "./Input";

type Props = {
  formData: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  onFocus?: (field: string) => void;
  onBlur?: (field: string) => void;
};

const ContactInformation: React.FC<Props> = ({ formData, onChange, onFocus, onBlur }) => {
  return (
    <div className="bg-white rounded-xl p-6 space-y-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">Contact Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          placeholder="First Name"
          required
          value={formData.firstName}
          onChange={onChange}
          onFocus={() => onFocus && onFocus('firstName')}
          onBlur={() => onBlur && onBlur('firstName')}
        />
        <Input
          label="Last Name"
          name="lastName"
          placeholder="Last Name"
          required
          value={formData.lastName}
          onChange={onChange}
          onFocus={() => onFocus && onFocus('lastName')}
          onBlur={() => onBlur && onBlur('lastName')}
        />
      </div>

      <Input
        label="Email Address"
        name="email"
        placeholder="We’ll send order updates to this email"
        type="email"
        required
        value={formData.email}
        onChange={onChange}
        onFocus={() => onFocus && onFocus('email')}
        onBlur={() => onBlur && onBlur('email')}
      />

      <Input
        label="Phone Number"
        name="phone"
        placeholder="For delivery updates and order confirmation"
        type="tel"
        required
        value={formData.phone}
        onChange={onChange}
        onFocus={() => onFocus && onFocus('phone')}
        onBlur={() => onBlur && onBlur('phone')}
      />
    </div>
  );
};

export default ContactInformation;
