// 스크롤 이동 함수 (HTML 수정 후 버전)
function initScrollNavigation() {
  // 버튼 요소들 선택
  const campaignBtn = document.querySelector(".campaignHistory");
  const faqBtn = document.querySelector(".faqHistory");

  // 타겟 섹션들 선택
  const historyListSection = document.querySelector(".historyList");
  const faqListSection = document.querySelector(".faqList");

  // 부드러운 스크롤 함수
  function smoothScrollTo(element) {
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }

  // 캠페인 내역 버튼 클릭 이벤트
  if (campaignBtn && historyListSection) {
    campaignBtn.addEventListener("click", function () {
      smoothScrollTo(historyListSection);
    });
  }

  // 문의 내역 버튼 클릭 이벤트
  if (faqBtn && faqListSection) {
    faqBtn.addEventListener("click", function () {
      smoothScrollTo(faqListSection);
    });
  }
}

// DOM 로드 완료 후 실행
document.addEventListener("DOMContentLoaded", initScrollNavigation);
