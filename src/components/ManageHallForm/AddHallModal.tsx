// src/components/ManageHallForm/AddHallModal.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  AlertCircle,
  Building,
  Grid,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Settings,
} from "lucide-react";

// ============================================
// TYPES
// ============================================
interface SeatLevel {
  id: string;
  name: string;
  display_name: string;
  price: number;
  start_row: string;
  end_row: string;
  start_col: number;
  end_col: number;
}

interface HallInfo {
  name: string;
  num_of_rows: number | null;
  num_of_cols: number | null;
}

interface AddHallModalProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

// ============================================
// UTILITIES
// ============================================
const numberToRowLetter = (num: number): string => {
  let result = "";
  let n = num;
  while (n > 0) {
    n--;
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26);
  }
  return result;
};

const generateRowLetters = (numOfRows: number): string[] => {
  const letters = [];
  for (let i = 1; i <= numOfRows; i++) {
    letters.push(numberToRowLetter(i));
  }
  return letters;
};

// ============================================
// STEP 1: BASIC INFORMATION
// ============================================
interface BasicInfoStepProps {
  formData: HallInfo;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  totalCapacity: number;
  onUpdate: (data: Partial<HallInfo>) => void;
  onBlur: (field: string) => void;
  onNext: () => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  errors,
  touched,
  totalCapacity,
  onUpdate,
  onBlur,
  onNext,
}) => {
  const isDisabled =
    !formData.name || !formData.num_of_rows || !formData.num_of_cols;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hall Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          onBlur={() => onBlur("name")}
          className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${
            errors.name && touched.name ? "border-red-500" : "border-gray-200"
          }`}
          placeholder="e.g., Grand Hall"
        />
        {errors.name && touched.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Rows <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.num_of_rows === null ? "" : formData.num_of_rows}
            onChange={(e) => {
              const value =
                e.target.value === ""
                  ? null
                  : Math.max(1, parseInt(e.target.value) || 0);
              onUpdate({ num_of_rows: value });
            }}
            onBlur={() => onBlur("num_of_rows")}
            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${
              errors.num_of_rows && touched.num_of_rows
                ? "border-red-500"
                : "border-gray-200"
            }`}
            placeholder="e.g., 10"
            min="1"
            step="1"
          />
          {errors.num_of_rows && touched.num_of_rows && (
            <p className="text-red-500 text-xs mt-1">{errors.num_of_rows}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Rows labeled A, B, C, ... (unlimited)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Columns <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.num_of_cols === null ? "" : formData.num_of_cols}
            onChange={(e) => {
              const value =
                e.target.value === ""
                  ? null
                  : Math.max(1, parseInt(e.target.value) || 0);
              onUpdate({ num_of_cols: value });
            }}
            onBlur={() => onBlur("num_of_cols")}
            className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none ${
              errors.num_of_cols && touched.num_of_cols
                ? "border-red-500"
                : "border-gray-200"
            }`}
            placeholder="e.g., 15"
            min="1"
            step="1"
          />
          {errors.num_of_cols && touched.num_of_cols && (
            <p className="text-red-500 text-xs mt-1">{errors.num_of_cols}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Total Capacity
        </label>
        <input
          type="text"
          value={
            totalCapacity > 0
              ? `${totalCapacity.toLocaleString()} seats`
              : "Enter rows and columns"
          }
          disabled
          className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
        />
      </div>

      <button
        onClick={onNext}
        disabled={isDisabled}
        className="w-full px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:from-teal-600 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        Continue to Seat Levels <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

// ============================================
// SEAT LEVEL EDITOR COMPONENT
// ============================================
interface SeatLevelEditorProps {
  level: SeatLevel;
  rowLetters: string[];
  maxCols: number;
  isExpanded: boolean;
  errors: Record<string, string>;
  onToggle: () => void;
  onUpdate: (field: keyof SeatLevel, value: any) => void;
  onRemove?: () => void;
  isStandard?: boolean;
}

const SeatLevelEditor: React.FC<SeatLevelEditorProps> = ({
  level,
  rowLetters,
  maxCols,
  isExpanded,
  errors,
  onToggle,
  onUpdate,
  onRemove,
  isStandard = false,
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {level.display_name ||
              (isStandard ? "Standard (Default)" : "New Level")}
          </span>
          {isStandard && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              All seats
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isStandard && onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 space-y-3 border-t"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Level Name {!isStandard && "*"}
                </label>
                <input
                  type="text"
                  value={level.display_name}
                  onChange={(e) => onUpdate("display_name", e.target.value)}
                  placeholder={isStandard ? "Standard" : "e.g., VIP, Premium"}
                  className="w-full p-2 border rounded-lg text-sm"
                  disabled={isStandard}
                />
                {errors[`level_${level.id}_name`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`level_${level.id}_name`]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Price (ETB) {!isStandard && "*"}
                </label>
                <input
                  type="number"
                  value={level.price}
                  onChange={(e) => {
                    let value = parseFloat(e.target.value);
                    if (isNaN(value)) value = 0;
                    if (value < 0) value = 0;
                    onUpdate("price", value);
                  }}
                  className="w-full p-2 border rounded-lg text-sm"
                  min="0"
                  step="1"
                />
                {errors[`level_${level.id}_price`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`level_${level.id}_price`]}
                  </p>
                )}
              </div>
            </div>

            {!isStandard && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Row Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={level.start_row}
                        onChange={(e) => onUpdate("start_row", e.target.value)}
                        className="p-2 border rounded-lg text-sm"
                      >
                        {rowLetters.map((row) => (
                          <option key={row} value={row}>
                            {row}
                          </option>
                        ))}
                      </select>
                      <select
                        value={level.end_row}
                        onChange={(e) => onUpdate("end_row", e.target.value)}
                        className="p-2 border rounded-lg text-sm"
                      >
                        <option value="">Select</option>
                        {rowLetters.map((row) => (
                          <option key={row} value={row}>
                            {row}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors[`level_${level.id}_row`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`level_${level.id}_row`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Column Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={level.start_col}
                        onChange={(e) => {
                          let value = parseInt(e.target.value);
                          if (isNaN(value)) value = 1;
                          if (value < 1) value = 1;
                          if (value > maxCols) value = maxCols;
                          onUpdate("start_col", value);
                        }}
                        className="p-2 border rounded-lg text-sm"
                        min="1"
                        max={maxCols}
                      />
                      <input
                        type="number"
                        value={level.end_col === 0 ? "" : level.end_col}
                        onChange={(e) => {
                          const value =
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value);
                          let finalValue = value;
                          if (finalValue < 0) finalValue = 0;
                          if (finalValue > maxCols) finalValue = maxCols;
                          onUpdate("end_col", finalValue);
                        }}
                        className="p-2 border rounded-lg text-sm"
                        min="1"
                        max={maxCols}
                        placeholder="End"
                      />
                    </div>
                    {errors[`level_${level.id}_col`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`level_${level.id}_col`]}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// STEP 2: SEAT LEVELS CONFIGURATION
// ============================================
interface SeatLevelsStepProps {
  seatLevels: SeatLevel[];
  rowLetters: string[];
  maxCols: number;
  totalRows: number;
  totalCols: number;
  totalCapacity: number;
  errors: Record<string, string>;
  expandedLevels: Record<string, boolean>;
  onAddLevel: () => void;
  onRemoveLevel: (id: string) => void;
  onUpdateLevel: (id: string, field: keyof SeatLevel, value: any) => void;
  onToggleExpand: (id: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const SeatLevelsStep: React.FC<SeatLevelsStepProps> = ({
  seatLevels,
  rowLetters,
  maxCols,
  totalRows,
  totalCols,
  totalCapacity,
  errors,
  expandedLevels,
  onAddLevel,
  onRemoveLevel,
  onUpdateLevel,
  onToggleExpand,
  onBack,
  onSubmit,
}) => {
  const isLargeHall = totalRows > 10;

  return (
    <div className="space-y-5">
      {/* Info Box */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700">
          <Settings className="h-3 w-3 inline mr-1" />
          All seats start as "Standard". Add premium levels and define their row
          and column ranges.
          <br />
          <strong>Hall size:</strong> {totalRows} rows ({rowLetters[0]}-
          {rowLetters[rowLetters.length - 1]}) × {totalCols} columns
        </p>
      </div>

      {/* Seat Levels List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Grid className="h-4 w-4 text-teal-600" />
            Seat Levels
          </h3>
          <button
            onClick={onAddLevel}
            className="px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Level
          </button>
        </div>

        {seatLevels.map((level) => (
          <SeatLevelEditor
            key={level.id}
            level={level}
            rowLetters={rowLetters}
            maxCols={maxCols}
            isExpanded={expandedLevels[level.id] || false}
            errors={errors}
            onToggle={() => onToggleExpand(level.id)}
            onUpdate={(field, value) => onUpdateLevel(level.id, field, value)}
            onRemove={
              level.name !== "standard"
                ? () => onRemoveLevel(level.id)
                : undefined
            }
            isStandard={level.name === "standard"}
          />
        ))}
      </div>

      {/* Large Hall Warning */}
      {isLargeHall && (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-700">
            <AlertCircle className="h-3 w-3 inline mr-1" />
            Large hall detected ({totalRows} rows × {totalCols} columns ={" "}
            {totalCapacity.toLocaleString()} seats). Seat layout will be
            generated efficiently.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:from-teal-600 hover:to-emerald-700 transition flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          Create Hall
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const AddHallModal: React.FC<AddHallModalProps> = ({ onSubmit, onCancel }) => {
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<HallInfo>({
    name: "",
    num_of_rows: null,
    num_of_cols: null,
  });
  const [seatLevels, setSeatLevels] = useState<SeatLevel[]>([
    {
      id: "standard",
      name: "standard",
      display_name: "Standard",
      price: 50,
      start_row: "A",
      end_row: "",
      start_col: 1,
      end_col: 0,
    },
  ]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>(
    { standard: true },
  );

  // Derived values
  const totalCapacity =
    (formData.num_of_rows || 0) * (formData.num_of_cols || 0);
  const rowLetters = generateRowLetters(formData.num_of_rows || 0);
  const maxRowLetter =
    rowLetters.length > 0 ? rowLetters[rowLetters.length - 1] : "A";

  // Initialize user
  useEffect(() => {
    try {
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
      } else {
        alert("User not authenticated. Please log in again.");
        onCancel();
      }
    } catch (error) {
      console.error("Error getting user:", error);
      onCancel();
    } finally {
      setLoading(false);
    }
  }, [onCancel]);

  // ============================================
  // VALIDATION
  // ============================================
  const validateBasicInfo = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Hall name is required";
    if (!formData.num_of_rows || formData.num_of_rows < 1)
      newErrors.num_of_rows = "Number of rows must be at least 1";
    if (!formData.num_of_cols || formData.num_of_cols < 1)
      newErrors.num_of_cols = "Number of columns must be at least 1";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSeatLevels = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const level of seatLevels) {
      if (!level.display_name?.trim()) {
        newErrors[`level_${level.id}_name`] = "Level name required";
      }

      if (level.name !== "standard") {
        if (!level.end_row)
          newErrors[`level_${level.id}_row`] = "Please select end row";
        if (!level.end_col || level.end_col === 0)
          newErrors[`level_${level.id}_col`] = "Please select end column";

        // Validate row range
        if (level.end_row && level.start_row) {
          const startIndex = rowLetters.indexOf(level.start_row);
          const endIndex = rowLetters.indexOf(level.end_row);
          if (startIndex !== -1 && endIndex !== -1 && endIndex < startIndex) {
            newErrors[`level_${level.id}_row`] =
              "End row cannot be before start row";
          }
          if (endIndex >= formData.num_of_rows!) {
            newErrors[`level_${level.id}_row`] =
              `End row cannot exceed ${maxRowLetter}`;
          }
        }

        // Validate column range
        if (
          level.end_col &&
          level.start_col &&
          level.end_col < level.start_col
        ) {
          newErrors[`level_${level.id}_col`] =
            "End column cannot be before start column";
        }
        if (
          level.end_col &&
          formData.num_of_cols &&
          level.end_col > formData.num_of_cols
        ) {
          newErrors[`level_${level.id}_col`] =
            `End column cannot exceed ${formData.num_of_cols}`;
        }
      }

      if (level.price <= 0) {
        newErrors[`level_${level.id}_price`] = "Price must be greater than 0";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateBasicInfo();
  };

  // ============================================
  // STEP HANDLERS
  // ============================================
  const handleNext = () => {
    setTouched({ name: true, num_of_rows: true, num_of_cols: true });
    if (!validateBasicInfo()) return;
    if (!formData.num_of_rows || !formData.num_of_cols) return;

    // Auto-set standard level ranges
    const updatedLevels = seatLevels.map((level) => {
      if (level.name === "standard") {
        return {
          ...level,
          end_row: maxRowLetter,
          end_col: formData.num_of_cols || 0,
        };
      }
      return level;
    });
    setSeatLevels(updatedLevels);
    setCurrentStep(2);
  };

  const handleBack = () => setCurrentStep(1);

  const handleSubmit = () => {
    if (!validateSeatLevels()) return;
    if (!currentUserId || !formData.num_of_rows || !formData.num_of_cols)
      return;

    // Generate seat layout
    const seatLayout = [];
    for (let rowIdx = 0; rowIdx < formData.num_of_rows; rowIdx++) {
      const rowName = rowLetters[rowIdx];
      for (let col = 1; col <= formData.num_of_cols; col++) {
        let matchedLevel = seatLevels[0];
        for (const level of seatLevels) {
          if (level.name !== "standard" && level.end_row && level.end_col) {
            const startIdx = rowLetters.indexOf(level.start_row);
            const endIdx = rowLetters.indexOf(level.end_row);
            if (
              startIdx !== -1 &&
              endIdx !== -1 &&
              rowIdx >= startIdx &&
              rowIdx <= endIdx &&
              col >= level.start_col &&
              col <= level.end_col
            ) {
              matchedLevel = level;
              break;
            }
          }
        }
        seatLayout.push({
          seat_row: rowName,
          seat_number: col,
          seat_level_name: matchedLevel.name,
          price_multiplier:
            matchedLevel.name === "standard" ? 1.0 : matchedLevel.price / 50,
          seat_status: "free",
        });
      }
    }

    onSubmit({
      hallInfo: {
        name: formData.name,
        num_of_rows: formData.num_of_rows,
        num_of_cols: formData.num_of_cols,
        capacity: totalCapacity,
        published_by: currentUserId,
      },
      seatLevels,
      seatLayout,
    });
  };

  // ============================================
  // SEAT LEVEL CRUD
  // ============================================
  const addSeatLevel = () => {
    const newId = `level_${Date.now()}`;
    setSeatLevels([
      ...seatLevels,
      {
        id: newId,
        name: "",
        display_name: "",
        price: 0,
        start_row: "A",
        end_row: "",
        start_col: 1,
        end_col: 0,
      },
    ]);
    setExpandedLevels({ ...expandedLevels, [newId]: true });
  };

  const removeSeatLevel = (id: string) => {
    if (seatLevels.length <= 1) return;
    setSeatLevels(seatLevels.filter((level) => level.id !== id));
    const newExpanded = { ...expandedLevels };
    delete newExpanded[id];
    setExpandedLevels(newExpanded);
  };

  const updateSeatLevel = (id: string, field: keyof SeatLevel, value: any) => {
    setSeatLevels((levels) =>
      levels.map((level) =>
        level.id === id ? { ...level, [field]: value } : level,
      ),
    );
    if (errors[`level_${id}_${field}`]) {
      setErrors((prev) => ({ ...prev, [`level_${id}_${field}`]: "" }));
    }
  };

  const toggleLevelExpand = (id: string) => {
    setExpandedLevels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 text-white rounded-t-2xl z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Add New Hall</h2>
                <p className="text-white/80 text-sm">
                  Step {currentStep} of 2:{" "}
                  {currentStep === 1
                    ? "Basic Information"
                    : "Seat Levels Configuration"}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-white/20 rounded-full">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          {currentStep === 1 && (
            <BasicInfoStep
              formData={formData}
              errors={errors}
              touched={touched}
              totalCapacity={totalCapacity}
              onUpdate={(data) => setFormData({ ...formData, ...data })}
              onBlur={handleBlur}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 &&
            formData.num_of_rows &&
            formData.num_of_cols && (
              <SeatLevelsStep
                seatLevels={seatLevels}
                rowLetters={rowLetters}
                maxCols={formData.num_of_cols}
                totalRows={formData.num_of_rows}
                totalCols={formData.num_of_cols}
                totalCapacity={totalCapacity}
                errors={errors}
                expandedLevels={expandedLevels}
                onAddLevel={addSeatLevel}
                onRemoveLevel={removeSeatLevel}
                onUpdateLevel={updateSeatLevel}
                onToggleExpand={toggleLevelExpand}
                onBack={handleBack}
                onSubmit={handleSubmit}
              />
            )}
        </div>
      </motion.div>
    </div>
  );
};

export default AddHallModal;