// 직접입력 버튼 클릭 시 input 박스 출현
const blankCheckBtn = document.getElementById("customPaymentBtn");
const customPaymentDiv = document.getElementById("customPayment");
const blankCheckInput = document.getElementById("blankCheck");
const won100K = document.getElementById("won100k");
const won300K = document.getElementById("won300k");
const won1000K = document.getElementById("won1000k");

// 모든 금액 버튼 선택 (활성화용)
const wonPriceBtns = document.querySelectorAll(".wonPrice");

// 모든 결제수단 버튼 선택 (활성화용)
const payBtns = document.querySelectorAll(".payBtn");

// 결제 버튼 선택
const sendPaymentBtn = document.querySelector(".sendPayment");

function openPaymentBlankCheck() {
  blankCheckBtn.addEventListener("click", function () {
    customPaymentDiv.style.display = "block";

    // 직접입력 버튼 활성화
    wonPriceBtns.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
  });
}

// 금액 버튼 클릭 시 input에 값 입력
function addPay() {
  won100K.addEventListener("click", function () {
    blankCheckInput.value = "100000";

    // 버튼 활성화
    wonPriceBtns.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
  });

  won300K.addEventListener("click", function () {
    blankCheckInput.value = "300000";

    // 버튼 활성화
    wonPriceBtns.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
  });

  won1000K.addEventListener("click", function () {
    blankCheckInput.value = "1000000";

    // 버튼 활성화
    wonPriceBtns.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
  });
}

// 결제수단 버튼 활성화
function activatePaymentMethod() {
  payBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // 모든 결제수단 버튼에서 active 클래스 제거
      payBtns.forEach((otherBtn) => {
        otherBtn.classList.remove("active");
      });

      // 클릭된 버튼에 active 클래스 추가
      this.classList.add("active");
    });
  });
}

// 선택된 금액 가져오기
function getSelectedAmount() {
  const activeBtn = document.querySelector(".wonPrice.active");
  const customInput = document.getElementById("blankCheck");

  if (activeBtn && activeBtn.id === "customPaymentBtn") {
    return customInput.value
      ? parseInt(customInput.value).toLocaleString() + "원"
      : "0원";
  } else if (activeBtn) {
    return activeBtn.textContent;
  }
  return "0원";
}

// 선택된 결제수단 가져오기
function getSelectedPaymentMethod() {
  const activePayBtn = document.querySelector(".payBtn.active");
  return activePayBtn ? activePayBtn.textContent : "선택 안됨";
}

// 현재 시간 업데이트 함수
function updateDateTime() {
  const now = new Date();
  const currentDate = now.toLocaleDateString("ko-KR");
  const currentTime = now.toLocaleTimeString("ko-KR", { hour12: false });
  return `${currentDate} ${currentTime}`;
}

// 로딩 애니메이션 생성
function createLoadingModal() {
  const loadingHTML = `
   <div id="loadingModal" class="loading-modal">
     <div class="loading-content">
       <div class="spinner"></div>
       <p>결제 처리 중입니다...</p>
       <p class="loading-text">잠시만 기다려주세요.</p>
     </div>
   </div>
 `;
  document.body.insertAdjacentHTML("beforeend", loadingHTML);
}

// 결제 완료 모달 생성
function showCompleteModal() {
  // 로딩 모달 제거
  const loadingModal = document.getElementById("loadingModal");
  if (loadingModal) {
    loadingModal.remove();
  }

  const completeHTML = `
   <div id="completeModal" class="complete-modal">
     <div class="complete-content">
       <div class="success-icon">✓</div>
       <h2>결제가 완료되었습니다!</h2>
       <div class="payment-info">
         <p>충전 금액: <span class="highlight">${getSelectedAmount()}</span></p>
         <p>결제 방법: <span class="highlight">${getSelectedPaymentMethod()}</span></p>
         <p>결제 일시: <span class="highlight">${updateDateTime()}</span></p>
       </div>
       <div class="action-buttons">
         <button onclick="location.href='mypage.html'" class="btn primary">마이페이지</button>
         <button onclick="location.href='home.html'" class="btn secondary">홈으로</button>
         <button onclick="closeCompleteModal()" class="btn close">닫기</button>
       </div>
     </div>
   </div>
 `;
  document.body.insertAdjacentHTML("beforeend", completeHTML);
}

// 결제 완료 모달 닫기
function closeCompleteModal() {
  const completeModal = document.getElementById("completeModal");
  if (completeModal) {
    completeModal.remove();
  }
}

// 전체 결제 프로세스
function processPayment() {
  if (sendPaymentBtn) {
    sendPaymentBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // 입력 검증
      const selectedAmount = document.querySelector(".wonPrice.active");
      const selectedPayment = document.querySelector(".payBtn.active");

      if (!selectedAmount) {
        alert("충전 금액을 선택해주세요.");
        return;
      }

      if (!selectedPayment) {
        alert("결제 수단을 선택해주세요.");
        return;
      }

      // 직접입력인 경우 금액 확인
      if (selectedAmount.id === "customPaymentBtn") {
        const customAmount = blankCheckInput.value;
        if (!customAmount || customAmount <= 0) {
          alert("올바른 금액을 입력해주세요.");
          return;
        }
      }

      // 1. 로딩 모달 표시
      createLoadingModal();

      // 2. 2초 후 로딩 모달 닫고 완료 모달 표시
      setTimeout(() => {
        showCompleteModal();
      }, 2000);
    });
  }
}

// 함수 호출
openPaymentBlankCheck();
addPay();
activatePaymentMethod();
processPayment();
