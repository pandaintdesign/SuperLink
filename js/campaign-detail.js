// js/campaign-detail.js
'use strict';

/**
 * API 베이스 URL (도메인·컨텍스트 경로)
 */
const API_BASE = 'https://lifezip.co.kr:11443/superlink/api';

/**
 * 택배사 리스트
 */
const deliveryCompanies = [
  { code: '',       name: '택배사 선택'     },
  { code: 'CJ',     name: 'CJ대한통운'     },
  { code: 'EPOST',  name: '우체국소포'     },
  { code: 'LOTTE',  name: '롯데글로벌로지스' },
  { code: 'HANJIN', name: '한진택배'       },
  { code: 'LOGEN',  name: '로젠택배'       },
  { code: 'KDEXP',  name: '경동택배'       },
  { code: 'DAESIN', name: '대신택배'       },
  { code: 'HAPDONG',name: '합동택배'       },
  { code: 'GSPOSTBOX', name: 'GS Postbox' },
  { code: 'CUPOST', name: 'CU포스트'      },
  { code: 'COUPANG',name: '쿠팡CLS'       },
  { code: 'DHL',    name: 'DHL'           },
  { code: 'FEDEX',  name: 'FedEx'         },
  { code: 'EMS',    name: 'EMS'           },
];

let uploadedFile = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  loadCampaignList();                                    // 이전 캠페인 목록 로드
  const campaignId = getCampaignId();
  if (campaignId) {
    loadCampaignDetail(campaignId);
    initializeEventListeners(campaignId);
  }
});

// URL에서 campaignId 파라미터 가져오기
function getCampaignId() {
  return new URLSearchParams(window.location.search).get('campaignId') || '';
}

// 1) 이전 캠페인 목록 조회 및 렌더링
async function loadCampaignList() {
  try {
    const res = await fetch(`${API_BASE}/campaign`, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('authToken') }
    });
    if (!res.ok) throw new Error('캠페인 목록 조회 실패');
    const list = await res.json();
    const tbody = document.querySelector('.campaignTablelist .rowBox');
    tbody.innerHTML = '';
    const now = new Date();
    list.forEach(c => {
      const start = new Date(c.start_date);
      const end   = new Date(c.end_date);
      let statusClass, statusText;
      if (now < start) {
        statusClass = 'redDot'; statusText = '진행예정';
      } else if (now > end) {
        statusClass = 'greenDot'; statusText = '진행완료';
      } else {
        statusClass = 'yellowDot'; statusText = '진행중';
      }
      const tr = document.createElement('tr');
      tr.className = 'rowLine HistoryLine';
      tr.innerHTML = `
        <td class="campeinName row-cell">${c.name}</td>
        <td class="stardDate row-cell">${c.start_date} ~ ${c.end_date}</td>
        <td class="statusDot row-cell">
          <span class="stateDot ${statusClass}">${statusText}</span>
        </td>
      `;
      tr.addEventListener('click', () => {
        window.location.href = `campaign-detail.html?campaignId=${c.id}`;
      });
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('loadCampaignList 오류:', err);
    alert('이전 캠페인 목록 로드 중 오류가 발생했습니다.');
  }
}

// 2) 캠페인 상세 & 통계 불러오기
async function loadCampaignDetail(campaignId) {
  try {
    const res = await fetch(
      `${API_BASE}/campaign/detail?campaignId=${encodeURIComponent(campaignId)}`,
      { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('authToken') } }
    );
    if (!res.ok) throw new Error(`상세 조회 실패 (${res.status})`);
    const { campaign, stats, applications } = await res.json();

    // 상단 정보
    document.querySelector('.brandName').textContent       = campaign.name.split('_')[0];
    document.querySelector('.bloggerCategory').textContent = '체험단';
    document.querySelector('.runningType').textContent     =
      campaign.productDelivery === 1 ? '상품제공형' : '금액지급형';
    document.querySelector('.runningDate').textContent     =
      `${campaign.startDate} ~ ${campaign.endDate}`;
    document.querySelector('.people').textContent          =
      `${stats.appliedCount}명`;
    document.querySelector('.runningCategory').textContent  =
      campaign.category;

    // 모집현황 바
    const pctRecruit = campaign.limitApplicants
      ? Math.min(100, Math.round(stats.appliedCount / campaign.limitApplicants * 100))
      : 0;
    const recruitBar = document.querySelector('.stateBar.recruit');
    recruitBar.style.width = pctRecruit + '%';
    recruitBar.querySelector('.percentageStick').textContent = pctRecruit + '%';

    // 발송현황 바
    const pctShip = stats.appliedCount
      ? Math.min(100, Math.round(stats.shippedCount / stats.appliedCount * 100))
      : 0;
    const shipBar = document.querySelector('.stateBar.shipping');
    shipBar.style.width = pctShip + '%';
    shipBar.querySelector('.percentageStick').textContent = pctShip + '%';

    // 포스팅현황
    document.querySelector('.postingCount .finish').textContent =
      `${stats.postedCount}명`;
    document.querySelector('.postingCount .ready').textContent  =
      `${stats.appliedCount - stats.postedCount}명`;

    // 신청자 테이블 렌더링 & 개별 저장 버튼 바인딩
    renderApplicationsTable(applications);
    document.querySelectorAll('.save-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rowIdx = btn.getAttribute('data-row');
        saveDeliveryInfo(rowIdx, campaignId);
      });
    });

  } catch (err) {
    console.error('loadCampaignDetail 오류:', err);
    alert('캠페인 정보 로드 중 오류가 발생했습니다.');
  }
}

// 3) 신청자 테이블 렌더링
function renderApplicationsTable(apps) {
  const tbody = document.getElementById('deliveryTableBody');
  tbody.innerHTML = '';
  apps.forEach((app, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'rowLine';
    tr.innerHTML = `
      <td>${app.bloggerName}</td>
      <td>${app.blogPoint}</td>
      <td>${app.realUserName}</td>
      <td>${app.phoneNum}</td>
      <td>
        <select class="courier-select" data-row="${idx}">
          ${deliveryCompanies.map(c =>
            `<option value="${c.code}"${c.code===app.courierCode?' selected':''}>${c.name}</option>`
          ).join('')}
        </select>
      </td>
      <td>
        <input type="text" class="postShippingNum" data-row="${idx}" placeholder="송장번호" value="${app.invoiceNo||''}" />
      </td>
      <td>
        <button type="button" class="save-btn" data-row="${idx}">저장</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 4) 파일 업로드 & 전체 저장 이벤트 바인딩
function initializeEventListeners(campaignId) {
  const fileInput = document.getElementById('fileUpload');
  if (fileInput) fileInput.addEventListener('change', handleFileSelect);

  const bulkSaveBtn = document.querySelector('.saveData .ExperienceBtn');
  if (bulkSaveBtn) bulkSaveBtn.addEventListener('click', () => handleSaveAllDelivery(campaignId));
}

// 토스트 알림
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
    const style = document.createElement('style');
    style.textContent = `
      .toast { position: fixed; top:20px; right:20px; padding:12px 20px; border-radius:5px; color:#fff; font-weight:bold; transform:translateX(300px); transition:transform .3s; z-index:10000; }
      .toast.show { transform:translateX(0); }
      .toast.success { background:#10b981; }
      .toast.error   { background:#ef4444; }
      .toast.info    { background:#3b82f6; }
    `;
    document.head.appendChild(style);
  }
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// 파일 선택 핸들러
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) { uploadedFile = null; return; }
  if (!validateFile(file)) return;
  uploadedFile = file;
  showToast(`파일 선택됨: ${file.name}`, 'success');
}

// 파일 유효성 검사
function validateFile(file) {
  const exts = ['.xlsx', '.xls', '.csv'];
  const ok = exts.some(ext => file.name.toLowerCase().endsWith(ext));
  if (!ok) { showToast('엑셀 또는 CSV만 업로드 가능합니다.', 'error'); return false; }
  if (file.size > 10*1024*1024) { showToast('파일은 10MB 이하만 가능합니다.', 'error'); return false; }
  return true;
}

// 전체 데이터 저장
async function handleSaveAllDelivery(campaignId) {
  const btn = document.querySelector('.saveData .ExperienceBtn');
  const origText = btn.textContent;
  btn.disabled = true; btn.textContent = '저장 중...'; btn.style.opacity = '0.6';

  try {
    const data = collectAllDeliveryData();
    if (!validateAllDeliveryData(data)) throw new Error('유효하지 않은 데이터');
    await sendAllDataToServer(data, uploadedFile, campaignId);
    showToast('전체 데이터 저장 완료!', 'success');
    resetFileInput();
  } catch (err) {
    console.error('handleSaveAllDelivery 오류:', err);
    showToast(err.message || '전체 저장 실패', 'error');
  } finally {
    btn.disabled = false; btn.textContent = origText; btn.style.opacity = '1';
  }
}

// 테이블의 모든 행 데이터 수집
function collectAllDeliveryData() {
  const rows = document.querySelectorAll('#deliveryTableBody tr');
  return Array.from(rows).map((row, i) => ({
    rowIndex: i+1,
    courierCode: row.querySelector('.courier-select')?.value || '',
    invoiceNo:   row.querySelector('.postShippingNum')?.value.trim() || '',
    timestamp:   new Date().toISOString()
  }));
}

// 전체 저장 전 유효성 검사
function validateAllDeliveryData(data) {
  const hasData = data.some(d => d.courierCode || d.invoiceNo) || uploadedFile;
  if (!hasData) { showToast('저장할 데이터 또는 파일이 없습니다.', 'error'); return false; }
  const invalid = data.filter(d => d.invoiceNo && !d.courierCode);
  if (invalid.length) { showToast(`${invalid.length}개 행에 송장번호만 입력되었습니다.`, 'error'); return false; }
  return true;
}

// 전체 저장 API 호출
async function sendAllDataToServer(deliveryData, file, campaignId) {
  const fd = new FormData();
  fd.append('deliveryData', JSON.stringify(deliveryData));
  if (file) fd.append('invoiceFile', file);
  fd.append('campaignId', campaignId);
  fd.append('timestamp', new Date().toISOString());
  fd.append('userId', localStorage.getItem('userId') || 'anonymous');

  const res = await fetch(`${API_BASE}/campaign/save-all-delivery`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error(`서버 오류(${res.status})`);
  return res.json();
}

// 파일 입력 초기화
function resetFileInput() {
  const inp = document.getElementById('fileUpload'); if (inp) inp.value = ''; uploadedFile = null;
}

// 개별 송장 저장
async function saveDeliveryInfo(rowIdx, campaignId) {
  const row = document.querySelector(`#deliveryTableBody tr:nth-child(${+rowIdx+1})`);
  const courier = row.querySelector('.courier-select')?.value;
  const invoice = row.querySelector('.postShippingNum')?.value.trim();
  const btn     = row.querySelector('.save-btn');

  if (!courier) { showToast('택배사를 선택해주세요.', 'error'); return; }
  if (!invoice) { showToast('송장번호를 입력해주세요.', 'error'); return; }

  btn.disabled = true; btn.textContent = '저장 중...';
  try {
    const response = await fetch(`${API_BASE}/delivery/save`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId, rowIdx, courierCode: courier, invoiceNo: invoice })
    });
    if (!response.ok) throw new Error('개별 저장 실패');
    showToast('개별 저장 완료!', 'success');
  } catch (err) {
    console.error('saveDeliveryInfo 오류:', err);
    showToast('개별 저장에 실패했습니다.', 'error');
  } finally {
    btn.disabled = false; btn.textContent = '저장';
  }
}
