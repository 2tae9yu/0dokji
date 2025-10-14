import React, { useState } from "react"; // useState import 추가
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";

// --- 기존 스타일 (변경 없음) ---
const NavBar = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw; 
    z-index: 9999; 
    height: 60px;
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavBrandContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    padding-left: 60px;
`;

const NavIcon = styled.img`
    height: 50px; 
    width: 50px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
`;

const NavBrand = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
`;

const SideBarIcon = styled.div`
    width: 28px;
    height: 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;

    span {
        display: block;
        width: 100%;
        height: 3px;
        background-color: #333; 
        border-radius: 2px;
    }
`;

const MainContent = styled.main`
    background-color: #f8f9fa;
    padding-top: 60px; /* NavBar 높이와 맞춤 */
    min-height: calc(100vh - 60px); /* 스크롤이 생기지 않도록 정확한 높이 계산 */
`;

// --- ✨ 사이드바 스타일 추가 ---

// 사이드바가 열렸을 때 뒷배경을 어둡게 만드는 역할
const Backdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 9999; // NavBar와 동일한 레벨
`;

// 실제 사이드바 메뉴 스타일
const SidebarContainer = styled.aside<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 280px; /* 사이드바 너비 */
    background-color: #ffffff;
    box-shadow: -2px 0 8px rgba(0,0,0,0.1);
    
    /* isOpen props에 따라 위치 변경 */
    transform: translateX(${({ isOpen }) => (isOpen ? '0' : '100%')});
    transition: transform 0.3s ease-in-out; /* 부드러운 애니메이션 효과 */
    z-index: 10000; // 최상위에 위치
    
    padding: 80px 20px 20px; /* 메뉴가 NavBar 아래부터 시작하도록 상단 여백 */
    box-sizing: border-box;
`;

// 사이드바 메뉴 아이템 스타일
const MenuItem = styled.div`
    padding: 15px 10px;
    font-size: 1.1rem;
    font-weight: 500;
    color: #343a40;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #f1f3f5; /* 마우스 올렸을 때 배경색 */
    }
`;


// --- 레이아웃 컴포넌트 ---
const Layout: React.FC = () => {
    const navigate = useNavigate();
    
    // ✨ 사이드바의 열림/닫힘 상태를 관리하는 state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const goToHome = () => navigate("/");

    // ✨ 사이드바 상태를 토글하는 함수
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // ✨ "내 감상문" 메뉴 클릭 시 실행될 함수
    const goToMyReviews = () => {
        navigate('/filmreview'); // "내 감상문" 페이지 경로로 이동
        setIsSidebarOpen(false); // 이동 후 사이드바 닫기
    };

    return (
        <div>
            <NavBar>
                <NavBrandContainer onClick={goToHome}>
                    <NavIcon src="/images/app_icon.png" alt="영독지 아이콘" />
                    <NavBrand>영독지</NavBrand>
                </NavBrandContainer>
                
                {/* 햄버거 아이콘 클릭 시 toggleSidebar 함수 실행 */}
                <SideBarIcon onClick={toggleSidebar}>
                    <span></span>
                    <span></span>
                    <span></span>
                </SideBarIcon>
            </NavBar>

            {/* ✨ 사이드바 및 뒷배경 렌더링 */}
            {isSidebarOpen && <Backdrop onClick={toggleSidebar} />}
            <SidebarContainer isOpen={isSidebarOpen}>
                <MenuItem onClick={goToMyReviews}>내 감상문</MenuItem>
                {/* 다른 메뉴가 있다면 여기에 추가 */}
            </SidebarContainer>

            <MainContent>
                <Outlet />
            </MainContent>
        </div>
    );
};

export default Layout;