import React, { useState, useEffect } from 'react';
import { Radio, RefreshCw, AlertTriangle, CheckCircle2, Sliders, Activity, Server, Zap } from 'lucide-react';

interface SimulatedSensor {
  id: string;
  name: string;
  node: string;
  type: string;
  unit: string;
  currentValue: number;
  minLimit: number;
  maxLimit: number;
  history: number[];
}

export const InteractiveSimulator: React.FC = () => {
  const initialSensors: SimulatedSensor[] = [
    {
      id: 'sen-01',
      name: 'Suhu Server Rack HQ',
      node: 'NODE-01 HQ',
      type: 'Temperature',
      unit: '°C',
      currentValue: 24.2,
      minLimit: 18.0,
      maxLimit: 28.0,
      history: [23.8, 24.0, 24.1, 24.2, 24.5, 24.2],
    },
    {
      id: 'sen-02',
      name: 'Kelembaban Gudang Hub',
      node: 'NODE-02 Cikarang',
      type: 'Humidity',
      unit: '%RH',
      currentValue: 54.6,
      minLimit: 40.0,
      maxLimit: 65.0,
      history: [52.1, 53.0, 53.8, 54.2, 54.8, 54.6],
    },
    {
      id: 'sen-03',
      name: 'Vibrasi Motor Konveyor',
      node: 'NODE-03 Surabaya',
      type: 'Vibration',
      unit: 'mm/s',
      currentValue: 1.85,
      minLimit: 0.5,
      maxLimit: 4.5,
      history: [1.6, 1.7, 1.8, 1.75, 1.82, 1.85],
    },
    {
      id: 'sen-04',
      name: 'Arus Listrik Busbar Utama',
      node: 'NODE-01 HQ',
      type: 'Current',
      unit: 'Ampere',
      currentValue: 28.4,
      minLimit: 5.0,
      maxLimit: 45.0,
      history: [27.5, 28.0, 28.2, 28.6, 28.1, 28.4],
    },
  ];

  const [sensors, setSensors] = useState<SimulatedSensor[]>(initialSensors);
  const [selectedSensorId, setSelectedSensorId] = useState('sen-01');
  const [isAutoTick, setIsAutoTick] = useState(true);
  const [lastTickTime, setLastTickTime] = useState<string>('Baru saja');

  // Client-side simulation tick (Runs in React state every 4s if enabled)
  useEffect(() => {
    if (!isAutoTick) return;

    const interval = setInterval(() => {
      triggerTick();
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoTick]);

  const triggerTick = () => {
    setSensors((prev) =>
      prev.map((s) => {
        const delta = (Math.random() - 0.49) * (s.type === 'Vibration' ? 0.3 : 0.8);
        const nextVal = Number((s.currentValue + delta).toFixed(2));
        const newHistory = [...s.history.slice(1), nextVal];
        return {
          ...s,
          currentValue: nextVal,
          history: newHistory,
        };
      })
    );
    setLastTickTime(new Date().toLocaleTimeString('id-ID'));
  };

  const selectedSensor = sensors.find((s) => s.id === selectedSensorId) || sensors[0];
  const isBreached =
    selectedSensor.currentValue < selectedSensor.minLimit ||
    selectedSensor.currentValue > selectedSensor.maxLimit;

  return (
    <section className="py-16 bg-[#F7F7F7] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E5E5E5] gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#737373] uppercase mb-1">
                <Radio className="w-4 h-4 text-[#111111]" />
                <span>Interaktif · Frontend Telemetri Visualizer</span>
              </div>
              <h3 className="text-xl font-bold text-[#111111]">
                Simulasi Pemantauan Node IoT Langsung
              </h3>
              <p className="text-xs text-[#737373] mt-0.5">
                Demonstrasi murni di sisi klien (React state) tanpa memerlukan backend atau koneksi eksternal.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAutoTick(!isAutoTick)}
                className={`px-3 py-1.5 text-xs font-mono rounded font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  isAutoTick
                    ? 'bg-[#111111] text-white hover:bg-[#242424]'
                    : 'bg-[#E5E5E5] text-[#242424] hover:bg-[#737373] hover:text-white'
                }`}
              >
                {isAutoTick ? '● Simulasi Berjalan (4s)' : '○ Simulasi Dijeda'}
              </button>

              <button
                type="button"
                onClick={triggerTick}
                title="Picu siklus perubahan nilai seketika"
                className="p-1.5 rounded border border-[#E5E5E5] hover:bg-[#F7F7F7] text-[#111111] cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sensor Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {sensors.map((s) => {
              const active = s.id === selectedSensorId;
              const hasAlert = s.currentValue < s.minLimit || s.currentValue > s.maxLimit;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSensorId(s.id)}
                  className={`p-3 rounded border text-left transition-all cursor-pointer ${
                    active
                      ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                      : 'border-[#E5E5E5] bg-[#F7F7F7] hover:border-[#737373] text-[#111111]'
                  }`}
                >
                  <div className={`text-[10px] font-mono ${active ? 'text-[#E5E5E5]' : 'text-[#737373]'}`}>
                    {s.node}
                  </div>
                  <div className="text-xs font-bold truncate mt-0.5">{s.name}</div>
                  <div className="mt-2 flex items-baseline justify-between font-mono">
                    <span className="text-sm font-bold tabular-nums">
                      {s.currentValue} {s.unit}
                    </span>
                    {hasAlert && (
                      <span className="text-[10px] text-red-400 font-bold">ALERT</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Telemetry Detail Screen */}
          <div className="p-5 rounded-lg border border-[#E5E5E5] bg-[#F7F7F7] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Value Callout (4 cols) */}
            <div className="md:col-span-4 space-y-3">
              <span className="text-xs font-mono uppercase text-[#737373] block">
                NILAI PEMBACAAN TERAKHIR:
              </span>
              <div className="text-4xl font-bold font-mono text-[#111111] tabular-nums flex items-baseline gap-2">
                <span>{selectedSensor.currentValue}</span>
                <span className="text-lg font-normal text-[#737373]">{selectedSensor.unit}</span>
              </div>

              <div className="text-xs font-mono text-[#737373] space-y-1">
                <div>Ambang Batas Normal: {selectedSensor.minLimit} s/d {selectedSensor.maxLimit} {selectedSensor.unit}</div>
                <div>Pembaruan Terakhir: {lastTickTime}</div>
              </div>

              <div className="pt-2">
                {isBreached ? (
                  <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="font-semibold">Peringatan: Nilai melampaui batas ambang aman!</span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded bg-white border border-[#E5E5E5] text-xs text-emerald-700 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">Kondisi Parameter Sensor Normal</span>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Trend Line Visualizer (8 cols) */}
            <div className="md:col-span-8 bg-white p-4 rounded border border-[#E5E5E5] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-[#111111]">TRENS TIKET HISTORIS (6 TITIK SAMPLING):</span>
                <span className="text-[#737373]">SATUAN: {selectedSensor.unit}</span>
              </div>

              {/* Step trend bar visualization */}
              <div className="h-28 flex items-end justify-between gap-3 pt-4 border-b border-[#E5E5E5] px-2">
                {selectedSensor.history.map((val, idx) => {
                  const range = selectedSensor.maxLimit - selectedSensor.minLimit || 10;
                  const ratio = Math.max(0.15, Math.min(1, (val - selectedSensor.minLimit) / range));
                  const heightPct = Math.round(ratio * 85);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-mono font-bold text-[#111111] tabular-nums">
                        {val}
                      </span>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full bg-[#111111] rounded-t transition-all duration-300 hover:bg-[#737373]"
                      />
                      <span className="text-[9px] font-mono text-[#737373]">T-{5 - idx}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#737373]">
                <span>BATAS MIN: {selectedSensor.minLimit} {selectedSensor.unit}</span>
                <span>BATAS MAKS: {selectedSensor.maxLimit} {selectedSensor.unit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
