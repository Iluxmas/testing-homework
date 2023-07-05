const baseUrl = 'http://localhost:3000/hw/store';
const basename = '/hw/store';
const burgerBtnSelector = 'button.navbar-toggler';

const navMenuSelector = 'div.Application-Menu';
const navmenuTestId = 'menu_container';
const navLinkSelector = 'a.nav-link';

const bodySelector = 'body';

const productDetailTestId = 'product_description';
const catalogListTestId = 'catalog_list';
const linkListTestId = 'navbar_linksContainer';
const addToCartBtnSelector = 'button.ProductDetails-AddToCart';
const cardBadgeSelector = 'span.CartBadge';
const cartBadgeTestId = 'cartBadge';

const addressInputTestid= 'addressInput'
const nameInputTestId = 'nameInput'
const phoneInputTestId = 'phoneInput'
const submitButtonTestId = 'submitBtn'
const orderMessageTestId = 'order-success'
const orderSpanTestId = 'order-success-span'
const nameErrTestId = 'nameError'
const phoneErrTestId = 'phoneError'
const addressErrTestId = 'addressError'

const cartAmountSelector ='td.Cart-Count';
const cartTableSelector = 'table.Cart-Table';
const cartClearBtnSelector = 'button.Cart-Clear';

module.exports = {
  burgerBtnSelector,
  navMenuSelector,
  bodySelector,
  navmenuTestId,
  linkListTestId,
  navLinkSelector,
  baseUrl,
  basename,
  catalogListTestId,
  productDetailTestId,
  addToCartBtnSelector,
  cardBadgeSelector,
  cartAmountSelector,
  cartTableSelector,
  cartClearBtnSelector,
  cartBadgeTestId,
  nameInputTestId,
  phoneInputTestId,
  addressInputTestid,
  submitButtonTestId,
  orderMessageTestId,
  nameErrTestId,
  phoneErrTestId,
  addressErrTestId,
  orderSpanTestId
};
