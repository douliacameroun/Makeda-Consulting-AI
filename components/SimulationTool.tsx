
import React, { useState, useEffect, useCallback } from 'react';
import { InvestmentChart } from './InvestmentChart';

export const SimulationTool: React.FC = () => {
  const [initialCapital, setInitialCapital] = useState(5000000);
  const [monthlySavings, setMonthlySavings] = useState(100000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(6);
  const [chartData, setChartData] = useState<any[]>([]);

  const calculateGrowth = useCallback(() => {
    let current = initialCapital;
    const data = [{ year: 0, value: initialCapital }];
    const monthlyRate = rate / 100 / 12;
    for (let i = 1; i <= years; i++) {
      for (let m = 1; m <= 12; m++) {
        current = (current + monthlySavings) * (1 + monthlyRate);
      }
      data.push({ year: i, value: Math.round(current) });
    }
    setChartData(data);
  }, [initialCapital, monthlySavings, years, rate]);

  useEffect(() => { calculateGrowth(); }, [calculateGrowth]);

  const finalValue = chartData.length > 0 ? chartData[chartData.length - 1].value : 0;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-black text-black uppercase tracking-widest mb-10 flex items-center">
        <span className="bg-black text-white p-2 rounded-lg mr-4 text-xs">GOAL</span>
        Simulateur de Croissance Makeda
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Capital Initial (FCFA)</label>
            <input 
              type="number" 
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-black outline-none font-bold transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Épargne Mensuelle</label>
            <input 
              type="number" 
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-black outline-none font-bold transition-all"
            />
          </div>
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Durée (Années)</label>
              <input 
                type="range" 
                min="1" max="30"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <span className="text-xs font-bold text-gray-500 mt-2 block">{years} ans</span>
            </div>
            <div className="w-24">
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Taux (%)</label>
              <input 
                type="number" 
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-black outline-none font-bold"
              />
            </div>
          </div>
        </div>

        <div className="bg-black text-white p-8 rounded-3xl flex flex-col justify-center items-center shadow-2xl">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Capital Final Estimé</p>
          <p className="text-4xl font-black mb-4">
            {finalValue.toLocaleString()} <span className="text-lg opacity-50">FCFA</span>
          </p>
          <div className="text-[10px] font-bold bg-white/10 px-4 py-2 rounded-full uppercase tracking-widest">
            Rendement Horizon Inclus
          </div>
        </div>
      </div>

      <InvestmentChart data={chartData} />
    </div>
  );
};
