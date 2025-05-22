// 아코디언 기능
const accordions = document.querySelectorAll(".accordion-header");

accordions.forEach((accordion) => {
  accordion.addEventListener("click", function () {
    // 활성화된 상태 토글
    this.classList.toggle("active");

    // 컨텐츠 요소
    const content = this.nextElementSibling;

    // 컨텐츠 열기/닫기
    if (this.classList.contains("active")) {
      content.style.maxHeight = content.scrollHeight + "px";
    } else {
      content.style.maxHeight = null;
    }
  });
});

// 체크박스 기능
const allCheck = document.getElementById("all-check");
const termCheckboxes = document.querySelectorAll(
  '.terms-item input[type="checkbox"]'
);
const requiredCheckbox = document.querySelector(".required-check");
const submitButton = document.getElementById("submit-btn");

// 전체 선택 체크박스 이벤트
allCheck.addEventListener("change", function () {
  termCheckboxes.forEach((checkbox) => {
    checkbox.checked = this.checked;
  });

  // 필수 약관 체크 여부에 따라 버튼 활성화
  submitButton.disabled = !requiredCheckbox.checked;
});

// 개별 체크박스 이벤트
termCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    // 모든 체크박스가 선택되었는지 확인
    const allChecked = Array.from(termCheckboxes).every(
      (checkbox) => checkbox.checked
    );
    allCheck.checked = allChecked;

    // 필수 약관 체크 여부에 따라 버튼 활성화
    submitButton.disabled = !requiredCheckbox.checked;
  });
});

//아이디 중복값 확인

document.addEventListener("DOMContentLoaded", function () {
  // .duplicate 클래스를 가진 버튼 찾기
  const duplicateBtn = document.querySelector(".duplicate");

  // 버튼이 존재하면 클릭 이벤트 리스너 추가
  if (duplicateBtn) {
    duplicateBtn.addEventListener("click", checkDuplicate);
  }

  // 중복 확인 함수
  function checkDuplicate() {
    // input 값 가져오기
    const inputElement = document.getElementById("userId");
    const resultElement = document.getElementById("result");

    // input 요소가 없을 경우 처리
    if (!inputElement || !resultElement) {
      console.error("필요한 DOM 요소를 찾을 수 없습니다.");
      return;
    }

    const inputValue = inputElement.value.trim();

    // 1. input 태그가 공백일 경우
    if (inputValue === "") {
      resultElement.textContent = "사용하실 아이디를 입력해 주세요.";
      resultElement.style.color = "red";
      return;
    }

    // DB 서버에서 중복 확인을 위한 AJAX 요청 (예시)
    checkDuplicateFromServer(inputValue)
      .then((isDuplicate) => {
        // 2. DB 서버에 중복되는 내용이 있을 경우
        if (isDuplicate) {
          resultElement.textContent = "이미 사용 중인 아이디입니다.";
          resultElement.style.color = "red";
        }
        // 3. 중복되지 않는 경우
        else {
          resultElement.textContent = `"${inputValue}"은(는) 사용하실 수 있는 아이디입니다.`;
          resultElement.style.color = "green";
        }
      })
      .catch((error) => {
        console.error("서버 요청 중 오류가 발생했습니다:", error);
        resultElement.textContent =
          "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
        resultElement.style.color = "red";
      });
  }

  // 서버에 중복 확인 요청을 보내는 함수 (실제 구현은 서버 환경에 맞게 수정 필요)
  function checkDuplicateFromServer(userId) {
    // 이 부분은 실제 서버로 Ajax 요청을 보내는 코드로 대체해야 합니다.
    // 여기서는 예시로 Fetch API를 사용합니다.
    return new Promise((resolve, reject) => {
      // 실제 환경에서는 아래 주석을 해제하고 적절한 URL로 변경하세요
      /*
      fetch(`/api/check-duplicate?userId=${encodeURIComponent(userId)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          resolve(data.isDuplicate); // 서버에서 중복 여부를 boolean으로 반환한다고 가정
        })
        .catch(error => {
          reject(error);
        });
      */

      // 테스트를 위한 가상 응답 (실제 구현 시 삭제)
      setTimeout(() => {
        // 테스트 용도: 'test123'은 이미 DB에 있다고 가정
        const isDuplicate = userId === "test123";
        resolve(isDuplicate);
      }, 500);
    });
  }
});
