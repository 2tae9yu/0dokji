import styled from "styled-components";

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

const Home = () => {
    return (
        <Container>
            <Title>
                <h1>영독지 🎞️</h1>
                <p>영화, 독서 기록지</p>
            </Title>
            <Record>
                <Film>
                    <img src="/images/Gemini_Generated_Film.png" alt="필름" width={200} height={200}/>
                </Film>
                <Book>
                    독서 기록하기
                </Book>
            </Record>
        </Container>
    );
}

export default Home;