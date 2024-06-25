import * as S from './style';

type Props = {
    unreadMsgsCount: number;
    buttonReadAll: () => void;
}

export const HeaderNotification = ({ unreadMsgsCount, buttonReadAll }: Props) => {
    
    
    return (
        <S.Notifications>
            <h2>Notifications <span className='notificationNumber'>{ unreadMsgsCount }</span></h2>
            <span className='styleReadAll' onClick={buttonReadAll}>Mark all as read</span>
        </S.Notifications>
    );
}