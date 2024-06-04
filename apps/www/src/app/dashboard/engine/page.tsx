import React from 'react';

import { AllSecretsTable, Header } from '../_components';

const SecretsEngine = () => {
  return (
    <div>
      <Header title='Secrets Engine' />
      <AllSecretsTable />
    </div>
  );
};

export default SecretsEngine;
