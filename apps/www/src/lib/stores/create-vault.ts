import { create } from 'zustand';

export enum CreateVaultSteps {
  ConnectAccount = 1,
  CreateBiometricScan,
  ConfigureRootKeys,
  SelectPeers,
  Finalize,
}

interface StepsState {
  currentStep: CreateVaultSteps;
}

interface StepsActions {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  setSteps: (step: CreateVaultSteps) => void;
  hasNextStep: () => boolean;
  hasPreviousStep: () => boolean;
  reset: () => void;
}

export const useCreateVaultStore = create<StepsState & StepsActions>(
  (set, get) => ({
    currentStep: CreateVaultSteps.SelectPeers,
    goToNextStep: () => {
      const { currentStep, hasNextStep } = get();
      const canGoToNextStep = hasNextStep();
      if (canGoToNextStep) {
        set({ currentStep: currentStep + 1 });
      } else {
        throw new Error('Cannot go to next step');
      }
    },
    goToPreviousStep: () => {
      const { currentStep, hasPreviousStep } = get();
      const canGoToPreviousStep = hasPreviousStep();
      if (canGoToPreviousStep) {
        set({ currentStep: currentStep - 1 });
      } else {
        throw new Error('Cannot go to previous step');
      }
    },
    setSteps: (step) => {
      set({ currentStep: step });
    },
    hasNextStep: () => {
      const { currentStep } = get();
      return currentStep < CreateVaultSteps.Finalize;
    },
    hasPreviousStep: () => {
      const { currentStep } = get();
      return currentStep > CreateVaultSteps.ConnectAccount;
    },
    reset: () => {
      set({ currentStep: CreateVaultSteps.ConnectAccount });
    },
  })
);
