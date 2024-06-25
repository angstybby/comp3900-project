import styled from "styled-components";

export const Notifications = styled.div`    
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    font-family: 'Plus Jakarta Sans';
    font-size: 15px;

    @media (max-width: 320px) {
        font-size: 12px;
    }

    .styleReadAll{
        cursor: pointer;
        
        &:hover {
            color: red;
        }
    }

    .notificationNumber {
        background-color: #04327D;
        color: #F2FFFF;
        padding: 2px 12px;
        border-radius: 6px
    }
`;