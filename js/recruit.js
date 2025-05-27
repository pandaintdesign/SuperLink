// 버튼 선택 기능
document.addEventListener("DOMContentLoaded", function () {
  // 진행조건 버튼들
  const prizeButtons = document.querySelectorAll(".selectPrize");
  prizeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      prizeButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // 인원 선택 버튼들
  const peopleButtons = document.querySelectorAll(".selectPeopleNum");
  peopleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      peopleButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // 방문자 범위 버튼들
  const visitButtons = document.querySelectorAll(".visitNum");
  visitButtons.forEach((button) => {
    button.addEventListener("click", function () {
      visitButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // 폼 제출 처리
  const form = document.querySelector(".recruitArea");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // 선택된 버튼들 확인
    const selectedPrize = document.querySelector(".selectPrize.active");
    const selectedPeople = document.querySelector(".selectPeopleNum.active");
    const selectedVisit = document.querySelector(".visitNum.active");

    if (!selectedPrize || !selectedPeople || !selectedVisit) {
      alert("모든 선택 항목을 완료해주세요.");
      return;
    }

    alert("캠페인 신청이 완료되었습니다!");
  });
});
