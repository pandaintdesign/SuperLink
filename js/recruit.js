<<<<<<< HEAD
// js/recruit.js
(function() {
  'use strict';

  const API_BASE = 'https://lifezip.co.kr:11443/superlink/api/campaign';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    bindPrizeSelection();
    bindPeopleSelection();
    document.querySelector('.recruitArea').addEventListener('submit', handleSubmit);
    loadCampaignOptions();
  }

  // 1) 진행조건 버튼 토글 & 히든 필드 갱신
  function bindPrizeSelection() {
    document.querySelectorAll('.selectPrize').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        const vals = Array.from(
          document.querySelectorAll('.selectPrize.active')
        ).map(el => el.dataset.value).join(',');
        document.getElementById('conditions').value = vals;
      });
    });
  }

  // 2) 모집 인원 버튼 토글(단일) & 히든 필드 갱신
  function bindPeopleSelection() {
    document.querySelectorAll('.selectPeopleNum').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.selectPeopleNum.active')
          .forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('limitApplicants').value = btn.dataset.value;
      });
    });
  }

  // 3) 이전 캠페인 불러오기
  async function loadCampaignOptions() {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(API_BASE, {
        headers: token ? { 'Authorization': 'Bearer ' + token } : {}
      });
      if (!res.ok) throw new Error('캠페인 리스트 조회 실패');
      const list = await res.json();
      const select = document.getElementById('campaignOption');
      select.innerHTML = '<option value="">캠페인을 선택해주세요</option>';
      list.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        select.appendChild(opt);
      });
      select.addEventListener('change', populateForm);
    } catch (e) {
      console.error(e);
    }
  }

  // 4) 선택한 캠페인 폼에 채우기
  async function populateForm(e) {
    const id = e.target.value;
    if (!id) return;

    // 4-0) 이전 활성 상태 초기화
    document.querySelectorAll('.selectPrize.active')
      .forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.selectPeopleNum.active')
      .forEach(btn => btn.classList.remove('active'));

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE}?id=${id}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('캠페인 상세 조회 실패');

      // 4-1) 배열로 온 경우, id 매칭해서 단일 객체 꺼내기
      const data = await res.json();
      const c = Array.isArray(data)
        ? data.find(item => String(item.id) === id)
        : data;
      if (!c) throw new Error('캠페인 데이터를 찾을 수 없습니다.');

      // 4-2) 폼 필드에 값 채우기
      document.getElementById('campaignOption').value = c.id;
      document.getElementById('brandName').value      = c.brand_name;
      document.getElementById('productName').value    = c.product_name;
      document.getElementById('urlName').value        = c.product_url;

      // shipping radio
      document.querySelector(
        `input[name=shipping][value="${c.product_delivery === 1 ? 'yes' : 'no'}"]`
      ).checked = true;

      // conditions 버튼
      c.conditions.split(',').forEach(val => {
        const btn = document.querySelector(`.selectPrize[data-value="${val}"]`);
        if (btn) btn.classList.add('active');
      });
      document.getElementById('conditions').value = c.conditions;

      // category, point (드롭다운)
      document.getElementById('category').value = c.category;
      document.getElementById('point').value    = c.influencer_level;

      // limitApplicants 버튼
      const pplBtn = document.querySelector(
        `.selectPeopleNum[data-value="${c.limit_applicants}"]`
      );
      if (pplBtn) pplBtn.classList.add('active');
      document.getElementById('limitApplicants').value = c.limit_applicants;

      // guide fields
      document.getElementById('mainKeyword').value = c.main_guide;
      document.getElementById('subKeyword').value  = c.sub_guide;
      document.getElementById('reviewGuide').value = c.extra_guide;

    } catch (err) {
      console.error('populateForm 오류:', err);
      alert('캠페인 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  }

  // 5) 폼 제출 처리
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const json = {};

    // FormData → JSON (fileUpload 제외)
    for (const [k, v] of data.entries()) {
      if (k === 'fileUpload') continue;
      json[k] = v;
    }

    try {
      const token = localStorage.getItem('authToken');

      // 5-1) 파일 업로드
      const file = data.get('fileUpload');
      if (file && file.size > 0) {
        const fd = new FormData();
        fd.append('info_file', file);
        const upRes = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token },
          body: fd
        });
        if (!upRes.ok) throw new Error('파일 업로드 실패');
        const upJson = await upRes.json();
        json.infoFilePath = upJson.path;
      }

      // 5-2) 캠페인 생성/수정
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(json)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || '신청 실패');
      }

      alert('캠페인 신청이 완료되었습니다.');
      window.location.reload();
    } catch (err) {
      console.error('handleSubmit 오류:', err);
      alert(err.message);
    }
  }

})();
=======
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
>>>>>>> 623a4fa07e03d621ee5ded7d7f3e23d8f6b4114a
