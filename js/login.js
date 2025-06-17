(function () {
  'use strict';

  const API_BASE = 'https://lifezip.co.kr:11443/superlink/api';

  function findMenuElements() {
    const topMenu = document.getElementById('topMenu');
    if (!topMenu) return null;
    const menuList = topMenu.querySelector('ul');
    if (!menuList) return null;
    const items = menuList.querySelectorAll('li');
    const loginMenu = Array.from(items).find(li => li.textContent.includes('로그인'));
    const signupMenu = Array.from(items).find(li => li.textContent.includes('회원가입'));
    const mypageMenu = Array.from(items).find(li => li.textContent.includes('마이페이지'));
    const paymentMenu = Array.from(items).find(li => li.textContent.includes('포인트충전'));
    return { topMenu, menuList, loginMenu, signupMenu, mypageMenu, paymentMenu };
  }

  function updateMenuAfterLogin(username, points) {
    const elems = findMenuElements();
    if (!elems) return;
    const { menuList, loginMenu, signupMenu, mypageMenu, paymentMenu } = elems;

    if (loginMenu) loginMenu.style.display = 'none';
    if (signupMenu) signupMenu.style.display = 'none';
    if (mypageMenu) mypageMenu.style.display = 'block';
    if (paymentMenu) paymentMenu.style.display = 'block';

    const userInfoLi = document.createElement('li');
    userInfoLi.id = 'user-info';
    userInfoLi.innerHTML = `<span>${username}님 (${points}P)</span>`;
    userInfoLi.style.cssText = `
      padding: 8px 16px;
      color: #333;
      font-weight: 600;
      font-size: 14px;
      background: #f0f8ff;
      border-radius: 4px;
      margin: 0 5px;
    `;

    const logoutLi = document.createElement('li');
    logoutLi.id = 'logout-btn';
    logoutLi.innerHTML = `<a href="javascript:void(0)" style="
      background: #dc3545;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 600;
      display: inline-block;">로그아웃</a>`;
    logoutLi.onclick = handleLogout;

    menuList.appendChild(userInfoLi);
    menuList.appendChild(logoutLi);
  }

  function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('points');
    location.reload();
  }

  async function handleLoginAPI(e) {
    e.preventDefault();
    const idInput = document.getElementById('id-form');
    const pwInput = document.getElementById('password-form');
    if (!idInput || !pwInput) return;

    const userId = idInput.value.trim();
    const password = pwInput.value.trim();
    if (!userId || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const keyRes = await fetch(`${API_BASE}?work=key`);
      const publicKey = await keyRes.text();

      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(publicKey);
      const encrypted = encryptor.encrypt(`userId=${encodeURIComponent(userId)}&password=${encodeURIComponent(password)}`);
      if (!encrypted) throw new Error('암호화 실패');

      const loginRes = await fetch(`${API_BASE}?work=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
        body: encrypted
      });

      const result = await loginRes.json();
      if (!loginRes.ok) throw new Error(result.error || '로그인 실패');

      localStorage.setItem('authToken', result.token);
      localStorage.setItem('username', result.username || userId);
      localStorage.setItem('points', result.points || '0');

      updateMenuAfterLogin(result.username || userId, result.points || '0');
      alert('로그인 성공');
      location.href = 'mypage.html';

    } catch (err) {
      console.error('로그인 실패:', err);
      alert(err.message);
    }
  }

  function restoreLoginState() {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    const points = localStorage.getItem('points');
    if (token && username) {
      updateMenuAfterLogin(username, points);
    }
  }

  function init() {
    const loginBtn = document.getElementById('loginkey');
    if (loginBtn) loginBtn.addEventListener('click', handleLoginAPI);
    restoreLoginState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
