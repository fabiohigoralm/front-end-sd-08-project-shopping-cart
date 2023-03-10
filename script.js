function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const carregando = () => {
  const loading = document.createElement('h1');
  loading.className = 'loading';
  loading.innerHTML = 'loading...';
  document.body.appendChild(loading);
};

const removeCarregando = () => {
  const loading = document.querySelector('.loading');
  document.body.removeChild(loading);
};
const somandoTotal = () => {
  const selectSOMA = document.querySelectorAll('.cart__item');
  let total = 0;
  selectSOMA.forEach((selecao) => {
    console.log(selecao.innerHTML.split('PRICE: $')[1]);
    total += parseFloat(selecao.innerHTML.split('PRICE: $')[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
};

const salvandoLocal = () => {
  const itensCarrinho = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('itens', itensCarrinho);
};
const limparCarrinho = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    somandoTotal();
    salvandoLocal();
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const elementoRemover = event.target;
  elementoRemover.parentElement.removeChild(elementoRemover);
  somandoTotal();
  salvandoLocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

function addItemCarrinho() {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const elementParenteSelect = event.target.parentElement;
      const sku = getSkuFromProductItem(elementParenteSelect);
      const endSku = `https://api.mercadolibre.com/items/${sku}`;
      fetch(endSku)
        .then(response => response.json())
        .then((data) => {
          const obj = {
            sku,
            name: data.title,
            salePrice: data.price,
          };
          document.querySelector('.cart__items').appendChild(createCartItemElement(obj));
          somandoTotal();
          salvandoLocal();
        });
    }
  });
}

const carregandoLocal = () => {
  const listaItensSalvos = document.querySelector('.cart__items');
  listaItensSalvos.innerHTML = localStorage.getItem('itens');
  listaItensSalvos.addEventListener('click', ((event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  }));
  somandoTotal();
};

const buscarApi = () => {
  carregando();
  const endApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endApi)
    .then(response => response.json())
    .then((data) => {
      removeCarregando();
      data.results.forEach((item) => {
        const obj = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(obj));
      });
    });
};


window.onload = function onload() {
  buscarApi();
  addItemCarrinho();
  carregandoLocal();
  limparCarrinho();
};
