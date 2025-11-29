import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";

// --- 스타일 컴포넌트 (기존과 동일) ---
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
    padding-top: 60px;
    min-height: calc(100vh - 60px);
`;

const Backdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 9999;
`;

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 280px;
    background-color: #ffffff;
    box-shadow: -2px 0 8px rgba(0,0,0,0.1);
    
    transform: translateX(${({ isOpen }) => (isOpen ? '0' : '100%')});
    transition: transform 0.3s ease-in-out;
    z-index: 10000;
    
    padding: 80px 20px 20px;
    box-sizing: border-box;
`;

const MenuItem = styled.div`
    padding: 15px 10px;
    font-size: 1.1rem;
    font-weight: 500;
    color: #343a40;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.2s ease;
    
    display: flex; 
    justify-content: space-between;
    align-items: center;

    &:hover {
        background-color: #f1f3f5;
    }
`;

const SubMenuContainer = styled.div<{ isOpen: boolean }>`
    overflow: hidden;
    max-height: ${({ isOpen }) => (isOpen ? "200px" : "0")};
    transition: max-height 0.3s ease-in-out;
    padding-left: 10px;
`;

const SubMenuItem = styled(MenuItem)`
    padding: 12px 10px 12px 25px;
    font-size: 1rem;
    color: #555;
    background-color: transparent;

    &:hover {
        background-color: #f8f9fa;
        color: #000;
    }

    &::before {
        content: "- ";
        margin-right: 5px;
    }
`;


// --- 레이아웃 컴포넌트 ---
const Layout: React.FC = () => {
    const navigate = useNavigate();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const goToHome = () => navigate("/");

    // ✅ [수정됨] 사이드바 토글 시 하위 메뉴 무조건 초기화(닫기)
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        setIsSubMenuOpen(false); // 열거나 닫을 때 항상 드롭다운 닫기
    };

    const toggleSubMenu = () => {
        setIsSubMenuOpen(!isSubMenuOpen);
    };

    const goToMovieReviews = () => {
        navigate('/film-review'); 
        setIsSidebarOpen(false);
        setIsSubMenuOpen(false); // 페이지 이동 시에도 닫아주면 좋습니다
    };

    const goToBookReviews = () => {
        navigate('/book-review'); 
        setIsSidebarOpen(false);
        setIsSubMenuOpen(false);
    };

    return (
        <div>
            <NavBar>
                <NavBrandContainer onClick={goToHome}>
                    <NavIcon src="/images/app_icon.png" alt="영독지 아이콘" />
                    <NavBrand>영독지</NavBrand>
                </NavBrandContainer>
                
                <SideBarIcon onClick={toggleSidebar}>
                    <span></span>
                    <span></span>
                    <span></span>
                </SideBarIcon>
            </NavBar>

            {isSidebarOpen && <Backdrop onClick={toggleSidebar} />}
            <SidebarContainer isOpen={isSidebarOpen}>
                
                <MenuItem onClick={toggleSubMenu}>
                    내 감상문
                    <span style={{ fontSize: '0.8rem', transform: isSubMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                        ▼
                    </span>
                </MenuItem>

                <SubMenuContainer isOpen={isSubMenuOpen}>
                    <SubMenuItem onClick={goToMovieReviews}>
                        영화 감상문
                    </SubMenuItem>
                    <SubMenuItem onClick={goToBookReviews}>
                        독서 감상문
                    </SubMenuItem>
                </SubMenuContainer>

            </SidebarContainer>

            <MainContent>
                <Outlet />
            </MainContent>
        </div>
    );
};

export default Layout;