import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import { resetStoredDocumentState } from "../utils/documentVerificationState";
import {
  getRegisterServiceLabel,
  readSelectedRegisterService,
  saveDriverAuthAccount,
  saveSelectedRegisterService,
  type RegisterServiceKey,
} from "../utils/registerServiceFlow";

// EVzone Driver App – Registration Registration (profile page)
// New design: green curved header, info sections, form fields, green bottom nav.
// Original functionality preserved: form inputs, validation, accordion expand/collapse, routing.


function Input({ label, type = "text", value, onChange, placeholder }) {
  return (
    <label className="flex flex-col space-y-1">
      <span className="text-[11px] font-medium text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
    </label>
  );
}

export default function Registration() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    setOnboardingCheckpoint,
    driverProfile,
    setDriverProfile,
    resetOnboardingVehicleSetup,
  } = useStore();
  const selectedServiceFromState = (
    location.state as { selectedService?: RegisterServiceKey } | null
  )?.selectedService;
  const [selectedService] = useState<RegisterServiceKey | null>(() => {
    return selectedServiceFromState || readSelectedRegisterService();
  });
  const [fullName, setFullName] = useState(driverProfile.fullName);
  const [country, setCountry] = useState(driverProfile.country);
  const [dob, setDob] = useState(driverProfile.dob);
  const [email, setEmail] = useState(driverProfile.email);
  const [phone, setPhone] = useState(driverProfile.phone);
  const [streetAddress, setStreetAddress] = useState(driverProfile.streetAddress);
  const [city, setCity] = useState(driverProfile.city);
  const [district, setDistrict] = useState(driverProfile.district);
  const [postalCode, setPostalCode] = useState(driverProfile.postalCode);
  const [landmark, setLandmark] = useState(driverProfile.landmark);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!selectedService) {
      return;
    }

    saveSelectedRegisterService(selectedService);
  }, [selectedService]);

  const selectedServiceLabel = useMemo(
    () => getRegisterServiceLabel(selectedService),
    [selectedService]
  );

  const hasPassword = password.trim().length > 0;
  const hasConfirmPassword = confirmPassword.trim().length > 0;
  const passwordsMatch = hasPassword && hasConfirmPassword && password === confirmPassword;

  const isValid =
    Boolean(selectedService) &&
    fullName.trim().length > 0 &&
    country.trim().length > 0 &&
    dob.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    streetAddress.trim().length > 0 &&
    city.trim().length > 0 &&
    district.trim().length > 0 &&
    hasPassword &&
    hasConfirmPassword &&
    passwordsMatch;

  const handleNext = () => {
    if (!selectedService) {
      setErrorMessage("Select a service first from Register Services.");
      return;
    }

    if (!hasPassword) {
      setErrorMessage("Password is required.");
      return;
    }

    if (!hasConfirmPassword) {
      setErrorMessage("Confirm password is required.");
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("Password and confirm password must match.");
      return;
    }

    if (!isValid) {
      setErrorMessage("Complete all required fields.");
      return;
    }

    setErrorMessage("");

    setDriverProfile({
      ...driverProfile,
      fullName: fullName.trim(),
      country: country.trim(),
      dob: dob.trim(),
      email: email.trim(),
      phone: phone.trim(),
      streetAddress: streetAddress.trim(),
      city: city.trim(),
      district: district.trim(),
      postalCode: postalCode.trim(),
      landmark: landmark.trim(),
    });

    saveDriverAuthAccount({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      selectedService,
    });

    resetStoredDocumentState();
    resetOnboardingVehicleSetup();
    setOnboardingCheckpoint("documentsVerified", false);
    setOnboardingCheckpoint("trainingCompleted", false);

    navigate("/driver/register", { state: { selectedService } });
  };

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Registration" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Registration overview */}
        <section className="rounded-3xl border border-orange-200 bg-orange-50/60 px-5 py-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-orange-600">
            Registration Details
          </h2>
          <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-700">
            Enter your personal information on this page. In the next step, you will choose your
            driver service category and continue onboarding.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Selected Service
          </p>
          <p className="mt-1 text-sm font-black text-slate-900">{selectedServiceLabel}</p>
        </section>

        {/* Divider */}
        <div className="h-1 w-12 bg-orange-500/20 mx-auto rounded-full" />

        {/* Personal Info heading + form fields */}
        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest">Personal Info</h3>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-0.5">
              Let's get started by setting up your profile
            </p>
          </div>

          <div className="space-y-3">
            <Input
              label="Full Name"
              value={fullName}
              onChange={setFullName}
              placeholder="e.g. John Doe"
            />
            <Input
              label="Country"
              value={country}
              onChange={setCountry}
              placeholder="e.g. Uganda"
            />
            <label className="flex flex-col space-y-1">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1 ml-1">Date of Birth</span>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-12 rounded-2xl border border-slate-100 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#03cd8c] focus:outline-none focus:ring-4 focus:ring-[#03cd8c]/5 transition-all"
              />
            </label>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="name@example.com"
            />
            <Input
              label="Mobile Number"
              value={phone}
              onChange={setPhone}
              placeholder="e.g. +256 700 000000"
            />
            <Input
              label="Street Address"
              value={streetAddress}
              onChange={setStreetAddress}
              placeholder="e.g. Plot 12, Acacia Avenue"
            />
            <Input
              label="City / Town"
              value={city}
              onChange={setCity}
              placeholder="e.g. Kampala"
            />
            <Input
              label="District / State"
              value={district}
              onChange={setDistrict}
              placeholder="e.g. Central Region"
            />
            <Input
              label="Postal Code (Optional)"
              value={postalCode}
              onChange={setPostalCode}
              placeholder="e.g. 25600"
            />
            <Input
              label="Nearby Landmark (Optional)"
              value={landmark}
              onChange={setLandmark}
              placeholder="e.g. Next to Acacia Mall"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setErrorMessage("");
              }}
              placeholder="Create password"
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                setErrorMessage("");
              }}
              placeholder="Confirm password"
            />
          </div>
        </section>

        {/* Onboarding note */}
        <section className="space-y-4">
          <div className="px-1">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Verification</h3>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50/50 px-4 py-4">
            <p className="text-[11px] font-medium leading-relaxed text-slate-700">
              Document upload is handled on the onboarding profile screen after this step.
              National ID and Driver's License require front and back copies, while
              Conduct Clearance requires one clear copy.
            </p>
          </div>
        </section>

        {/* Next button */}
        <section className="pt-2 pb-12">
          <button
            type="button"
            disabled={!isValid}
            onClick={handleNext}
            className={`w-full rounded-2xl py-4 text-sm font-black tracking-tight shadow-lg transition-all active:scale-[0.98] ${isValid
                ? "bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-600"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
              }`}
          >
            CONTINUE
          </button>
          {errorMessage && (
            <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-700">
                {errorMessage}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
