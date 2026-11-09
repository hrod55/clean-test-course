import { render, screen } from '@testing-library/react';
import axios from 'axios';
import Home from '.';

const categoriesResponse = {
  data: {
    status: 'success',
    data: [
      {
        id: 1,
        name: 'Handhelds',
        description: "So big, you don't need thumbs.",
      },
      {
        id: 2,
        name: 'Appeteasers',
        description: 'Tease the hangry hippo, he get hangrier',
      },
    ],
  },
};

describe('Test Home', () => {
  const originalAdapter = axios.defaults.adapter;

  afterEach(() => {
    axios.defaults.adapter = originalAdapter;
    jest.restoreAllMocks();
  });

  test('Test Render', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockResolvedValue(categoriesResponse);

    render(<Home />);

    expect(await screen.findAllByTestId(/category-item/i)).toHaveLength(2);
    expect(await screen.findByText('Appeteasers')).toBeInTheDocument();
  });

  test('Test Integration Render', async () => {
    // jsdom cannot make browser XHR requests to external hosts; use Axios's
    // Node adapter so this test reaches the real API.
    axios.defaults.adapter = require('axios/lib/adapters/http');
    render(<Home />);

    expect(await screen.findAllByTestId(/category-item/i, {}, { timeout: 5000 }))
      .toHaveLength(2);
    expect(await screen.findByText('Appeteasers')).toBeInTheDocument();
  });
});
