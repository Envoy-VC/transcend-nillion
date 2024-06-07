import React from 'react';

import { AllSecretsTable, Header, withDashboardLayout } from '../_components';

export const SecretsEnginePage = () => {
  return withDashboardLayout(
    <div>
      <Header title='Secrets Engine' />
      <AllSecretsTable /> 
    </div>
  );
};
