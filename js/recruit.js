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

//파일업로드 용량 설정

document.getElementById("fileUpload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  const maxSize = 10 * 1024 * 1024; // 10MB (바이트 단위)

  if (file) {
    if (file.size > maxSize) {
      alert("파일 크기가 10MB를 초과합니다. 더 작은 파일을 선택해주세요.");
      // 파일 선택 초기화
      e.target.value = "";
      return;
    }

    // 파일 크기가 적절한 경우
    console.log(
      `선택된 파일: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`
    );

    // 파일명 표시 (선택사항)
    const fileNameSpan = document.getElementById("fileName");
    if (fileNameSpan) {
      fileNameSpan.textContent = file.name;
      fileNameSpan.classList.add("selected");
    }
  }
});
