// @ts-nocheck
import { it, expect } from '@jest/globals';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Application } from '../../src/client/Application';
import { ExampleApi } from '../../src/client/api';
import { CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { mockProducts, mockDetails } from '../__mocks__/mock.products';
import axios from 'axios';
import { basename, productDetailTestId } from '../constants';

jest.mock('axios');

const MockApiInstance = new ExampleApi(basename);

describe('\n🟪 Catalog should work', function () {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockProducts });
  });

  it('Should fetching data', async () => {
    const productsResponse = await MockApiInstance.getProducts();
    expect(productsResponse.data).toEqual(mockProducts);
  });

  it('Should render fetched mock products', async () => {
    const store = initStore(MockApiInstance, new CartApi());

    const application = (
      <MemoryRouter initialEntries={['/catalog']}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { getAllByTestId, getAllByRole } = render(application);

    const mockNames = mockProducts.map((el) => el.name);
    const productCards = await waitFor(() => getAllByTestId(/product_/i));

    expect(productCards.length).toEqual(mockProducts.length);

    const namesArray = (await waitFor(() => getAllByRole('heading', { level: 5 }))).map((el) => el.textContent);

    expect(mockNames.every((productName) => namesArray.includes(productName))).toBe(true);
  });

  it('Each card has price, description, link to product page', async () => {
    const store = initStore(MockApiInstance, new CartApi());

    const application = (
      <MemoryRouter initialEntries={['/catalog']}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { getAllByTestId, getAllByRole } = render(application);

    const productCards = await waitFor(() => getAllByTestId(/product_/i));

    const productTest = productCards.map((el) => [...el.querySelector('.card-body').children]);
    const names = productTest.map((el) => el[0].textContent);
    const prices = productTest.map((el) => el[1].textContent);
    const links = productTest.map((el) => el[2].getAttribute('href'));

    expect(mockProducts.every(({ name }, idx) => name === names[idx])).toBe(true);
    expect(mockProducts.every(({ price }, idx) => '$' + price === prices[idx])).toBe(true);
    expect(mockProducts.every(({ id }, idx) => `/catalog/${id}` === links[idx])).toBe(true);
  });
});

describe('\n🟫 Product page has', function () {
  beforeEach(() => {
    axios.get.mockImplementation((id) => ({ data: mockProducts.filter((el) => el.id == id) }));
  });

  const randomId = Math.floor(Math.random() * mockDetails.length);

  it('Product name ', async () => {
    const store = initStore(MockApiInstance, new CartApi());

    const application = (
      <MemoryRouter initialEntries={[`/catalog/${randomId}`]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    store.dispatch({
      type: 'PRODUCT_DETAILS_LOADED',
      details: mockDetails[randomId],
    });

    const { getByTestId } = render(application);

    const containerElem = await waitFor(() => getByTestId(productDetailTestId));
    const nameElem = containerElem.querySelector('h1');

    expect(nameElem.textContent).not.toBeNull;
  });

  it('Product description and price', async () => {
    const store = initStore(MockApiInstance, new CartApi());

    const application = (
      <MemoryRouter initialEntries={[`/catalog/${randomId}`]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    store.dispatch({
      type: 'PRODUCT_DETAILS_LOADED',
      details: mockDetails[randomId],
    });

    const { getByText } = render(application);

    const description = await waitFor(() => getByText(mockDetails[randomId].description));
    const price = await waitFor(() => getByText(`$${mockDetails[randomId].price}`));

    expect(description).not.toBeNull;
    expect(price).not.toBeNull;
  });

  it('Product color and material', async () => {
    const store = initStore(MockApiInstance, new CartApi());

    const application = (
      <MemoryRouter initialEntries={[`/catalog/${randomId}`]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    store.dispatch({
      type: 'PRODUCT_DETAILS_LOADED',
      details: mockDetails[randomId],
    });

    const { getByText } = render(application);

    const color = await waitFor(() => getByText(mockDetails[randomId].color));
    const material = await waitFor(() => getByText(mockDetails[randomId].material));

    expect(color).not.toBeNull;
    expect(material).not.toBeNull;
  });

  it('Product add to cart button', async () => {
    const store = initStore(MockApiInstance, new CartApi());

    const application = (
      <MemoryRouter initialEntries={[`/catalog/${randomId}`]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    store.dispatch({
      type: 'PRODUCT_DETAILS_LOADED',
      details: mockDetails[randomId],
    });

    const { getByRole } = render(application);
    const button = await waitFor(() => getByRole('button', { name: /add to cart/i }));

    expect(button).not.toBeNull;
    expect(button.classList.contains('btn-lg')).toBe(true);

    screen.logTestingPlaygroundURL();
  });
});
