import NavBar from "../components/NavBar"
import axios from "axios"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './routers.css'
import { getToken } from '../store.js'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

function EditAccount() {
  let dispatch = useDispatch()
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(null)
  const [password, setPassword] = useState(null)
  const [pwConfirm, setPwConfirm] = useState(null)
  const [button, setButton] = useState('noInput')

  const editAccountForm = { nickName: nickname, password: password }

  function inputForm(e) {
    if (e.target.name === 'nickname') {
      setNickname(e.target.value)
      if (e.target.value && password && pwConfirm) { setButton('input') }
      else if (e.target.value === '') { setButton('noInput') }
    }

    else if (e.target.name === 'password') {
      setPassword(e.target.value)
      if (e.target.value && pwConfirm && nickname) { setButton('input') }
      else if (e.target.value === '') { setButton('noInput') }
    }

    else if (e.target.name === 'pwconfirm') {
      setPwConfirm(e.target.value)
      if (e.target.value && password && nickname) { setButton('input') }
      else if (e.target.value === '') { setButton('noInput') }
    }
  }

  let submitButton = null;
  if (button === 'noInput') {
    submitButton = <button className="inputform submitbutton-disable" type="submit" disabled={true}>SUBMIT</button>
  } else if (button === 'input') {
    submitButton = <button className="inputform submitbutton-able" type="submit">SUBMIT</button>
  }

  function editAccount(e) {
    e.preventDefault();
    if (password === pwConfirm) {
      console.log(editAccountForm)
      axios({
        url: '/api/users/update/userinfo',
        method: 'Patch',
        data: editAccountForm,
        headers: { Authorization: `Bearer ${localStorage.token}` }
      })
        .then(res => {
          console.log(res)
          alert("??????????????? ?????????????????????.")
          document.location.href = '/mypage'

        })
        .catch(err => {
          console.error(err.response.data)
        })
    } else {
      alert("??????????????? ?????? ????????????.")
    }
  }

  function deleteAccount(e) {
    e.preventDefault();
    if (window.confirm("?????? ????????? ?????? ???????????????????")) {
      axios({
        url: '/api/users',
        method: 'delete',
        headers: { Authorization: `Bearer ${localStorage.token}` }
      })
        .then(res => {
          console.log(res)
          dispatch(getToken(null))
          localStorage.setItem('token', null)
          alert("????????? ?????? ???????????????")
          document.location.href = '/'
        })
        .catch(err => {
          console.error(err)
        })
    }
  }


  return (
    <div>
      <NavBar></NavBar>
      <div>
        <div className="test">
          <div className="test3">
            <FontAwesomeIcon className='editBack' icon={faChevronLeft} onClick={() => { navigate(-1) }} />
            <h1 className="my-5">??????????????????</h1>
            <div className="form">
              <form onSubmit={e => editAccount(e)}>
                <input className="inputform" name="nickname" onKeyUp={e => { inputForm(e) }} type="text" placeholder="NICKNAME"></input><br />
                <input className="inputform" name="password" onKeyUp={e => { inputForm(e) }} type="password" placeholder="PASSWORD"></input><br />
                <input className="inputform" name="pwconfirm" onKeyUp={e => { inputForm(e) }} type="password" placeholder="PASSWORD CONFIRM"></input><br />
                <a className="atag" onClick={e => deleteAccount(e)} href="#!">?????? ????????????</a><br />
                {submitButton}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditAccount;