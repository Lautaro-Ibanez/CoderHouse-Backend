const form = document.getElementById("restorePasswordForm");
const text = document.getElementById("text");

const params = new URLSearchParams(window.location.search);
const token = params.get("token");

form.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  obj.token = token
  console.log(obj)
  const result = await fetch("api/sessions/restorePassword", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resultData = await result.json();
  if (resultData.status === "error") {
    text.innerHTML = "no puedes cambiar tu contraseña con la actual";
  }

  if (resultData.status === "success") {
    text.innerHTML =
      "contraseña cambiada con exito";
  }
});
