/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import AppNavigation from '../src/navigation/AppNavigation';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<AppNavigation />);
  });
});
