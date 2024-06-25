import styled, { createGlobalStyle } from "styled-components";

export const Container = styled.div`
    background-color: white;
    margin: auto;
    max-width: 690px;
    margin-bottom: 50px;
    height: 100%;
    box-shadow: 1px 1px 10px #CCC;
    border-radius: 15px;

    @media (max-width: 425px) {
        margin-left: 25px;
        margin-right: 25px;
    }

    @media (max-width: 320px) {
        width: 300px; 
        margin-left: 25px;  
    }
`;

export const Header = styled.div`
    height: 60px;
    margin-top: 90px;
    padding: 20px;

    @media (max-width: 320px) {
        width: 300px;
        padding-left: 0px;
    }   
`;

export const Body = styled.div`
    padding: 20px;
    height: auto;

    @media (max-width: 320px) {
        width: 300px;
        padding-left: 0px;   
    }
`;

export const FontStyles = createGlobalStyle`
    @font-face {
        font-family: 'Plus Jakarta Sans';
    }
`;

export const PostContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Post = styled.div<{ read: boolean }>`
    display: flex;
    flex-direction: row;
    background-color: ${props => props.read == false ? '#F6FAFD' : 'white'} ;
    padding: 15px 10px;
    margin-bottom: 10px;
    border-radius: 7px;
    font-family: 'Plus Jakarta Sans';

    @media (max-width: 320px) {
        margin-left: 10px;
        margin-right: 10px;
        font-size: 12px;
    }
`;

export const Avatar = styled.div`
    display: inline-block;
    justify-content: center;
    align-items: center;
    
    img {
        width: 40px;
        margin-right: 10px;
    }
`;

export const PostText = styled.div`
    span {
        margin-left: 5px;
        color: #707070;
    }

    .chess {
        color: blue;
    }

    .others {
        color: #303030;
    }

    p {
        margin-top: 5px;
        margin-bottom: 0;
    }

    .sentWhen {
        color: #B5B9C4;
    }

    .redDot {
        font-size: 8px;
    }
`;

export const PrivateMsg = styled.div`
    color: #909090;
    width: 510px;
    border: 1px solid #969696;
    padding: 15px 15px;
    font-size: 15px;

    @media (max-width: 425px) {
        width: 220px;
    }

    @media (max-width: 320px) {
        margin-left: -40px;
        font-size: 12px;
    }
`;

export const ExtraPicture = styled.div`
    flex: 1;
    display: flex;
    justify-content: right;

    .imgChess {
        width: 40px;
        height: 38px;
        padding-right: 35px;
    }
`;