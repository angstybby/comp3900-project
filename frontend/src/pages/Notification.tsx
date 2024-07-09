import React, { useState } from 'react';

export type Post = {
    id: number;
    user: string;
    picture: string;
    action: string;
    actionGoal?: string;
    picPreview?: boolean;
    privateMsg?: string;
    sentWhen: string;
    msgRead: true | false ;
}

const Notification = () => {

    type Props = {
        unreadMsgsCount: number;
        buttonReadAll: () => void;
    }
    
    const HeaderNotification = ({ unreadMsgsCount, buttonReadAll }: Props) => {
        const containerStyle: React.CSSProperties = {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            fontFamily: "'Plus Jakarta Sans'",
            fontSize: '15px',
        };
    
        const containerMobileStyle: React.CSSProperties = {
            fontSize: '12px',
        };
    
        const readAllStyle: React.CSSProperties = {
            cursor: 'pointer',
        };
    
        const notificationNumberStyle: React.CSSProperties = {
            backgroundColor: '#04327D',
            color: '#F2FFFF',
            padding: '2px 12px',
            borderRadius: '6px',
        };
    
        const isMobile = window.innerWidth <= 320;
    
        const handleMouseOver = (e: React.MouseEvent<HTMLSpanElement>) => {
            e.currentTarget.style.color = 'red';
        };
    
        const handleMouseOut = (e: React.MouseEvent<HTMLSpanElement>) => {
            e.currentTarget.style.color = '';
        };
    
        return (
            <div style={{ ...containerStyle, ...(isMobile ? containerMobileStyle : {}) }}>
                <h2>Notifications <span style={notificationNumberStyle}>{unreadMsgsCount}</span></h2>
                <span 
                    style={readAllStyle} 
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                    onClick={buttonReadAll}
                >
                    Mark all as read
                </span>
            </div>
        );
    }
    

    const [finalPost, setFinalPost] = useState<Post[]>([]);

    const handleReadMsgs = (itemId: number) => {
        const updatedReadMsgs = finalPost.map((item) => {
        if (item.id === itemId) {
            return { ...item, msgRead: true };
        }
        return item;
        });
        setFinalPost(updatedReadMsgs);
    };

    const buttonReadAll = () => {
        const updatedUsers = finalPost.map(item => ({ ...item, msgRead: true }));
        setFinalPost(updatedUsers);
    };

    const unreadMsgsCount = finalPost.filter((item) => !item.msgRead).length;

    const containerStyle: React.CSSProperties = {
        backgroundColor: 'white',
        margin: 'auto',
        maxWidth: '690px',
        marginBottom: '50px',
        height: '100%',
        boxShadow: '1px 1px 10px #CCC',
        borderRadius: '15px',
    };

    const headerStyle: React.CSSProperties = {
        height: '60px',
        marginTop: '90px',
        padding: '20px',
    };

    const bodyStyle: React.CSSProperties = {
        padding: '20px',
        height: 'auto',
    };

    const postContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
    };

    const postStyle = (read: boolean): React.CSSProperties => ({
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: read ? 'white' : '#F6FAFD',
        padding: '15px 10px',
        marginBottom: '10px',
        borderRadius: '7px',
        fontFamily: 'Plus Jakarta Sans',
    });

    const avatarStyle: React.CSSProperties = {
        display: 'inline-block',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const imgStyle: React.CSSProperties = {
        width: '40px',
        marginRight: '10px',
    };

    const postTextStyle: React.CSSProperties = {
        marginLeft: '5px',
        color: '#707070',
    };

    const sentWhenStyle: React.CSSProperties = {
        color: '#B5B9C4',
    };

    const redDotStyle: React.CSSProperties = {
        fontSize: '8px',
    };

    const privateMsgStyle: React.CSSProperties = {
        color: '#909090',
        width: '510px',
        border: '1px solid #969696',
        padding: '15px 15px',
        fontSize: '15px',
    };

    return (
        <div style={containerStyle}>
        <div style={headerStyle}>
            <HeaderNotification unreadMsgsCount={unreadMsgsCount} buttonReadAll={buttonReadAll} />
        </div>
        <div style={bodyStyle}>
            <div style={postContainerStyle}>
            {finalPost.map((item, index) => (
                <div key={index} style={postStyle(item.msgRead)} onMouseOver={() => handleReadMsgs(item.id)}>
                <div style={avatarStyle}>
                    <img src={item.picture} alt="" style={imgStyle} />
                </div>
                <div style={postTextStyle}>
                    <b>{item.user}</b>
                    <span>{item.action}</span>
                    {item.msgRead === false && <span style={redDotStyle}>🔴</span>}
                    <p style={sentWhenStyle}>{item.sentWhen}</p>
                    {item.privateMsg && <div style={privateMsgStyle}><p>{item.privateMsg}</p></div>}
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
};

export default Notification;
