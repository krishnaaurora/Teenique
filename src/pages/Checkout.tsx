import { useState } from "react";
import { products as allProducts } from "@/data/products";
import FashionLayout from "@/components/FashionLayout";
import { useCart } from "@/contexts/CartContext";
import {
  Truck,
  Check,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Gift,
  Shield,
  MessageCircle,
  MapPin,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import locationLib from '@/lib/location';

const INDIA_STATES: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh", "Nagaon"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
  Chhattisgarh: ["Raipur", "Bilaspur", "Durg", "Rajnandgaon"],
  Goa: ["Panaji", "Margao", "Vasco da Gama"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  Haryana: ["Faridabad", "Gurgaon", "Hisar", "Rohtak", "Panipat"],
  "Himachal Pradesh": ["Shimla", "Solan", "Mandi", "Kangra"],
  Jharkhand: ["Ranchi", "Dhanbad", "Giridih", "Bokaro", "Jamshedpur"],
  Karnataka: ["Bangalore", "Mysore", "Mangalore", "Belgaum", "Hubballi"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kannur"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Aurangabad"],
  Manipur: ["Imphal", "Churachandpur"],
  Meghalaya: ["Shillong", "Tura", "Jowai"],
  Mizoram: ["Aizawl", "Lunglei", "Saiha"],
  Nagaland: ["Kohima", "Dimapur"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur"],
  Punjab: ["Chandigarh", "Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  Sikkim: ["Gangtok", "Namchi", "Gyalshing"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruppur"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Khammam"],
  Tripura: ["Agartala", "Udaipur"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut"],
  Uttarakhand: ["Dehradun", "Haridwar", "Nainital", "Almora"],
  "West Bengal": ["Kolkata", "Darjeeling", "Asansol", "Durgapur", "Siliguri"],
  Puducherry: ["Pondicherry", "Yanam", "Karaikal"],
  Ladakh: ["Leh", "Kargil"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Samba"],
};

interface FloatingInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}

const FloatingInput = ({ label, name, type = "text", value, onChange, error, placeholder }: FloatingInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? placeholder : ""}
        className={`
          w-full h-16 px-6 pt-6 pb-2 rounded-full
          text-base font-medium
          transition-all duration-300 ease-out
          outline-none
          ${isFocused || hasValue ? "bg-white" : "bg-gray-50"}
          ${error ? "border-2 border-red-400 shadow-red-100" : isFocused ? "border-2 border-purple-500 shadow-lg shadow-purple-100" : "border-2 border-gray-200"}
        `}
      />
      <label
        className={`
          absolute left-6 transition-all duration-300 ease-out pointer-events-none
          ${isFocused || hasValue ? "top-2 text-xs font-bold text-purple-600" : "top-1/2 -translate-y-1/2 text-gray-400 text-base"}
        `}
      >
        {label}
      </label>
      {error && <p className="text-xs text-red-500 mt-2 ml-4">{error}</p>}
    </div>
  );
};

interface FloatingSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  error?: string;
  disabled?: boolean;
}

const FloatingSelect = ({ label, name, value, onChange, options, error, disabled = false }: FloatingSelectProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className={`
          w-full h-16 px-6 pt-6 pb-2 rounded-full
          text-base font-medium appearance-none cursor-pointer
          transition-all duration-300 ease-out
          outline-none
          ${isFocused || hasValue ? "bg-white" : "bg-gray-50"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${error ? "border-2 border-red-400" : isFocused ? "border-2 border-purple-500 shadow-lg shadow-purple-100" : "border-2 border-gray-200"}
        `}
      >
        <option value="">{""}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <label
        className={`
          absolute left-6 transition-all duration-300 ease-out pointer-events-none
          ${isFocused || hasValue ? "top-2 text-xs font-bold text-purple-600" : "top-1/2 -translate-y-1/2 text-gray-400 text-base"}
        `}
      >
        {label}
      </label>
      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      {error && <p className="text-xs text-red-500 mt-2 ml-4">{error}</p>}
    </div>
  );
};

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [customerNotes, setCustomerNotes] = useState("");
  const [locationLink, setLocationLink] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    promoCode: "",
  });

  const itemCost = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 1500;
  const shippingCost = 0; // Always free shipping
  const promoDiscount = appliedPromo ? 100 : 0;
  const total = itemCost - promoDiscount;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - itemCost);
  const freeShippingProgress = Math.min(100, (itemCost / FREE_SHIPPING_THRESHOLD) * 100);

  const availableStates = formData.country === "India" ? Object.keys(INDIA_STATES) : [];
  const availableCities = formData.state && INDIA_STATES[formData.state] ? INDIA_STATES[formData.state] : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, state: value, city: "" }));
    if (errors.state) setErrors((prev) => ({ ...prev, state: "" }));
  };

  const handleApplyPromo = () => {
    if (formData.promoCode.toUpperCase() === "HAPPY10") {
      setAppliedPromo(true);
      toast.success("🎉 Promo applied! You saved ₹100!");
    } else if (formData.promoCode.trim()) {
      toast.error("Invalid promo code");
    }
  };

  // Generate WhatsApp message with all order and customer details
  const generateWhatsAppMessage = () => {
    // Cart items list with variants
    const itemsList = cart
      .map(
        (item, index) =>
          `Product ${index + 1}: ${item.name}
Variant: ${item.color || 'Default'} | Size: ${item.size || 'M'}
Price: ₹${Math.round(item.price)}
Quantity: ${item.quantity}`
      )
      .join("\n\n");

    // Customer details
    const customerName = formData.firstName || formData.lastName 
      ? `${formData.firstName} ${formData.lastName}`.trim() 
      : "Not provided";

    // Build delivery address
    const deliveryAddress = [
      formData.street,
      formData.city,
      formData.state,
      formData.zip,
      "India"
    ].filter(Boolean).join(", ");

    const message = `Order Request from TEENIQUE

${itemsList}

--------------------------
Subtotal: ₹${Math.round(itemCost)}
Shipping: FREE
Total Payable: ₹${Math.round(total)}
--------------------------

Customer Details:
Name: ${customerName}
Phone: ${formData.phone || "Not provided"}
Email: ${formData.email || "Not provided"}

Customer Notes:
${customerNotes || "(No notes)"}

Delivery Location:
${deliveryAddress || "Not provided"}
${locationLink ? `Map: ${locationLink}` : ""}

Please confirm availability.`;

    return encodeURIComponent(message);
  };

  const whatsappLink = `https://wa.me/919866685221?text=${generateWhatsAppMessage()}`;
  const isCartEmpty = cart.length === 0;

  // Diagnostics for geolocation
  const [geoStatus, setGeoStatus] = useState<'idle'|'prompt'|'granted'|'denied'|'approximate'|'error'>('idle');
  const [lastGeoError, setLastGeoError] = useState<string | null>(null);
  const [lastCoords, setLastCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Get current location and auto-fill address using reverse geocoding
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    // Quick permission check when possible
    (async () => {
      try {
        const perms = (navigator as any).permissions;
        if (perms && perms.query) {
          const status = await perms.query({ name: 'geolocation' } as any);
          if (status.state === 'denied') {
            toast.error("Location access is blocked. Enable location in your browser settings.", { id: 'location' });
            return;
          }
        }
      } catch (e) {
        // ignore permissions API errors
      }

      toast.loading("Getting your location...", { id: 'location' });

      const getPosition = (opts: PositionOptions) =>
        new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, opts)
        );

      let coords: { latitude: number; longitude: number } | null = null;

      // Try high accuracy first with longer timeout
      try {
        const p = await getPosition({ enableHighAccuracy: true, timeout: 25000, maximumAge: 0 });
        coords = { latitude: p.coords.latitude, longitude: p.coords.longitude };
        setGeoStatus('granted');
        setLastGeoError(null);
        setLastCoords({ lat: coords.latitude, lng: coords.longitude });
      } catch (err1) {
        console.warn('High-accuracy geolocation failed, retrying with lower accuracy', err1);
        setGeoStatus('prompt');
        setLastGeoError(String(err1?.message || err1));
        toast("High-accuracy location failed, trying faster mode...");
        // Try lower accuracy (faster) as fallback
        try {
          const p2 = await getPosition({ enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 });
          coords = { latitude: p2.coords.latitude, longitude: p2.coords.longitude };
          setGeoStatus('granted');
          setLastGeoError(null);
          setLastCoords({ lat: coords.latitude, lng: coords.longitude });
        } catch (err2) {
          console.warn('Low-accuracy geolocation failed, falling back to IP-based lookup', err2);
          setLastGeoError(String(err2?.message || err2));
          // Fallback: IP-based geolocation (approximate)
          try {
            const ipRes = await fetch('https://ipapi.co/json/');
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              if (ipData && ipData.latitude && ipData.longitude) {
                coords = { latitude: Number(ipData.latitude), longitude: Number(ipData.longitude) };
                setGeoStatus('approximate');
                setLastCoords({ lat: coords.latitude, lng: coords.longitude });
                setLastGeoError(null);
                toast('Using approximate location from IP address');
              }
            }
          } catch (ipErr) {
            console.warn('IP geolocation failed', ipErr);
            setLastGeoError(String(ipErr?.message || ipErr));
          }
        }
      }

      if (!coords) {
        setGeoStatus('error');
        toast.error('Could not determine your location. Please enter address manually.', { id: 'location' });
        return;
      }

      const { latitude, longitude } = coords;
      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      setLocationLink(mapsLink);

      // Reverse geocode (Google if key set, otherwise Nominatim)
      const googleKey = (import.meta.env as any).VITE_GOOGLE_API_KEY;
      try {
        if (googleKey) {
          try {
            const res = await locationLib.reverseGeocode(latitude, longitude, googleKey);
            const formatted = res?.results?.[0]?.formatted_address;
            const components = res?.results?.[0]?.address_components || [];
            const compMap: Record<string, string> = {};
            for (const c of components) {
              for (const t of c.types) compMap[t] = c.long_name;
            }
            const street = [compMap['street_number'], compMap['route']].filter(Boolean).join(' ');
            const city = compMap['locality'] || compMap['administrative_area_level_2'] || compMap['postal_town'] || '';
            const state = compMap['administrative_area_level_1'] || '';
            const zip = compMap['postal_code'] || '';
            setFormData(prev => ({
              ...prev,
              street: street || formatted || prev.street,
              city: city || prev.city,
              state: state || prev.state,
              zip: zip || prev.zip,
            }));
            setGeoStatus('granted');
            toast.success('Address filled automatically!', { id: 'location' });
            return;
          } catch (gErr) {
            console.warn('Google reverse geocode failed, falling back to Nominatim', gErr);
          }
        }

        // Nominatim fallback
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        if (response.ok) {
          const data = await response.json();
          const address = data.address || {};
          const street = [address.house_number, address.road || address.street, address.neighbourhood || address.suburb].filter(Boolean).join(', ');
          const city = address.city || address.town || address.village || address.county || '';
          const state = address.state || '';
          const zip = address.postcode || '';
          setFormData(prev => ({
            ...prev,
            street: street || prev.street,
            city: city || prev.city,
            state: state || prev.state,
            zip: zip || prev.zip,
          }));
          toast.success('Address filled automatically!', { id: 'location' });
        } else {
          toast.success('Location captured! Please fill address manually.', { id: 'location' });
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        toast.success('Location captured! Please verify address.', { id: 'location' });
      }
    })();
  };

  if (orderPlaced) {
    return (
      <FashionLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-8 p-8">
            <div className="w-32 h-32 bg-gradient-to-br from-[#D9C6A4] to-[#B8A88A] rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-[#D9C6A4]/30 animate-bounce">
              <Check className="w-16 h-16 text-[#0F0F0F]" />
            </div>
            <div>
              <h1 className="text-5xl font-serif font-light tracking-wide text-[#0F0F0F]">Order Confirmed</h1>
              <p className="text-xl text-[#6B6B6B] mt-4 font-light">Thank you for shopping with us</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#6B6B6B]">
              <Sparkles className="w-5 h-5 animate-pulse text-[#D9C6A4]" />
              <span className="tracking-widest uppercase text-xs">Redirecting you home...</span>
            </div>
          </div>
        </div>
      </FashionLayout>
    );
  }

  return (
    <FashionLayout>
      <div className="min-h-screen">
        {/* Mobile Cart Toggle */}
        <div className="lg:hidden sticky top-0 z-50 bg-[#F5F3EF] border-b border-[#E8E4DE] shadow-sm">
          <button
            onClick={() => setMobileCartOpen(!mobileCartOpen)}
            className="w-full px-6 py-4 flex items-center justify-between min-h-[56px]"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#D9C6A4]" />
              <span className="font-medium text-[#0F0F0F]">
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-serif text-[#D9C6A4]">₹{Math.round(total)}</span>
              {mobileCartOpen ? <ChevronUp className="w-5 h-5 text-[#6B6B6B]" /> : <ChevronDown className="w-5 h-5 text-[#6B6B6B]" />}
            </div>
          </button>

          {mobileCartOpen && (
            <div className="px-6 pb-6 bg-[#F5F3EF] border-t border-[#E8E4DE]">
              <div className="mb-4 p-4 bg-white rounded-xl border border-[#E8E4DE]">
                {itemCost >= FREE_SHIPPING_THRESHOLD ? (
                  <div className="flex items-center gap-2 text-[#D9C6A4]">
                    <Gift className="w-5 h-5" />
                    <span className="font-medium">You unlocked Free Shipping!</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-[#6B6B6B] mb-2">
                      You're <span className="font-medium text-[#D9C6A4]">₹{amountToFreeShipping}</span> away from free shipping
                    </p>
                    <div className="h-2 bg-[#E8E4DE] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#D9C6A4] to-[#B8A88A] rounded-full transition-all duration-500"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 max-h-60 overflow-auto">
                {cart.map((item, index) => (
                  <div key={`mobile-${item.id}-${item.color}-${item.size}-${index}`} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E8E4DE]">
                    {(() => {
                      const imageSrc = item.image || allProducts.find(p => p.id === item.id)?.image || 'https://via.placeholder.com/600';
                      return (
                        <div className="w-12 h-12 bg-[#E8E4DE] rounded-lg flex items-center justify-center overflow-hidden">
                          <img src={imageSrc} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      );
                    })()}
                    <div className="flex-1">
                      <p className="font-medium text-sm text-[#0F0F0F]">{item.name}</p>
                      <p className="text-xs text-[#6B6B6B]">{item.color || 'Default'} | {item.size || 'M'} | Qty: {item.quantity}</p>
                    </div>
                    <span className="font-serif text-[#D9C6A4]">₹{Math.round(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Forms */}
          <div className="lg:col-span-7 space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-serif font-light tracking-wide text-[#0F0F0F]">Checkout</h1>
              <p className="text-[#6B6B6B] mt-2 tracking-wide">Almost there! Complete your order below.</p>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-[#E8E4DE]">
              <h2 className="text-2xl font-serif font-light text-[#0F0F0F] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#D9C6A4]/20 rounded-full flex items-center justify-center text-[#D9C6A4] font-medium text-sm">1</span>
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} placeholder="John" />
                <FloatingInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} placeholder="Doe" />
                <FloatingInput label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} placeholder="john@example.com" />
                <FloatingInput label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} error={errors.phone} placeholder="+91 98765 43210" />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-[#E8E4DE]">
              <h2 className="text-2xl font-serif font-light text-[#0F0F0F] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#D9C6A4]/20 rounded-full flex items-center justify-center text-[#D9C6A4] font-medium text-sm">2</span>
                Shipping Address
              </h2>

              <div className="space-y-4">
                <FloatingInput label="Street Address" name="street" value={formData.street} onChange={handleInputChange} error={errors.street} placeholder="123 Fashion Street" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingSelect label="State" name="state" value={formData.state} onChange={handleStateChange} options={availableStates} error={errors.state} />
                  <FloatingSelect label="City" name="city" value={formData.city} onChange={handleInputChange} options={availableCities} error={errors.city} disabled={!formData.state} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput label="ZIP Code" name="zip" value={formData.zip} onChange={handleInputChange} error={errors.zip} placeholder="500001" />
                  <div className="relative">
                    <div className="w-full h-16 px-6 pt-6 pb-2 rounded-full bg-[#F5F3EF] border-2 border-[#E8E4DE] flex items-center">
                      <span className="text-base font-medium text-[#0F0F0F]">India 🇮🇳</span>
                    </div>
                    <label className="absolute left-6 top-2 text-xs font-medium text-[#D9C6A4]">Country</label>
                  </div>
                </div>

                {/* Location Link */}
                <div className="pt-4 border-t border-[#E8E4DE]">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-[#D9C6A4]" />
                    <span className="font-medium text-[#0F0F0F]">Auto-Fill Address</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      className="flex-1 h-12 px-4 bg-[#D9C6A4]/20 hover:bg-[#D9C6A4]/30 text-[#0F0F0F] font-medium rounded-full transition-all flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Use My Location
                    </button>
                  </div>
                  {locationLink && (
                    <div className="mt-3 p-3 bg-[#D9C6A4]/10 rounded-xl border border-[#D9C6A4]/30">
                      <p className="text-sm text-[#0F0F0F] font-medium">✓ Address auto-filled from your location!</p>
                      <a href={locationLink} target="_blank" rel="noopener noreferrer" className="text-xs text-[#D9C6A4] underline truncate block">
                        View on Google Maps
                      </a>
                    </div>
                  )}
                  {/* Geo diagnostics */}
                  <div className="mt-3 text-xs text-[#6B6B6B]">
                    <div>Permission status: <span className="font-medium text-[#0F0F0F]">{geoStatus}</span></div>
                    {lastCoords && <div>Last coords: {lastCoords.lat.toFixed(5)}, {lastCoords.lng.toFixed(5)}</div>}
                    {lastGeoError && <div className="text-red-500">Last error: {lastGeoError}</div>}
                    <div className="mt-2 text-xs text-[#6B6B6B]">If location access is denied or times out, try enabling location in your browser or use the address fields manually.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-[#E8E4DE]">
              <h2 className="text-2xl font-serif font-light text-[#0F0F0F] mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#D9C6A4]/20 rounded-full flex items-center justify-center text-[#D9C6A4] font-medium text-sm">3</span>
                Customer Notes
              </h2>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Add any special instructions or notes for your order (e.g., gift wrapping, delivery preferences, etc.)"
                className="w-full h-32 px-6 py-4 rounded-xl bg-[#F5F3EF] border-2 border-[#E8E4DE] focus:border-[#D9C6A4] focus:bg-white outline-none transition-all text-base font-medium resize-none text-[#0F0F0F] placeholder-[#6B6B6B]"
              />
            </div>

            {/* WhatsApp Contact Section - Mobile */}
            <div className="lg:hidden">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-[#E8E4DE] animate-fade-in">
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <Send className="w-12 h-12 text-[#D9C6A4] mx-auto" />
                    <h3 className="text-xl md:text-2xl font-serif font-light text-[#0F0F0F] tracking-wide">
                      Place Order via WhatsApp
                    </h3>
                    <p className="text-sm text-[#6B6B6B]">
                      Your cart and details will be sent automatically
                    </p>
                  </div>

                  <a
                    href={isCartEmpty ? undefined : whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (isCartEmpty) {
                        e.preventDefault();
                        toast.error("Your cart is empty! Add products first.");
                      }
                    }}
                    className={`group inline-flex items-center justify-center gap-3 px-8 py-4 
                      text-white font-medium text-lg tracking-wide
                      rounded-full 
                      backdrop-blur-md
                      transition-all duration-300 ease-out
                      w-full
                      ${isCartEmpty 
                        ? "bg-[#6B6B6B]/30 cursor-not-allowed opacity-60" 
                        : "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                      }`}
                  >
                    <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    <span>Send Order on WhatsApp</span>
                  </a>
                  
                  <p className="text-xs text-[#6B6B6B]">
                    {isCartEmpty ? "Add items to your cart to continue" : "Click to send your order directly"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-[#E8E4DE]">
                <h2 className="text-2xl font-serif font-light text-[#0F0F0F] mb-6">Order Summary</h2>

                {/* Free Shipping Progress */}
                <div className="mb-6 p-4 bg-[#F5F3EF] rounded-xl border border-[#E8E4DE]">
                  {itemCost >= FREE_SHIPPING_THRESHOLD ? (
                    <div className="flex items-center gap-2 text-[#D9C6A4]">
                      <Gift className="w-5 h-5" />
                      <span className="font-medium">You unlocked Free Shipping!</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-[#6B6B6B] mb-2">
                        You're <span className="font-medium text-[#D9C6A4]">₹{Math.round(amountToFreeShipping)}</span> away from free shipping
                      </p>
                      <div className="h-3 bg-[#E8E4DE] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#D9C6A4] to-[#B8A88A] rounded-full transition-all duration-500" style={{ width: `${freeShippingProgress}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-auto">
                  {cart.length === 0 ? (
                    <p className="text-center text-[#6B6B6B] py-8">Your cart is empty</p>
                  ) : (
                    cart.map((item, index) => (
                      <div key={`${item.id}-${item.color}-${item.size}-${index}`} className="flex items-center gap-4 p-3 bg-[#F5F3EF] rounded-xl border border-[#E8E4DE]">
                            {(() => {
                              const imageSrc = item.image || allProducts.find(p => p.id === item.id)?.image || 'https://via.placeholder.com/600';
                              return (
                                <div className="w-16 h-16 bg-[#E8E4DE] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  <img src={imageSrc} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                              );
                            })()}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#0F0F0F] truncate">{item.name}</p>
                          <p className="text-xs text-[#6B6B6B]">{item.color || 'Default'} | Size: {item.size || 'M'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.color || undefined, item.size || undefined)} className="w-6 h-6 bg-[#E8E4DE] hover:bg-[#D9C6A4]/30 rounded-full text-xs font-medium transition min-h-[24px] text-[#0F0F0F]">-</button>
                            <span className="text-sm font-medium text-[#6B6B6B]">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.color || undefined, item.size || undefined)} className="w-6 h-6 bg-[#E8E4DE] hover:bg-[#D9C6A4]/30 rounded-full text-xs font-medium transition min-h-[24px] text-[#0F0F0F]">+</button>
                            <button onClick={() => removeFromCart(item.id, item.color || undefined, item.size || undefined)} className="ml-auto text-xs text-red-400 hover:text-red-500 font-medium min-h-[24px]">Remove</button>
                          </div>
                        </div>
                        <span className="font-serif text-[#D9C6A4]">₹{Math.round(item.price * item.quantity)}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="promoCode"
                      value={formData.promoCode}
                      onChange={handleInputChange}
                      placeholder="Promo code (try HAPPY10)"
                      className="flex-1 h-12 px-4 rounded-full bg-[#F5F3EF] border-2 border-[#E8E4DE] focus:border-[#D9C6A4] focus:bg-white outline-none transition-all text-sm font-medium text-[#0F0F0F] placeholder-[#6B6B6B]"
                    />
                    <button onClick={handleApplyPromo} className="h-12 px-6 bg-[#0F0F0F] hover:bg-[#2A2A2A] text-[#F5F3EF] font-medium rounded-full transition-all min-h-[48px]">Apply</button>
                  </div>
                  {appliedPromo && <p className="text-[#D9C6A4] text-sm mt-2 ml-4 font-medium">✓ HAPPY10 applied (-₹100)</p>}
                </div>

                {/* Totals */}
                <div className="space-y-3 py-4 border-t border-[#E8E4DE]">
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{Math.round(itemCost)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Shipping</span>
                    <span className="font-medium text-[#D9C6A4]">FREE</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-[#D9C6A4]">
                      <span>Discount</span>
                      <span className="font-medium">-₹{promoDiscount}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-4 border-t border-[#E8E4DE]">
                  <span className="text-xl font-medium text-[#0F0F0F]">Total</span>
                  <span className="text-3xl font-serif text-[#D9C6A4]">₹{Math.round(total)}</span>
                </div>
              </div>

              {/* WhatsApp Contact Section - Desktop */}
              <div className="hidden lg:block bg-white/70 backdrop-blur-xl rounded-2xl p-6 lg:p-8 shadow-lg border border-[#E8E4DE] animate-fade-in">
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-[#D9C6A4]/20 rounded-full flex items-center justify-center mx-auto">
                      <Send className="w-8 h-8 text-[#D9C6A4]" />
                    </div>
                    <h3 className="text-xl font-serif font-light text-[#0F0F0F] tracking-wide">
                      Place Order via WhatsApp
                    </h3>
                    <p className="text-sm text-[#6B6B6B]">
                      Your cart and details will be sent automatically
                    </p>
                  </div>

                  <a
                    href={isCartEmpty ? undefined : whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (isCartEmpty) {
                        e.preventDefault();
                        toast.error("Your cart is empty! Add products first.");
                      }
                    }}
                    className={`group inline-flex items-center justify-center gap-3 px-8 py-4 
                      text-white font-medium text-lg tracking-wide
                      rounded-full 
                      backdrop-blur-md
                      transition-all duration-300 ease-out
                      w-full
                      ${isCartEmpty 
                        ? "bg-[#6B6B6B]/30 cursor-not-allowed opacity-60" 
                        : "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                      }`}
                  >
                    <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    <span>Send Order on WhatsApp</span>
                  </a>

                  <p className="text-xs text-[#6B6B6B]">
                    {isCartEmpty ? "Add items to your cart to continue" : "Click to send your order directly"}
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md border border-[#E8E4DE]">
                <div className="flex flex-wrap justify-center gap-4 text-sm text-[#6B6B6B]">
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4 text-[#D9C6A4]" />
                    <span>Fast Shipping</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-[#D9C6A4]" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gift className="w-4 h-4 text-[#D9C6A4]" />
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for fade animation */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
      </div>
    </FashionLayout>
  );
};

export default Checkout;
