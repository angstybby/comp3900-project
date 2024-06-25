import { useState } from 'react';

import * as S from './App.styles';

import { Post } from '../types/Post';
import { HeaderNotification } from '../components/HeaderNotification';

const Notification = () => {
  const [finalPost, setFinalPost] = useState<Post[]>([
  ]);

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

  return (
    <S.Container>
      <S.Header>
        <HeaderNotification unreadMsgsCount={unreadMsgsCount} buttonReadAll={buttonReadAll}/>
      </S.Header>
      <S.Body>
        <S.PostContainer> {/*Looking for a way to put all this in a separated component. */}
          {finalPost.map((item, index) => (
            <S.Post key={index} read={item.msgRead} onMouseOver={() => handleReadMsgs(item.id)}>
              <S.Avatar>
                <img src={item.picture} alt="" />
              </S.Avatar>
              <S.PostText>
                <b>{item.user}</b>
                <span>{item.action}</span>
                {item.actionGoal && <span className={item.actionGoal === 'Chess Club' ? 'chess' : 'others'}>{item.actionGoal}</span>}
                {item.msgRead === false && <span className='redDot'>🔴</span>}
                <p className='sentWhen'>{item.sentWhen}</p>
                {item.privateMsg && <S.PrivateMsg><p>{item.privateMsg}</p></S.PrivateMsg>}
              </S.PostText>

            </S.Post>
          ))}
        </S.PostContainer>
      </S.Body>
    </S.Container>
  );
}

export default Notification