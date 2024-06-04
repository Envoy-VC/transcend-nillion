import { create } from 'zustand';

import type { CarouselApi } from '~/components/ui/carousel';

export enum CreateVaultSteps {
  ConnectAccount = 1,
  CreateBiometricScan,
  SelectPeers,
  Finalize,
}

interface StepsState {
  api: CarouselApi | null;
}

interface StepsActions {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  hasNextStep: () => boolean;
  hasPreviousStep: () => boolean;
  setApi: (api: CarouselApi) => void;
}

export const useCreateVaultStore = create<StepsState & StepsActions>(
  (set, get) => ({
    api: null,
    setApi: (api) => {
      set({ api });
    },
    goToNextStep: () => {
      const { hasNextStep, api } = get();
      const canGoToNextStep = hasNextStep();
      if (canGoToNextStep) {
        api?.scrollNext();
      } else {
        throw new Error('Cannot go to next step');
      }
    },
    goToPreviousStep: () => {
      const { hasPreviousStep, api } = get();
      const canGoToPreviousStep = hasPreviousStep();
      if (canGoToPreviousStep) {
        api?.scrollPrev();
      } else {
        throw new Error('Cannot go to previous step');
      }
    },
    hasNextStep: () => {
      const { api } = get();
      return api?.canScrollNext() ?? false;
    },
    hasPreviousStep: () => {
      const { api } = get();
      return api?.canScrollPrev() ?? false;
    },
  })
);
