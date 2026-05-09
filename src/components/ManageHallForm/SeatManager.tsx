// src/components/ManageHallForm/SeatManager.tsx
import React, { useState, useEffect } from "react";
import { Grid, Settings, Save, X } from "lucide-react";
import supabase from "@/config/supabaseClient";

interface SeatManagerProps {
  hallId: string;
  onClose: () => void;
}

const SeatManager: React.FC<SeatManagerProps> = ({ hallId, onClose }) => {
  const [hall, setHall] = useState<any>(null);
  const [seatLevels, setSeatLevels] = useState<any[]>([]);
  const [seats, setSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedLevelId, setSelectedLevelId] = useState<string>("");
  const [bulkMode, setBulkMode] = useState(false);

  useEffect(() => {
    loadData();
  }, [hallId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load hall info
      const { data: hallData } = await supabase
        .from("halls")
        .select("*")
        .eq("id", hallId)
        .single();
      setHall(hallData);

      // Load seat levels
      const { data: levels } = await supabase
        .from("seat_levels")
        .select("*")
        .eq("hall_id", hallId);
      setSeatLevels(levels || []);
      if (levels?.length) setSelectedLevelId(levels[0].id);

      // Load seats
      const { data: seatsData } = await supabase
        .from("seats")
        .select("*")
        .eq("hall_id", hallId);
      setSeats(seatsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSeatLevel = async (seatId: string, levelId: string) => {
    setSeats((prev) =>
      prev.map((seat) =>
        seat.id === seatId ? { ...seat, seat_level_id: levelId } : seat,
      ),
    );
  };

  const toggleReservation = async (seatId: string) => {
    setSeats((prev) =>
      prev.map((seat) =>
        seat.id === seatId ? { ...seat, is_reserved: !seat.is_reserved } : seat,
      ),
    );
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      for (const seat of seats) {
        await supabase
          .from("seats")
          .update({
            seat_level_id: seat.seat_level_id,
            is_reserved: seat.is_reserved,
          })
          .eq("id", seat.id);
      }
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const rowLetters = Array.from({ length: hall?.num_of_row || 0 }, (_, i) =>
    i < 26
      ? String.fromCharCode(65 + i)
      : `Z${String.fromCharCode(65 + (i - 26))}`,
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Manage Seats - {hall?.name}</h2>
            <p className="text-white/80 text-sm">
              Click on seats to change level or reservation status
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Assign Level:</span>
              <select
                value={selectedLevelId}
                onChange={(e) => setSelectedLevelId(e.target.value)}
                className="p-2 border rounded-lg text-sm"
              >
                {seatLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.display_name} (ETB {level.price})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setBulkMode(!bulkMode)}
              className={`px-3 py-1.5 rounded-lg text-sm ${bulkMode ? "bg-red-500 text-white" : "bg-gray-200"}`}
            >
              {bulkMode ? "Exit Bulk Mode" : "Bulk Mode (Toggle Reserve)"}
            </button>
            <button
              onClick={saveChanges}
              disabled={saving}
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />{" "}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg mb-4">
            {seatLevels.map((level) => (
              <div key={level.id} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: level.color }}
                />
                <span className="text-sm">
                  {level.display_name} - ETB {level.price}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-sm">Reserved</span>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="overflow-x-auto border rounded-lg p-4">
            <div className="inline-block min-w-full">
              <div className="text-center mb-6">
                <div className="inline-block w-48 h-1 bg-gray-300 rounded-full" />
                <p className="text-xs text-gray-400 mt-1">SCREEN</p>
              </div>
              <div className="space-y-1">
                {rowLetters.map((row) => (
                  <div key={row} className="flex justify-center gap-1">
                    <span className="w-8 text-xs font-medium text-gray-500">
                      {row}
                    </span>
                    {Array.from({ length: hall.num_of_col }, (_, i) => {
                      const seat = seats.find(
                        (s) => s.seat_row === row && s.seat_number === i + 1,
                      );
                      const level = seatLevels.find(
                        (l) => l.id === seat?.seat_level_id,
                      );
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            if (seat) {
                              if (bulkMode) {
                                toggleReservation(seat.id);
                              } else {
                                updateSeatLevel(seat.id, selectedLevelId);
                              }
                            }
                          }}
                          className={`w-8 h-8 rounded text-xs flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${seat?.is_reserved ? "bg-red-500 text-white" : ""}`}
                          style={
                            !seat?.is_reserved
                              ? {
                                  backgroundColor: level?.color || "#6B7280",
                                  color: "white",
                                }
                              : {}
                          }
                          title={`${row}${i + 1} - ${level?.display_name || "Unknown"}${seat?.is_reserved ? " (Reserved)" : ""}`}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Total Seats</p>
              <p className="text-xl font-bold">{seats.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Reserved</p>
              <p className="text-xl font-bold text-red-600">
                {seats.filter((s) => s.is_reserved).length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Available</p>
              <p className="text-xl font-bold text-green-600">
                {seats.filter((s) => !s.is_reserved).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatManager;
