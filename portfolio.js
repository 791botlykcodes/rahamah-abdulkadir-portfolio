const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('.lightbox-image');
const caption = lightbox.querySelector('#gallery-caption');
const count = lightbox.querySelector('.gallery-count');
const closeButton = lightbox.querySelector('.lightbox-close');
const photoLinks = Array.from(document.querySelectorAll('[data-gallery]'));

let activePhotos = [];
let activeIndex = 0;
let opener;

function showPhoto(index) {
  activeIndex = (index + activePhotos.length) % activePhotos.length;
  const photo = activePhotos[activeIndex];
  lightboxImage.alt = photo.querySelector('img').alt;
  lightboxImage.src = photo.href;
  caption.textContent = photo.dataset.caption;
  count.textContent = `${activeIndex + 1} / ${activePhotos.length}`;
}

if (typeof lightbox.showModal === 'function') {
  for (const link of photoLinks) {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      opener = link;
      activePhotos = photoLinks.filter((photo) => photo.dataset.gallery === link.dataset.gallery);
      showPhoto(activePhotos.indexOf(link));
      lightbox.showModal();
      closeButton.focus();
    });
  }

  closeButton.addEventListener('click', () => lightbox.close());
  lightbox.querySelector('.gallery-previous').addEventListener('click', () => showPhoto(activeIndex - 1));
  lightbox.querySelector('.gallery-next').addEventListener('click', () => showPhoto(activeIndex + 1));

  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showPhoto(activeIndex - 1);
    if (event.key === 'ArrowRight') showPhoto(activeIndex + 1);
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener('close', () => {
    lightboxImage.removeAttribute('src');
    opener.focus();
  });
}

if ('IntersectionObserver' in window && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.14 });

  document.querySelectorAll('.feature, .education-photos, .research').forEach((element) => observer.observe(element));
}
