// 기존 코드 앞에 추가
window.addEventListener("unhandledrejection", function (event) {
  // 브라우저 확장 프로그램 오류 무시
  if (
    event.reason &&
    event.reason.message &&
    event.reason.message.includes("message channel closed")
  ) {
    event.preventDefault();
    return;
  }
});

//header, footer 공통영역으로 분리
document.addEventListener("DOMContentLoaded", () => {
  const headerElement = document.getElementById("header");
  const quickBarElement = document.getElementById("quickBar");
  const footerElement = document.getElementById("footer");
  const pageElement = document.getElementById("page");

  if (headerElement) {
    fetch("./header.html")
      .then((res) => res.text())
      .then((data) => (headerElement.innerHTML = data));
  }

  if (quickBarElement) {
    fetch("./quick.html")
      .then((res) => res.text())
      .then((data) => (quickBarElement.innerHTML = data));
  }

  if (footerElement) {
    fetch("./footer.html")
      .then((res) => res.text())
      .then((data) => (footerElement.innerHTML = data));
  }

  // page 요소가 있는 페이지에서만 실행
  if (pageElement) {
    fetch("./page.html")
      .then((res) => res.text())
      .then((data) => (pageElement.innerHTML = data));
  }
});
