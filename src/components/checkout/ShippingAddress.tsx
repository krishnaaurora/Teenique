import React from "react";
import Input from "./Input";

type Props = {
  formData: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  onFocus?: (field: string) => void;
  onBlur?: (field: string) => void;
};

const ShippingAddress: React.FC<Props> = ({ formData, onChange, onFocus, onBlur }) => {
  return (
    <div className="bg-white rounded-xl p-6 space-y-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">Shipping Address</h2>

      <Input
        label="Flat / House No"
        name="flat"
        placeholder="Flat / House No"
        required
        value={formData.flat}
        onChange={onChange}
        onFocus={() => onFocus && onFocus('flat')}
        onBlur={() => onBlur && onBlur('flat')}
      />
      <Input
        label="Street / Area"
        name="street"
        placeholder="Street / Area"
        required
        value={formData.street}
        onChange={onChange}
        onFocus={() => onFocus && onFocus('street')}
        onBlur={() => onBlur && onBlur('street')}
      />
      <Input
        label="Landmark"
        name="landmark"
        placeholder="Landmark (optional)"
        value={formData.landmark}
        onChange={onChange}
        onFocus={() => onFocus && onFocus('landmark')}
        onBlur={() => onBlur && onBlur('landmark')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="City"
          name="city"
          placeholder="City"
          required
          value={formData.city}
          onChange={onChange}
          onFocus={() => onFocus && onFocus('city')}
          onBlur={() => onBlur && onBlur('city')}
        />

        <div>
          <label className="block text-sm text-gray-700 mb-1">State *</label>
          <select
            name="state"
            value={formData.state}
            onChange={onChange}
            onFocus={() => onFocus && onFocus('state')}
            onBlur={() => onBlur && onBlur('state')}
            className="w-full px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Select State</option>
            <option value="Telangana">Telangana</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Maharashtra">Maharashtra</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="PIN Code"
          name="pincode"
          placeholder="For accurate delivery"
          required
          value={formData.pincode}
          onChange={onChange}
          onFocus={() => onFocus && onFocus('pincode')}
          onBlur={() => onBlur && onBlur('pincode')}
        />
        <Input label="Country" placeholder="India" value={"India"} disabled />
      </div>
    </div>
  );
};

export default ShippingAddress;
