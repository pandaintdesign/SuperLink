// DOM 로드 후 실행
document.addEventListener("DOMContentLoaded", function () {
  // API 설정
  const API_BASE_URL = "https://lifezip.co.kr:11443/superlink";

  // 상태 관리
  let isEmailSent = false;
  let isEmailVerified = false;

  // DOM 요소들
  const signupForm = document.getElementById("PersonalInfo");
  const nameArea = document.getElementById("name");
  const companyName = document.getElementById("companyName");

  // 사업자번호 관리 객체
  const companyCode = {
    element: {
      first: document.getElementById("firstCode"),
      middle: document.getElementById("middleCode"),
      last: document.getElementById("lastCode"),
    },

    getValues() {
      return {
        first: this.element.first?.value.trim() || "",
        middle: this.element.middle?.value.trim() || "",
        last: this.element.last?.value.trim() || "",
      };
    },

    getFullNumber() {
      const value = this.getValues();
      return `${value.first}-${value.middle}-${value.last}`;
    },

    validate() {
      const values = this.getValues();
      if (
        values.first.length !== 3 ||
        values.middle.length !== 2 ||
        values.last.length !== 5
      ) {
        return {
          valid: false,
          message: "사업자등록번호를 정확히 입력해주세요. (3-2-5자리)",
        };
      }
      return { valid: true, message: "유효한 사업자등록번호입니다." };
    },
  };

  const emailID = document.getElementById("email");
  const checkedIDNum = document.getElementById("checkNumber");
  const password = document.getElementById("pw");
  const pwReCheck = document.getElementById("checkedPw");

  // 연락처 관리 객체
  const phoneNum = {
    element: {
      one: document.getElementById("firstNum"),
      two: document.getElementById("middleNum"),
      three: document.getElementById("lastNum"),
    },

    getValues() {
      return {
        one: this.element.one?.value.trim() || "",
        two: this.element.two?.value.trim() || "",
        three: this.element.three?.value.trim() || "",
      };
    },

    getFullNumber() {
      const value = this.getValues();
      return `${value.one}-${value.two}-${value.three}`;
    },

    validate() {
      const values = this.getValues();
      if (!values.one || !values.two || !values.three) {
        return { valid: false, message: "연락처를 모두 입력해주세요." };
      }
      if (
        values.one.length < 2 ||
        values.two.length < 3 ||
        values.three.length !== 4
      ) {
        return { valid: false, message: "연락처 형식이 올바르지 않습니다." };
      }
      return { valid: true, message: "유효한 연락처입니다." };
    },
  };

  // 약관동의 체크박스들
  const firstCheckBox = document.getElementById("term1");
  const secondCheckBox = document.getElementById("term2");
  const thirdCheckBox = document.getElementById("term3");
  const fourthCheckBox = document.getElementById("term4");
  const allCheckBox = document.getElementById("all-check");

  // 버튼들 - 클래스로 찾기 (ID가 없는 경우를 대비)
  const emailVerifyBtn =
    document.getElementById("email-verify-btn") ||
    document.querySelector(".emailArea .duplicate");
  const codeVerifyBtn =
    document.getElementById("code-verify-btn") ||
    document.querySelector(".checkNumber .duplicate");
  const sendSignUp = document.getElementById("submit-btn");

  // DOM 요소 존재 확인 및 디버깅
  console.log("DOM 요소 확인:", {
    signupForm: !!signupForm,
    nameArea: !!nameArea,
    companyName: !!companyName,
    emailID: !!emailID,
    checkedIDNum: !!checkedIDNum,
    emailVerifyBtn: !!emailVerifyBtn,
    codeVerifyBtn: !!codeVerifyBtn,
    sendSignUp: !!sendSignUp,
    firstCheckBox: !!firstCheckBox,
    allCheckBox: !!allCheckBox,
  });

  // 누락된 요소가 있으면 경고 메시지
  if (!emailVerifyBtn) {
    console.error(
      '이메일 인증 버튼을 찾을 수 없습니다. HTML에 id="email-verify-btn" 또는 class="duplicate"가 있는지 확인하세요.'
    );
  }
  if (!codeVerifyBtn) {
    console.error(
      '인증번호 확인 버튼을 찾을 수 없습니다. HTML에 id="code-verify-btn"가 있는지 확인하세요.'
    );
  }

  // ========================================
  // API 호출 함수들
  // ========================================

  async function sendVerificationCode(email) {
    console.log("이메일 인증번호 발송 시도:", email);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sendCode?action=sendCode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );

      console.log("응답 상태:", response.status);
      const result = await response.json();
      console.log("응답 데이터:", result);

      if (response.ok) {
        return { success: true, message: result.message };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("이메일 발송 API 오류:", error);
      return { success: false, error: "네트워크 오류가 발생했습니다." };
    }
  }

  async function checkVerificationCode(email, code) {
    console.log("인증번호 확인 시도:", email, code);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/checkCode?action=checkCode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            code: code,
          }),
        }
      );

      console.log("응답 상태:", response.status);
      const result = await response.json();
      console.log("응답 데이터:", result);

      if (response.ok) {
        return { success: true, message: result.message };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("인증번호 확인 API 오류:", error);
      return { success: false, error: "네트워크 오류가 발생했습니다." };
    }
  }

  async function registerUser(userData) {
    console.log("회원가입 시도:", userData);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/registerUser?action=registerUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      console.log("응답 상태:", response.status);
      const result = await response.json();
      console.log("응답 데이터:", result);

      if (response.ok) {
        return { success: true, message: result.message };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("회원가입 API 오류:", error);
      return { success: false, error: "네트워크 오류가 발생했습니다." };
    }
  }

  // ========================================
  // 유틸리티 함수들
  // ========================================

  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
      errorElement.style.color = "red";
    } else {
      console.error(`에러 요소를 찾을 수 없습니다: ${elementId}`);
      alert(`오류: ${message}`);
    }
  }

  function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.style.display = "none";
    }
  }

  function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
      successElement.textContent = message;
      successElement.style.display = "block";
      successElement.style.color = "green";
    } else {
      console.error(`성공 메시지 요소를 찾을 수 없습니다: ${elementId}`);
      alert(`성공: ${message}`);
    }
  }

  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  function validatePassword(password) {
    const regex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    return regex.test(password);
  }

  // ========================================
  // 이벤트 리스너들
  // ========================================

  // 1. 이메일 인증번호 발송 버튼
  if (emailVerifyBtn && emailID) {
    console.log("이메일 인증 버튼 이벤트 리스너 등록");

    emailVerifyBtn.addEventListener("click", async function () {
      console.log("이메일 인증 버튼 클릭됨");
    
      const email = emailID.value.trim();
      console.log("입력된 이메일:", email);
    
      // 이메일 유효성 검사
      if (!email) {
        showError("email-error", "이메일을 입력해주세요.");
        return;
      }
    
      if (!isValidEmail(email)) {
        showError("email-error", "올바른 이메일 형식을 입력해주세요.");
        return;
      }
    
      hideError("email-error");
    
      // 로딩 상태
      emailVerifyBtn.textContent = "발송중...";
      emailVerifyBtn.disabled = true;
    
      // API 호출
      const result = await sendVerificationCode(email);
    
      if (result.success) {
        isEmailSent = true;
        showSuccess(
          "email-success",
          "인증번호가 발송되었습니다. 이메일을 확인해주세요."
        );
    
        // UI 업데이트
        emailVerifyBtn.textContent = "발송완료";
        emailVerifyBtn.classList.add("disabled");
        emailID.classList.add("input-verified");
        emailID.readOnly = true;
    
        // 인증번호 입력 활성화
        if (checkedIDNum) {
          checkedIDNum.disabled = false;
          checkedIDNum.focus();
        }
        if (codeVerifyBtn) {
          codeVerifyBtn.disabled = false;
        }
      } else {
        // 여기서 중복 이메일 메시지 따로 처리
        if (result.error === "Email already in use") {
          showError("email-error", "이미 사용 중인 이메일입니다.");
        } else {
          showError("email-error", result.error || "이메일 인증 요청 실패");
        }
    
        emailVerifyBtn.textContent = "인증하기";
        emailVerifyBtn.disabled = false;
      }
    });
    
  } else {
    console.error("이메일 인증 버튼 또는 이메일 입력 필드가 없습니다.");
    console.log("emailVerifyBtn:", emailVerifyBtn);
    console.log("emailID:", emailID);
  }

  // 2. 인증번호 확인 버튼
  if (codeVerifyBtn && checkedIDNum) {
    console.log("인증번호 확인 버튼 이벤트 리스너 등록");

    codeVerifyBtn.addEventListener("click", async function () {
      console.log("인증번호 확인 버튼 클릭됨");

      const email = emailID.value.trim();
      const code = checkedIDNum.value.trim();
      console.log("이메일:", email, "인증번호:", code);

      if (!code) {
        showError("code-error", "인증번호를 입력해주세요.");
        return;
      }

      if (code.length !== 6) {
        showError("code-error", "인증번호는 6자리입니다.");
        return;
      }

      hideError("code-error");

      // 로딩 상태
      codeVerifyBtn.textContent = "확인중...";
      codeVerifyBtn.disabled = true;

      // API 호출
      const result = await checkVerificationCode(email, code);

      if (result.success) {
        isEmailVerified = true;
        showSuccess("code-success", "이메일 인증이 완료되었습니다.");

        // UI 업데이트
        codeVerifyBtn.textContent = "인증완료";
        codeVerifyBtn.classList.add("disabled");
        checkedIDNum.classList.add("input-verified");
        checkedIDNum.readOnly = true;

        // 제출 버튼 상태 업데이트
        updateSubmitButton();
      } else {
        showError("code-error", result.error);
        codeVerifyBtn.textContent = "인증하기";
        codeVerifyBtn.disabled = false;
        checkedIDNum.value = "";
        checkedIDNum.focus();
      }
    });
  } else {
    console.error("인증번호 확인 버튼 또는 인증번호 입력 필드가 없습니다.");
    console.log("codeVerifyBtn:", codeVerifyBtn);
    console.log("checkedIDNum:", checkedIDNum);
  }

  // 3. 전체 동의 체크박스
  if (allCheckBox) {
    allCheckBox.addEventListener("change", function () {
      const checkboxes = [
        firstCheckBox,
        secondCheckBox,
        thirdCheckBox,
        fourthCheckBox,
      ];
      checkboxes.forEach((checkbox) => {
        if (checkbox) {
          checkbox.checked = this.checked;
        }
      });
      updateSubmitButton();
    });
  }

  // 4. 개별 체크박스들
  [firstCheckBox, secondCheckBox, thirdCheckBox, fourthCheckBox].forEach(
    (checkbox) => {
      if (checkbox) {
        checkbox.addEventListener("change", function () {
          const allChecked = [
            firstCheckBox,
            secondCheckBox,
            thirdCheckBox,
            fourthCheckBox,
          ]
            .filter((cb) => cb)
            .every((cb) => cb.checked);

          if (allCheckBox) {
            allCheckBox.checked = allChecked;
          }
          updateSubmitButton();
        });
      }
    }
  );

  // 5. 회원가입 폼 제출
  if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      console.log("회원가입 폼 제출 시도");

      // 모든 입력값 수집
      const companyCodeValues = companyCode.getValues();
      const phoneValues = phoneNum.getValues();

      const userData = {
        email: emailID?.value.trim() || "",
        password: password?.value || "",
        username: nameArea?.value.trim() || "",
        companyCode: "TEMP001",
        companyName: companyName?.value.trim() || "",
        companyType: "임시",
        brnPart1: companyCodeValues.first,
        brnPart2: companyCodeValues.middle,
        brnPart3: companyCodeValues.last,
        joinDate: new Date().toISOString().split("T")[0],
        contactArea: phoneValues.one,
        contactPrefix: phoneValues.two,
        contactLine: phoneValues.three,
      };

      console.log("수집된 사용자 데이터:", userData);

      // 유효성 검사
      if (
        !userData.email ||
        !userData.password ||
        !userData.username ||
        !userData.companyName
      ) {
        alert("필수 항목을 모두 입력해주세요.");
        return;
      }

      if (userData.password !== pwReCheck?.value) {
        showError("confirm-password-error", "비밀번호가 일치하지 않습니다.");
        return;
      }

      const businessValidation = companyCode.validate();
      if (!businessValidation.valid) {
        showError("business-error", businessValidation.message);
        return;
      }

      const phoneValidation = phoneNum.validate();
      if (!phoneValidation.valid) {
        showError("phone-error", phoneValidation.message);
        return;
      }

      if (!isEmailVerified) {
        alert("이메일 인증을 완료해주세요.");
        return;
      }

      if (!firstCheckBox?.checked) {
        alert("필수 약관에 동의해주세요.");
        return;
      }

      // 로딩 상태
      if (sendSignUp) {
        sendSignUp.textContent = "가입 중...";
        sendSignUp.disabled = true;
      }

      // API 호출
      const result = await registerUser(userData);

      if (result.success) {
        alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
        window.location.href = "./login-page.html";
      } else {
        alert("회원가입 실패: " + result.error);
        if (sendSignUp) {
          sendSignUp.textContent = "회원가입";
          sendSignUp.disabled = false;
        }
      }
    });
  } else {
    console.error(
      '회원가입 폼을 찾을 수 없습니다. HTML에 id="PersonalInfo"가 있는지 확인하세요.'
    );
  }

  // ========================================
  // 제출 버튼 활성화/비활성화
  // ========================================
  function updateSubmitButton() {
    if (sendSignUp && firstCheckBox) {
      const isRequiredChecked = firstCheckBox.checked;
      const canSubmit = isRequiredChecked && isEmailVerified;
      sendSignUp.disabled = !canSubmit;
    }
  }

  // ========================================
  // 추가 기능들
  // ========================================

  // 숫자만 입력 가능하도록 제한
  [
    companyCode.element.first,
    companyCode.element.middle,
    companyCode.element.last,
    phoneNum.element.one,
    phoneNum.element.two,
    phoneNum.element.three,
  ]
    .filter((element) => element)
    .forEach((input) => {
      input.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
      });
    });

  // 인증번호 입력 시 숫자만 입력 가능
  if (checkedIDNum) {
    checkedIDNum.addEventListener("input", function (e) {
      let value = e.target.value.replace(/[^0-9]/g, "");
      if (value.length > 6) {
        value = value.slice(0, 6);
      }
      e.target.value = value;
    });
  }

  // 초기 상태 설정
  updateSubmitButton();

  // 아코디언 기능
  const accordions = document.querySelectorAll(".accordion-header");
  accordions.forEach((accordion) => {
    accordion.addEventListener("click", function () {
      this.classList.toggle("active");
      const content = this.nextElementSibling;

      if (this.classList.contains("active")) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }
    });
  });

  console.log("회원가입 페이지 초기화 완료");
});
