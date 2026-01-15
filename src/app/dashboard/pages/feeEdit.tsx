import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeeDetails, updateFee } from "../../../redux/slices/feeSlice/feeSlice";
import { AppDispatch, RootState } from "../../../redux/store";
import InputField from "../../../components/ui/inputfield";
import Dropdown from "../../../components/ui/dropdown";
import Button from "../../../components/ui/button";
import { showSuccessAlert, showErrorAlert } from "../../../utils/swal";

export default function FeeEdit({
  onNavigate,
  feeId,
}: {
  onNavigate: (page: string) => void;
  feeId: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentFee, isLoading, error } = useSelector((state: RootState) => state.fee);
  const initializedRef = useRef(false);
  const [feeName, setFeeName] = useState("");
  const [feeType, setFeeType] = useState("");
  const [value, setValue] = useState("");
  const [appliesTo, setAppliesTo] = useState("");
  const [scope, setScope] = useState("");
  const [basePrice, setBasePrice] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (feeId) {
      dispatch(fetchFeeDetails(feeId));
    }
  }, [feeId, dispatch]);

  useEffect(() => {
    const fee = currentFee;
    if (fee && !initializedRef.current) {
      initializedRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFeeName(fee.feeName);
      setFeeType(fee.feeType);
      setValue(fee.value.toString());
      setAppliesTo(fee.appliesTo);
      setScope(fee.scope);
    }
  }, [currentFee]);

  useEffect(() => {
    if (error) {
      showErrorAlert('Error', error);
    }
  }, [error]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!feeName.trim()) newErrors.feeName = "Fee Name is required";
    if (!feeType) newErrors.feeType = "Fee Type is required";
    if (!value.trim()) newErrors.value = "Value is required";
    if (!appliesTo) newErrors.appliesTo = "Applies To is required";
    if (!scope) newErrors.scope = "Scope is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        await dispatch(updateFee({
          feeId,
          feeData: {
            feeName,
            feeType,
            value: parseFloat(value),
            appliesTo,
            scope,
            isActive: true,
          },
        })).unwrap();
        showSuccessAlert('Success', 'Fee updated successfully');
        onNavigate("commission-model");
      } catch (error) {
        showErrorAlert('Error', error as string);
      }
    }
  };

  const calculateFee = () => {
    const base = parseFloat(basePrice) || 0;
    const val = parseFloat(value) || 0;
    if (feeType === "FLAT") {
      return { fee: val, total: base + val };
    } else if (feeType === "PERCENTAGE" || feeType === "COMMISSION") {
      const fee = (val / 100) * base;
      return { fee, total: base + fee };
    }
    return { fee: 0, total: base };
  };

  const { fee, total } = calculateFee();

  // Determine the symbol based on fee type
  const getValueSymbol = () => {
    if (feeType === "PERCENTAGE" || feeType === "COMMISSION") {
      return "%";
    } else if (feeType === "FLAT") {
      return "₹";
    }
    return "";
  };

  const valueSymbol = getValueSymbol();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-500">Loading fee details...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Edit Fee</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-md border border-[#e4e4e4]">
          <div className="border-b border-[#e4e4e4] px-3 py-1">
            <h2 className="text-lg font-medium">Fee Details</h2>
          </div>
          <div className="p-3">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fee Name
                </label>
                <InputField
                  placeholder="Enter fee name"
                  value={feeName}
                  onChange={(e) => setFeeName(e.target.value)}
                />
                {errors.feeName && (
                  <p className="text-red-500 text-sm">{errors.feeName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fee Type
                </label>
                <Dropdown
                  options={[
                    { label: "FLAT", value: "FLAT" },
                    { label: "PERCENTAGE", value: "PERCENTAGE" },
                    { label: "COMMISSION", value: "COMMISSION" },
                  ]}
                  placeholder="Select fee type"
                  value={feeType}
                  onChange={setFeeType}
                />
                {errors.feeType && (
                  <p className="text-red-500 text-sm">{errors.feeType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Value
                </label>
                <div className="relative">
                  <InputField
                    type="number"
                    placeholder="Enter value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  {valueSymbol && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      {valueSymbol}
                    </span>
                  )}
                </div>
                {errors.value && (
                  <p className="text-red-500 text-sm">{errors.value}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Applies To
                </label>
                <Dropdown
                  options={[
                    { label: "TRAVELLER", value: "TRAVELLER" },
                    { label: "HOST", value: "HOST" },
                    { label: "BOTH", value: "BOTH" },
                  ]}
                  placeholder="Select applies to"
                  value={appliesTo}
                  onChange={setAppliesTo}
                />
                {errors.appliesTo && (
                  <p className="text-red-500 text-sm">{errors.appliesTo}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scope
                </label>
                <Dropdown
                  options={[
                    { label: "GLOBAL", value: "GLOBAL" },
                    { label: "STORY", value: "STORY" },
                  ]}
                  placeholder="Select scope"
                  value={scope}
                  onChange={setScope}
                />
                {errors.scope && (
                  <p className="text-red-500 text-sm">{errors.scope}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {(value || feeType) && (
          <div className="bg-white rounded-md border border-[#e4e4e4]">
             <div className="border-b border-[#e4e4e4] px-3 py-1">
            <h2 className="text-lg font-medium">
              Live Calculation Preview
            </h2>
            </div>
            <div className="space-y-4 p-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sample Base Price
                </label>
                <InputField
                  type="number"
                  placeholder="Enter base price"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Fee Applied</p>
                  <p className="text-lg font-semibold">₹{fee.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Total Charge</p>
                  <p className="text-lg font-semibold">₹{total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 flex gap-4">
        <Button variant="primary" label="Update Fee" onClick={handleSubmit} />
        <Button
          variant="secondary"
          label="Cancel"
          onClick={() => onNavigate("commission-model")}
        />
      </div>
    </div>
  );
}