document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const resultBox = document.getElementById("formResult");
  const popup = document.getElementById("successPopup");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // ❗ stabdo puslapio persikrovimą

    // 1. Surenkam duomenis
    const data = {
      name: document.getElementById("name").value,
      surname: document.getElementById("surname").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      ratingInfo: Number(document.getElementById("ratingInfo").value),
      ratingSmooth: Number(document.getElementById("ratingSmooth").value),
      ratingFind: Number(document.getElementById("ratingFind").value)
    };

    // 2. Console log (4a.i)
    console.log("Formos duomenys:", data);

    // 3. Vidurkis (5 punktas)
    const avg =
      (data.ratingInfo + data.ratingSmooth + data.ratingFind) / 3;

    const avgRounded = avg.toFixed(1);

    // 4. Atvaizdavimas po forma (4a.ii + 5)
    resultBox.style.display = "block";
    resultBox.innerHTML = `
      <strong>Vardas:</strong> ${data.name}<br>
      <strong>Pavardė:</strong> ${data.surname}<br>
      <strong>El. paštas:</strong> <a href="mailto:${data.email}">${data.email}</a><br>
      <strong>Tel. numeris:</strong> ${data.phone}<br>
      <strong>Adresas:</strong> ${data.address}<br><br>
      <strong>${data.name} ${data.surname}:</strong> vidurkis ${avgRounded}
    `;

    // 5. Pop-up (6 punktas)
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
    }, 3000);

    // (nebūtina, bet gražu)
    form.reset();
  });
});
