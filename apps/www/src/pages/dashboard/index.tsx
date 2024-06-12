import React from 'react';

import { useOrbitDB } from '~/lib/hooks';

import { Button } from '~/components/ui/button';

import { withDashboardLayout } from './_components';

export const DashboardPage = () => {
  const { getDBDetails } = useOrbitDB();
  return withDashboardLayout(
    <div>
      <Button
        onClick={async () => {
          const res = await getDBDetails();
          console.log(res);
        }}
      >
        Click
      </Button>
    </div>
  );
};
