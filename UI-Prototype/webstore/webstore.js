/* Page-specific scripts — index.html */

let cartCount = 3;
  const badge = document.getElementById('cartBadge');

  function addToCart() {
    cartCount++;
    badge.textContent = cartCount;
    badge.style.transform = 'scale(1.3)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
  }

  document.querySelectorAll('.cat-card').forEach(c => {
    c.addEventListener('click', () => {
      document.querySelectorAll('.cat-card').forEach(x => x.style.background = '#fff');
      c.style.background = '#fff7ed';
    });
  });
