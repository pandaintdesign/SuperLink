// 택배회사 데이터
const deliveryCompanies = [
  { id: "", name: "택배사 선택" },
  { id: "cj", name: "CJ대한통운", code: "CJ" },
  { id: "epost", name: "우체국소포", code: "EPOST" },
  { id: "lotte", name: "롯데글로벌로지스", code: "LOTTE" },
  { id: "hanjin", name: "한진택배", code: "HANJIN" },
  { id: "ilogen", name: "로젠택배", code: "LOGEN" },
  { id: "kdexp", name: "경동택배", code: "KDEXP" },
  { id: "daesin", name: "대신택배", code: "DAESIN" },
  { id: "hapdong", name: "합동택배", code: "HAPDONG" },
  { id: "gspostbox", name: "GS Postbox", code: "GSPOSTBOX" },
  { id: "cupost", name: "CU포스트", code: "CUPOST" },
  { id: "coupang", name: "쿠팡CLS", code: "COUPANG" },
  { id: "dhl", name: "DHL", code: "DHL" },
  { id: "fedex", name: "FedEx", code: "FEDEX" },
  { id: "ems", name: "EMS", code: "EMS" },
];

// 샘플 데이터
const sampleData = [
  {
    id: 1,
    bloggerName: "블로거A",
    blogPoint: 90,
    realUserName: "홍길동",
    phoneNum: "010-1234-5678",
    homeAddress: "서울 강남구 학동로 426 강남구청",
    courierId: "cj",
    deliveryCode: "1234567890",
  },
  {
    id: 2,
    bloggerName: "블로거B",
    blogPoint: 85,
    realUserName: "김철수",
    phoneNum: "010-9876-5432",
    homeAddress: "서울 서초구 반포대로 58",
    courierId: "",
    deliveryCode: "",
  },
  {
    id: 3,
    bloggerName: "블로거C",
    blogPoint: 92,
    realUserName: "이영희",
    phoneNum: "010-5555-1234",
    homeAddress: "부산 해운대구 해운대해변로 264",
    courierId: "lotte",
    deliveryCode: "9876543210",
  },
  {
    id: 4,
    bloggerName: "블로거D",
    blogPoint: 78,
    realUserName: "박민수",
    phoneNum: "010-7777-8888",
    homeAddress: "대구 중구 동성로 45",
    courierId: "",
    deliveryCode: "",
  },
];

// ===== 전역 변수 =====
let uploadedFile = null;

// ===== 초기화 =====
document.addEventListener("DOMContentLoaded", function () {
  renderTable();
  initializeEventListeners();
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
  const fileInput = document.getElementById("fileUpload");
  const saveButton = document.querySelector(".saveData .ExperienceBtn");

  if (fileInput) {
    fileInput.addEventListener("change", handleFileSelect);
  }

  if (saveButton) {
    saveButton.addEventListener("click", handleSaveAllData);
  }
}

// ===== 토스트 알림 =====
function showToast(message, type = "success") {
  let toast = document.getElementById("toast");

  // 토스트 요소가 없으면 생성
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);

    // 토스트 스타일이 없는 경우 추가
    if (!document.querySelector(".toast-styles")) {
      const style = document.createElement("style");
      style.className = "toast-styles";
      style.textContent = `
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 5px;
          color: white;
          font-weight: bold;
          z-index: 10000;
          transform: translateX(300px);
          transition: transform 0.3s ease;
          max-width: 300px;
        }
        .toast.show { transform: translateX(0); }
        .toast.success { background: #10b981; }
        .toast.error { background: #ef4444; }
        .toast.info { background: #3b82f6; }
      `;
      document.head.appendChild(style);
    }
  }

  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ===== 파일 업로드 관련 함수 =====
function handleFileSelect(event) {
  const file = event.target.files[0];

  if (file) {
    // 파일 유효성 검사
    if (!validateFile(file)) {
      return;
    }

    uploadedFile = file;
    showToast(`파일이 선택되었습니다: ${file.name}`, "success");
    console.log(
      "선택된 파일:",
      file.name,
      "크기:",
      (file.size / 1024).toFixed(1) + "KB"
    );
  } else {
    uploadedFile = null;
  }
}

function validateFile(file) {
  // 허용된 파일 확장자
  const allowedExtensions = [".xlsx", ".xls", ".csv"];
  const fileName = file.name.toLowerCase();
  const isValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!isValidExtension) {
    showToast(
      "엑셀 파일(.xlsx, .xls) 또는 CSV 파일만 업로드 가능합니다.",
      "error"
    );
    return false;
  }

  // 파일 크기 검사 (10MB 제한)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    showToast("파일 크기는 10MB를 초과할 수 없습니다.", "error");
    return false;
  }

  return true;
}

// ===== 전체 데이터 저장 (새로운 기능) =====
async function handleSaveAllData() {
  const saveButton = document.querySelector(".saveData .ExperienceBtn");

  // 버튼 로딩 상태로 변경
  const originalText = saveButton.textContent;
  saveButton.disabled = true;
  saveButton.textContent = "저장 중...";
  saveButton.style.opacity = "0.6";

  try {
    // 송장번호 데이터 수집
    const deliveryData = collectAllDeliveryData();

    // 데이터 유효성 검사
    if (!validateAllDeliveryData(deliveryData)) {
      return;
    }

    // 서버로 데이터 전송
    alert("모든 데이터가 성공적으로 저장되었습니다!");
    showToast("모든 데이터가 성공적으로 저장되었습니다!", "success");

    // 저장 후 파일 입력 초기화
    resetFileInput();
  } catch (error) {
    console.error("전체 저장 오류:", error);
    alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    showToast("저장 중 오류가 발생했습니다.", "error");
  } finally {
    // 버튼 원상복구
    saveButton.disabled = false;
    saveButton.textContent = originalText;
    saveButton.style.opacity = "1";
  }
}

function collectAllDeliveryData() {
  const deliveryData = [];
  const tableRows = document.querySelectorAll("#deliveryTableBody tr");

  tableRows.forEach((row, index) => {
    const bloggerName = row.querySelector(".bloggerName")?.textContent || "";
    const blogPoint = row.querySelector(".blogPoint")?.textContent || "";
    const realUserName = row.querySelector(".RealUserName")?.textContent || "";
    const phoneNum = row.querySelector(".phoneNum")?.textContent || "";
    const homeAddress = row.querySelector(".HomeAdress")?.textContent || "";

    // 택배사 선택값
    const courierSelect = row.querySelector(".courier-select");
    const courierId = courierSelect ? courierSelect.value : "";
    const courierName =
      courierSelect && courierSelect.selectedIndex > 0
        ? courierSelect.options[courierSelect.selectedIndex].text
        : "";

    // 송장번호 입력값
    const deliveryCodeInput = row.querySelector(".postShippingNum");
    const deliveryCode = deliveryCodeInput
      ? deliveryCodeInput.value.trim()
      : "";

    // 모든 행 데이터 수집 (빈 값도 포함)
    deliveryData.push({
      rowIndex: index + 1,
      bloggerName,
      blogPoint,
      realUserName,
      phoneNum,
      homeAddress,
      courierId,
      courierName,
      deliveryCode,
      hasData: !!(courierId || deliveryCode), // 데이터가 있는지 표시
      timestamp: new Date().toISOString(),
    });
  });

  return deliveryData;
}

function validateAllDeliveryData(deliveryData) {
  const dataRows = deliveryData.filter((item) => item.hasData);

  if (!uploadedFile && dataRows.length === 0) {
    showToast("업로드할 파일이나 입력된 송장번호가 없습니다.", "error");
    return false;
  }

  // 송장번호가 입력된 행에 택배사가 선택되었는지 확인
  const invalidRows = dataRows.filter(
    (item) => item.deliveryCode && !item.courierId
  );
  if (invalidRows.length > 0) {
    showToast(
      `${invalidRows.length}개 행에서 송장번호는 입력되었지만 택배사가 선택되지 않았습니다.`,
      "error"
    );
    return false;
  }

  return true;
}

async function sendAllDataToServer(deliveryData, file) {
  const formData = new FormData();

  // 송장번호 데이터 추가
  formData.append("deliveryData", JSON.stringify(deliveryData));

  // 파일 추가 (있는 경우)
  if (file) {
    formData.append("invoiceFile", file);
  }

  // 추가 메타데이터
  formData.append("campaignId", getCampaignId());
  formData.append("timestamp", new Date().toISOString());
  formData.append("userId", getCurrentUserId());

  // 서버 API 호출
  const response = await fetch("/api/campaign/save-all-delivery", {
    method: "POST",
    body: formData,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `서버 오류: ${response.status}`);
  }

  const result = await response.json();
  console.log("전체 저장 성공:", result);

  return result;
}

function getCampaignId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("campaignId") || "unknown";
}

function getCurrentUserId() {
  return (
    sessionStorage.getItem("userId") ||
    localStorage.getItem("userId") ||
    "anonymous"
  );
}

function resetFileInput() {
  const fileInput = document.getElementById("fileUpload");
  if (fileInput) {
    fileInput.value = "";
  }
  uploadedFile = null;
}

// ===== 기존 개별 저장 함수들 =====
function createCourierDropdown(selectedId = "", rowId) {
  const select = document.createElement("select");
  select.className = "courier-select";
  select.setAttribute("data-row-id", rowId);

  deliveryCompanies.forEach((company) => {
    const option = document.createElement("option");
    option.value = company.id;
    option.textContent = company.name;
    if (company.id === selectedId) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  return select;
}

function createDeliveryCodeInput(value = "", rowId) {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "postShippingNum";
  input.placeholder = "송장번호를 입력하세요";
  input.value = value;
  input.setAttribute("data-row-id", rowId);

  return input;
}

function createSaveButton(rowId) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "save-btn";
  button.textContent = "저장";
  button.setAttribute("data-row-id", rowId);
  button.onclick = () => saveDeliveryInfo(rowId);

  return button;
}

function renderTable() {
  const tbody = document.getElementById("deliveryTableBody");
  if (!tbody) {
    console.error("deliveryTableBody 요소를 찾을 수 없습니다.");
    return;
  }

  tbody.innerHTML = "";

  sampleData.forEach((data) => {
    const row = document.createElement("tr");
    row.className = "rowLine";
    row.setAttribute("data-row-id", data.id);

    // 기본 정보 셀들
    row.innerHTML = `
      <td class="bloggerName">${data.bloggerName}</td>
      <td class="blogPoint">${data.blogPoint}</td>
      <td class="RealUserName">${data.realUserName}</td>
      <td class="phoneNum">${data.phoneNum}</td>
      <td class="HomeAdress">${data.homeAddress}</td>
    `;

    // 택배사 드롭다운 셀
    const courierCell = document.createElement("td");
    courierCell.className = "Courier";
    const courierDropdown = createCourierDropdown(data.courierId, data.id);
    courierCell.appendChild(courierDropdown);
    row.appendChild(courierCell);

    // 송장번호 입력 셀
    const deliveryCodeCell = document.createElement("td");
    deliveryCodeCell.className = "deliveryCode";
    const deliveryCodeInput = createDeliveryCodeInput(
      data.deliveryCode,
      data.id
    );
    deliveryCodeCell.appendChild(deliveryCodeInput);
    row.appendChild(deliveryCodeCell);

    // 관리 버튼 셀
    const actionCell = document.createElement("td");
    actionCell.className = "actionCell";
    const saveButton = createSaveButton(data.id);
    actionCell.appendChild(saveButton);

    row.appendChild(actionCell);
    tbody.appendChild(row);
  });
}

// 개별 행 저장 (기존 함수)
async function saveDeliveryInfo(rowId) {
  const row = document.querySelector(`tr[data-row-id="${rowId}"]`);
  const courierSelect = row.querySelector(".courier-select");
  const deliveryCodeInput = row.querySelector(".postShippingNum");
  const saveButton = row.querySelector(".save-btn");
  const actionCell = row.querySelector(".actionCell");

  const courierId = courierSelect.value;
  const deliveryCode = deliveryCodeInput.value.trim();

  // 유효성 검사
  if (!courierId) {
    showToast("택배사를 선택해주세요.", "error");
    courierSelect.focus();
    return;
  }

  if (!deliveryCode) {
    showToast("송장번호를 입력해주세요.", "error");
    deliveryCodeInput.focus();
    return;
  }

  // 로딩 상태 표시
  saveButton.disabled = true;
  saveButton.innerHTML = '저장중 <span class="loading"></span>';

  // 기존 상태 제거
  const existingStatus = actionCell.querySelector(".delivery-status");
  if (existingStatus) {
    existingStatus.remove();
  }

  try {
    // 서버 API 호출
    const response = await fetch("/api/delivery/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rowId: rowId,
        courierId: courierId,
        deliveryCode: deliveryCode,
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      const result = await response.json();

      // 로컬 데이터 업데이트
      const dataIndex = sampleData.findIndex((item) => item.id == rowId);
      if (dataIndex !== -1) {
        sampleData[dataIndex].courierId = courierId;
        sampleData[dataIndex].deliveryCode = deliveryCode;
      }

      showToast("저장이 완료되었습니다.", "success");
    } else {
      throw new Error("저장에 실패했습니다.");
    }
  } catch (error) {
    console.error("Save error:", error);
    showToast("저장에 실패하였습니다. 다시 입력해 주세요.", "error");
  } finally {
    // 로딩 상태 해제
    saveButton.disabled = false;
    saveButton.textContent = "저장";
  }
}

// ===== Mock API =====
const originalFetch = window.fetch;
window.fetch = function (url, options) {
  // 개별 저장 API
  if (url === "/api/delivery/save") {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1;
        resolve({
          ok: success,
          json: () =>
            Promise.resolve({
              success: success,
              message: success ? "저장 완료" : "저장 실패",
            }),
        });
      }, 1000);
    });
  }

  // 전체 저장 API
  if (url === "/api/campaign/save-all-delivery") {
    return new Promise((resolve) => {
      console.log("Mock API: 전체 저장 호출", options.body);
      setTimeout(() => {
        const success = Math.random() > 0.1;
        resolve({
          ok: success,
          status: success ? 200 : 500,
          json: () =>
            Promise.resolve({
              success: success,
              message: success
                ? "전체 데이터가 저장되었습니다."
                : "서버 오류가 발생했습니다.",
              savedCount: success ? Math.floor(Math.random() * 10) + 1 : 0,
              fileUploaded:
                success && options.body.get("invoiceFile") ? true : false,
            }),
        });
      }, 2000); // 2초 지연
    });
  }

  return originalFetch
    ? originalFetch.apply(this, arguments)
    : Promise.reject("Fetch not available");
};
