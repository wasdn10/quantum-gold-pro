import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Quantum Gold Pro', () => {
  const { getByText } = render(<App />);
  expect(getByText(/Quantum Gold Pro/i)).toBeInTheDocument();
});
