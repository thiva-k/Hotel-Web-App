import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProviderComp } from './ThemeProviderComp';

describe('ThemeProviderComp', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ThemeProviderComp darkMode={false}>
        <div>Test Child</div>
      </ThemeProviderComp>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('renders with light theme', () => {
    const { container } = render(
      <ThemeProviderComp darkMode={false}>
        <div>Test Child</div>
      </ThemeProviderComp>
    );
    const body = container.querySelector('body');
    expect(body).toHaveStyle('background-color: #fff'); // You may need to adjust this based on your actual light theme color
  });

  it('renders with dark theme', () => {
    const { container } = render(
      <ThemeProviderComp darkMode={true}>
        <div>Test Child</div>
      </ThemeProviderComp>
    );
    const body = container.querySelector('body');
    expect(body).toHaveStyle('background-color: #000'); // You may need to adjust this based on your actual dark theme color
  });
});
