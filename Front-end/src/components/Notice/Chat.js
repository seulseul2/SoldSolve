import React, { useEffect } from 'react';
import { useState } from "react"
// import ChatRoom from '../Modals/ChatRoom'
// import { useNavigate } from 'react-router-dom';
import '../components.css'
import axios from 'axios';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';


function Chat() {

  const [roomList, setRoomList] = useState([])
  let store = useSelector((state) => { return state })
  // console.log(store.info.info.nickName, '사용자이름')
  let navigate = useNavigate()
  useEffect(() => {
    // const currentUserName = store.info.info.nickname
    // console.log(currentUserName, '이름이름')
    const getRoomList = () => {
      axios({
        url: '/api/room',
        method: 'get',
        headers: { Authorization: `Bearer ${localStorage.token}` }
      })
        .then(res => {
          console.log(res, '!!!')
          setRoomList(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
    getRoomList()
  }, [])

  // let navigate = useNavigate()

  const exitRoom = (you, me) => {
    let exitRoomId = null
    roomList.map((room) => {
      console.log(room)

      if (room.buyer.nickname == you && room.seller.nickname == me) {
        exitRoomId = room.roomId
      } else if (room.buyer.nickname == me && room.seller.nickname == you) {
        exitRoomId = room.roomId
      }
    })
    console.log(exitRoomId, '!@!!ASDFASD')
    if (window.confirm("대화방을 나가시겠습니까?")) {
      axios({
        url: `/api/room/${exitRoomId}`,
        method: 'delete',
        headers: { Authorization: `Bearer ${localStorage.token}` }

      })
        .then(res => {
          console.log(res.data.message)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  const ShowChat = () => {
    // filterProduct("women's clothing")
    return (
      <>
        {roomList.map((room, idx) => {
          let you = null;
          let yourImg = null;
          let yourEmail = null;
          let me = null

          if (store.info.info.userId === room.buyer.userid) {
            you = room.seller.nickname
            yourImg = room.seller.profileUrl
            yourEmail = room.seller.email
            me = room.buyer.nickname
          } else {
            you = room.buyer.nickname
            yourImg = room.buyer.profileUrl
            yourEmail = room.buyer.email
            me = room.seller.nickname
          }

          return (
            <span className='chat_room' key={idx} style={{ cursor: 'pointer' }} >
              <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => {
                navigate('/chatroom/' + room.roomId, { state: { roomId: room.roomId, me: me, you: you, meId: store.info.info.userId } })
              }}>
                <div className="profile_box" style={{ background: '#BDBDBD' }}>
                  <img className="profile_img" src={'https://i7c110.p.ssafy.io' + yourImg} alt='profileImg' />
                </div>

                <div>
                  <h6 className='profile_text'>{you}</h6><br />
                  <div className='profile_text'>{yourEmail}</div>
                </div>
              </div>
              <div>
                <div className='message_info'>
                  {/* <p className='message_time'>{room.time}</p> */}
                  <div style={{ display: 'flex' }}>
                    <div className='unread_message'>
                      <p>2</p>
                    </div>
                    <button className='submitbutton-able' style={{ borderRadius: '10px', marginLeft: '7px' }} onClick={() => { exitRoom(you, me) }}>방 나가기</button>
                  </div>
                </div>
              </div>
            </span>
          );
        })}
      </>
    );

  };


  return (
    <>
      <h2 style={{ textAlign: 'center', marginTop: '40px' }}>{store.info.info.userId}의 채팅방</h2>
      <ul style={{ padding: '0' }}>
        {<ShowChat />}
      </ul>
    </>
  );
}

export default Chat;
