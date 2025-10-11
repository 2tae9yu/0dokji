import React, { useState } from "react";
import styled from "styled-components";

import FilmSearch from "../components/FilmSearch";

const Container = styled.div`
    align-items: center;
    text-align: center;
`;

const Title = styled.div`
    text-align: center;
`;


const Record = styled.div`
    display: flex;
    justify-content: center;
`

const Film = styled.div`
    float: left;
    margin-right: 30px;
    border-radius: 20px;
    background-color: #DBCFAB;

    width: 300px;
    height: 500px;

    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;

    /* 애니메이션 속성 설정 */
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

    /* **[핵심]** 호버 효과 정의 */
    &:hover {
        /* 마우스 오버 시 1.05배 커지게 설정 */
        transform: scale(1.05);
        /* 그림자 깊게 */
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
    }
`

const Book = styled.div`
    display: inline-block;
    margin-left: 30px;
    border-radius: 20px;
    background-color: #DBCFAB;

    width: 300px;
    height: 500px;

    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;

    /* 애니메이션 속성 설정 */
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

    /* **[핵심]** 호버 효과 정의 */
    &:hover {
        /* 마우스 오버 시 1.05배 커지게 설정 */
        transform: scale(1.05);
        /* 그림자 깊게 */
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
    }
`

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
                <h1>영독지 🎞️</h1>
                <p>영화, 독서 기록지</p>
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

            {/* 불러온 모달 컴포넌트를 사용.
                필요한 props(isOpen, onClose)를 전달해줌.
            */}
            <FilmSearch isOpen={isModalOpen} onClose={closeModal} />
        </Container>
    );
}

export default Home;