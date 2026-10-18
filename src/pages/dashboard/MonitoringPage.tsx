import React, { useState, useEffect } from 'react';
import { ApiClient } from '../../lib/api';
import {
  Sliders,
  RefreshCw,
  Activity,
  AlertTriangle,
  Server,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

export const MonitoringPage: React.FC = () => {
  const [sensors, setSensors] = useState<any[]>([]);
  const [selectedSensorId, setSelectedSensorId] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [chartData, setChartData] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMonitoringData = async () => {
    setRefreshing(true);
    const [sensRes, chartRes, measRes] = await Promise.all([
      ApiClient.get<any[]>('/api/sensors'),
      ApiClient.get<any[]>(`/api/measurements/chart?sensor_id=${selectedSensorId}&range=${timeRange}`),
      ApiClient.get<any>(`/api/measurements?${selectedSensorId !== 'all' ? `sensor_id=${selectedSensorId}&` : ''}limit=25`),
    ]);

    if (sensRes.success && sensRes.data) {
      setSensors(sensRes.data);
    }
    if (chartRes.success && chartRes.data) {
      setChartData(chartRes.data);
    }
    if (measRes.success && measRes.data) {
      setMeasurements(measRes.data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMonitoringData();
    const interval = setInterval(fetchMonitoringData, 6000);
    return () => clearInterval(interval);
  }, [selectedSensorId, timeRange]);

  const activeSensorObj = sensors.find((s) => String(s.id) === selectedSensorId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Monitoring Telemetri Real-Time
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Visualisasi time-series, deteksi anomali batas ambang, dan inspeksi pembacaan transduser.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMonitoringData}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded text-xs font-semibold text-zinc-700 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Segarkan Feed</span>
        </button>
      </div>

      {/* Control Filter Bar */}
      <div className="p-4 bg-white rounded-lg border border-zinc-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-700">Pilih Sensor:</span>
          <select
            value={selectedSensorId}
            onChange={(e) => setSelectedSensorId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded border border-zinc-300 bg-white font-medium"
          >
            <option value="all">Semua Sensor (Agregat)</option>
            {sensors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.unit}) — {s.device_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-mono">RENTANG WAKTU:</span>
          {['1h', '6h', '24h', '7d'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTimeRange(r)}
              className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer ${
                timeRange === r
                  ? 'bg-zinc-950 text-white font-bold'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">
              {activeSensorObj ? activeSensorObj.name : 'Grafik Telemetri Agregat'}
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              {activeSensorObj
                ? `UID: ${activeSensorObj.sensor_uid} · Batas: ${activeSensorObj.min_threshold} s/d ${activeSensorObj.max_threshold} ${activeSensorObj.unit}`
                : 'Menampilkan data pembacaan seluruh sensor dalam rentang waktu yang dipilih'}
            </p>
          </div>

          <div className="text-right text-xs font-mono text-zinc-500 hidden sm:block">
            {chartData.length} Titik Data Terplot
          </div>
        </div>

        <div className="h-72 w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-zinc-400 font-mono">
              Tidak ada data telemetri pada rentang waktu ini.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 15, right: 20, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                <XAxis
                  dataKey="timestamp"
                  stroke="#71717A"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis
                  stroke="#71717A"
                  fontSize={10}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-zinc-950 text-white p-2.5 rounded shadow-xl text-xs font-mono">
                          <p className="font-bold">{d.sensorName}</p>
                          <p className="text-zinc-200">
                            Nilai: <span className="text-white font-bold">{d.value} {d.unit}</span>
                          </p>
                          <p className="text-[10px] text-zinc-400">Waktu: {d.fullTime}</p>
                          {d.isBreached && (
                            <p className="text-[10px] text-red-400 font-bold mt-1">
                              ⚠️ MELAMPAUI AMBANG ({d.minThreshold} - {d.maxThreshold} {d.unit})
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {activeSensorObj && (
                  <>
                    <ReferenceLine
                      y={activeSensorObj.max_threshold}
                      label={{ value: `Maks: ${activeSensorObj.max_threshold} ${activeSensorObj.unit}`, fill: '#DC2626', fontSize: 10, position: 'top' }}
                      stroke="#DC2626"
                      strokeDasharray="4 4"
                    />
                    <ReferenceLine
                      y={activeSensorObj.min_threshold}
                      label={{ value: `Min: ${activeSensorObj.min_threshold} ${activeSensorObj.unit}`, fill: '#DC2626', fontSize: 10, position: 'bottom' }}
                      stroke="#DC2626"
                      strokeDasharray="4 4"
                    />
                  </>
                )}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#18181B"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: '#18181B' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Real-time Telemetry Log Table */}
      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Log Transmisi Pengukuran Masuk
          </h3>
          <span className="text-[11px] font-mono text-zinc-500">25 Data Terakhir</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-100/60 border-b border-zinc-200 text-zinc-500 font-mono uppercase text-[11px]">
                <th className="py-2.5 px-4">Waktu Rekam</th>
                <th className="py-2.5 px-4">Sensor Transduser</th>
                <th className="py-2.5 px-4">Perangkat Node</th>
                <th className="py-2.5 px-4">Nilai Telemetri</th>
                <th className="py-2.5 px-4">Rentang Ambang</th>
                <th className="py-2.5 px-4">Status Kondisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {measurements.map((m) => {
                const isBreached = m.value < m.min_threshold || m.value > m.max_threshold;
                return (
                  <tr key={m.id} className="hover:bg-zinc-50">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-zinc-500">
                      {m.recorded_at}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-zinc-900">
                      {m.sensor_name}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-zinc-600">
                      {m.device_name}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-sm tabular-nums">
                      <span className={isBreached ? 'text-red-600' : 'text-zinc-900'}>
                        {m.value} {m.unit}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-zinc-500">
                      {m.min_threshold} s/d {m.max_threshold} {m.unit}
                    </td>
                    <td className="py-2.5 px-4">
                      {isBreached ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          ANOMALI
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          NORMAL
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
