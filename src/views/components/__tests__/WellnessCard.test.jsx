import { render, screen, fireEvent } from '@testing-library/react';
import WellnessCard from '../WellnessCard';

describe('WellnessCard Component', () => {
  test('renders title and children', () => {
    render(
      <WellnessCard title="Test Title">
        <p data-testid="test-content">Test Content</p>
      </WellnessCard>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('does not show tooltip by default', () => {
    render(
      <WellnessCard title="Test Title" tooltip="Test Tooltip">
        <p>Test Content</p>
      </WellnessCard>
    );
    
    expect(screen.queryByText('Test Tooltip')).not.toBeInTheDocument();
  });

  test('shows tooltip when info button is clicked', () => {
    render(
      <WellnessCard title="Test Title" tooltip="Test Tooltip">
        <p>Test Content</p>
      </WellnessCard>
    );
    
    // Find and click the info button (using the SVG role)
    const infoButton = screen.getByRole('button', { name: /show information/i });
    fireEvent.click(infoButton);
    
    expect(screen.getByText('Test Tooltip')).toBeInTheDocument();
  });

  test('applies additional className', () => {
    render(
      <WellnessCard title="Test Title" className="test-class">
        <p>Test Content</p>
      </WellnessCard>
    );
    
    const cardElement = screen.getByText('Test Title').closest('div');
    expect(cardElement).toHaveClass('test-class');
  });
});
