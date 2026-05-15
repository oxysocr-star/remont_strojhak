import { create } from 'zustand';
import { TariffType, ObjectType } from '../types';

interface CalculatorState {
  step: number;
  propertyType: string | null;
  area: number;
  objectType: ObjectType | null;
  tariff: TariffType | null;
  timeframe: string | null;
  setStep: (step: number) => void;
  setPropertyType: (type: string) => void;
  setArea: (area: number) => void;
  setObjectType: (type: ObjectType) => void;
  setTariff: (tariff: TariffType) => void;
  setTimeframe: (time: string) => void;
  reset: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  step: 1,
  propertyType: null,
  area: 50,
  objectType: null,
  tariff: null,
  timeframe: null,
  setStep: (step) => set({ step }),
  setPropertyType: (propertyType) => set({ propertyType }),
  setArea: (area) => set({ area }),
  setObjectType: (objectType) => set({ objectType }),
  setTariff: (tariff) => set({ tariff }),
  setTimeframe: (timeframe) => set({ timeframe }),
  reset: () => set({ step: 1, propertyType: null, area: 50, objectType: null, tariff: null, timeframe: null })
}));

interface AiState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useAiStore = create<AiState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen })
}));
