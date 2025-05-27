//header, footer 공통영역으로 분리

document.addEventListener("DOMContentLoaded", () => {
  fetch("./header.html") // 루트 기준이므로 슬래시(/)로 시작
    .then((res) => res.text())
    .then((data) => (document.getElementById("header").innerHTML = data));

  fetch("./quick.html")
    .then((res) => res.text())
    .then((data) => (document.getElementById("quickBar").innerHTML = data));

  fetch("./footer.html")
    .then((res) => res.text())
    .then((data) => (document.getElementById("footer").innerHTML = data));

  fetch("./page.html")
    .then((res) => res.text())
    .then((data) => (document.getElementById("page").innerHTML = data));
});
