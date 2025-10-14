import React, { useState } from "react";
import styled from "styled-components";

import FilmSearch from "../components/FilmSearch";

// --- 👇 스타일 코드 시작 ---

// 전체 레이아웃: 부드러운 배경색과 충분한 여백 추가
const Container = styled.div`
    width: 100%;
    min-height: calc(100vh - 70px); /* 화면 높이에서 상단 여백 70px을 뺀 만큼만 차지 */
    padding: 40px 20px;
    text-align: center;
    box-sizing: border-box; /* 패딩이 너비를 넘지 않도록 설정 */
`;

// 제목: 자간과 상하 여백으로 가독성 향상
const Title = styled.div`
    margin-bottom: 50px;
    h1 {
        font-size: 2.2rem;
        font-weight: 700;
        color: #343a40;
        margin-bottom: 10px;
        letter-spacing: -0.5px; /* 자간을 살짝 좁혀서 세련되게 */
    }
`;

// 카드들을 감싸는 컨테이너: flexbox의 gap으로 간편하게 간격 조절
const Record = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap; /* 화면이 좁아지면 자동으로 줄바꿈 */
    gap: 40px; /* 카드 사이의 간격을 40px로 설정 */
`;

// 공통 카드 스타일 (Film, Book이 함께 사용)
const CardBase = styled.div`
    width: 320px;
    height: 480px;
    background-color: #ffffff; /* 깨끗한 흰색 배경 */
    border-radius: 16px; /* 더 부드러운 곡선 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 그림자를 더 은은하고 넓게 */
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* transition 간단하게 통합 */

    /* 내부 콘텐츠 정렬 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;

    &:hover {
        transform: translateY(-8px); /* 위로 살짝 떠오르는 효과 */
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    img {
        width: 150px;
        height: 150px;
        margin-bottom: 40px; /* 이미지와 텍스트 사이 간격 */
    }

    h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #212529;
    }
`;

// Film과 Book은 이제 공통 스타일을 상속받기만 하면 됩니다.
const Film = styled(CardBase)``;
const Book = styled(CardBase)``;


// --- 👆 스타일 코드 끝 ---

const Home: React.FC = () => {
    // 모달을 보여줄지 여부를 결정하는 상태는 여전히 Home 컴포넌트가 관리
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const openModal = (): void => {
        setIsModalOpen(true);
    };
    
    const closeModal = (): void => {
        setIsModalOpen(false);
    };

    return (
        <Container>
            <Title>
                <h1>어떤 걸 기록하시겠어요?</h1>
            </Title>
            <Record>
                {/* Film 클릭 시 모달을 여는 기능은 그대로 유지 */}
                <Film onClick={openModal}>
                    <img src="/images/film.webp" alt="필름" width={150} height={150} style={{margin: "50px 0 50px 0"}} />
                    <h3>영화 기록하기</h3>
                </Film>
                <Book>
                    <img src="/images/book.webp" alt="필름" width={150} height={150} style={{margin: "50px 0 50px 0"}} />
                    <h3>독서 기록하기</h3>
                </Book>
            </Record>

            {/* --- 🌟 이 부분을 이렇게 수정하세요 --- */}
            {isModalOpen && <FilmSearch isOpen={isModalOpen} onClose={closeModal} />}
        </Container>
    );
}

export default Home;