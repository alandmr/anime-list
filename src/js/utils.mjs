async function loadComponent(id, file) {
  const response = await fetch(file);
  const html = await response.text();

  document.querySelector(id).innerHTML = html;
}

export default async function loadHeaderFooter() {
  await loadComponent(
    "#main-header",
    "/partials/header.html"
  );

//   await loadComponent(
//     "#main-footer",
//     "/partials/footer.html"
//   );
}