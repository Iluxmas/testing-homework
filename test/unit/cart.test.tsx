// @ts-nocheck
import { it } from '@jest/globals';
import React from 'react';
import axios from 'axios';
import event from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Application } from '../../src/client/Application';
import { ExampleApi } from '../../src/client/api';
import { CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { mockProducts } from '../__mocks__/mock.products';
import {
  basename,
  cartBadgeTestId,
  nameInputTestId,
  phoneInputTestId,
  addressInputTestid,
  submitButtonTestId,
  orderMessageTestId,
  nameErrTestId,
  phoneErrTestId,
  addressErrTestId,
} from '../constants';

jest.mock('axios');
const MockApiInstance = new ExampleApi(basename);

describe('\n🟫 should have Badge if product was added', function () {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockProducts });
  });

  const randomId = Math.floor(Math.random() * mockProducts.length);

  it('In catalog page', async () => {
    const store = initStore(MockApiInstance, new CartApi());

    store.dispatch({
      type: 'ADD_TO_CART',
      product: mockProducts[randomId],
    });

    const application = (
      <MemoryRouter initialEntries={[`/catalog`]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { container } = render(application);

    await screen.findByTestId(cartBadgeTestId);
  });
});

describe('\n Cart should save data', function () {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockProducts });
  });

  const randomId = Math.floor(Math.random() * mockProducts.length);

  it('after page reload', async function () {
    const store = initStore(MockApiInstance, new CartApi());

    const application = (
      <MemoryRouter initialEntries={[`/cart`]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    store.dispatch({
      type: 'ADD_TO_CART',
      product: mockProducts[randomId],
    });
    location.reload();

    const store = initStore(MockApiInstance, new CartApi());
    const amount = store.getState().cart[randomId].count;

    expect(amount).toBe(1);
  });
});

describe('\n Cart form should be valid', function () {
  beforeEach(() => {
    localStorage.clear();
    axios.post.mockResolvedValue({ data: { id: 1 } });
    axios.get.mockResolvedValue({ data: mockProducts });
  });

  it('Accept valid data', async function () {
    const randomId = Math.floor(Math.random() * mockProducts.length);
    const store = initStore(MockApiInstance, new CartApi());

    const application = (
      <MemoryRouter initialEntries={[`/cart`]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    store.dispatch({
      type: 'ADD_TO_CART',
      product: mockProducts[randomId],
    });

    const { getByTestId } = render(application);

    const nameInput = getByTestId(nameInputTestId);
    const phoneInput = getByTestId(phoneInputTestId);
    const addressInput = getByTestId(addressInputTestid);

    await event.type(nameInput, 'TestName');
    await event.type(phoneInput, '1234567890');
    await event.type(addressInput, 'NewYork, MJ Street 4, 20');

    await event.click(getByTestId(submitButtonTestId));

    const message = getByTestId(orderMessageTestId);

    expect(message).not.toBeNull();
  });

  it('Not accept invalid data', async function () {
    const randomId = Math.floor(Math.random() * mockProducts.length);
    const store = initStore(MockApiInstance, new CartApi());

    const application = (
      <MemoryRouter initialEntries={[`/cart`]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    store.dispatch({
      type: 'ADD_TO_CART',
      product: mockProducts[randomId],
    });

    const { getByTestId } = render(application);

    const nameInput = getByTestId(nameInputTestId);
    await event.type(nameInput, 'TestName');

    await event.click(getByTestId(submitButtonTestId));

    expect(getByTestId(nameInputTestId)).not.toBeNull();
    expect(getByTestId(phoneErrTestId)).not.toBeNull();
    expect(getByTestId(addressErrTestId)).not.toBeNull();
  });
});
