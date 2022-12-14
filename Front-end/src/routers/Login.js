import NavBar from "../components/NavBar"
import { useState } from 'react'
import axios from "axios"
import { useDispatch } from 'react-redux'
import { getToken, getInfo } from '../store.js'

// import url from '../api/api.js'


function Login() {

  let dispatch = useDispatch()
  const [id, setId] = useState(null)
  const [password, setPassword] = useState(null)
  const [button, setButton] = useState('noInput')

  let submitButton = null;
  if (button === 'noInput') {
    submitButton = <button className="inputform submitbutton-disable" type="submit" disabled={true}>SUBMIT</button>
  } else if (button === 'input') {
    submitButton = <button className="inputform submitbutton-able" type="submit">SUBMIT</button>
  }


  function inputId(e) {
    setId(e.target.value)
    if (e.target.value && password) { setButton('input') }
    else if (e.target.value === '') { setButton('noInput') }
  }
  function inputPw(e) {
    setPassword(e.target.value)
    if (e.target.value && id) { setButton('input') }
    else if (e.target.value === '') { setButton('noInput') }
  }
  const loginForm = { userId: id, password: password }
  // console.log(loginForm)
  // console.log(url.login)

  function tryLogin(getLoginForm) {
    // console.log(getLoginForm)
    axios({
      url: '/api/auth/login',
      method: 'post',
      data: getLoginForm
    })
      .then(res => {
        const token = res.data.accessToken
        dispatch(getToken(token))
        localStorage.setItem('token', token)
        getMyInfo()
      })
      .catch(err => {
        if (err.response.status === 403) {
          alert("이용이 제한된 계정입니다.")
        } else {
          alert("아이디와 비밀번호를 확인해주세요")
        }
      })
  }
  function getMyInfo() {
    axios({
      url: '/api/users/me',
      method: 'get',
      headers: { Authorization: `Bearer ${localStorage.token}` }
    })
      .then(res => {
        console.log(res)
        dispatch(getInfo(res.data))
        window.location.href = '/'
      })
      .catch(err => {
        console.error(err)
      })
  }
  function submitLogin(e) {
    e.preventDefault()
    tryLogin(loginForm)
  }

  return (
    <div>
      <NavBar></NavBar>
      <div>
        <div className="test">
          <div className="test3">
            <h1 className="my-5">로그인</h1>
            <form onSubmit={e => { submitLogin(e) }}>
              <input className="inputform" onChange={e => { inputId(e) }} type="text" placeholder="ID"></input><br />
              <input className="inputform" onChange={e => { inputPw(e) }} type="password" placeholder="PASSWORD"></input><br />
              {submitButton}
            </form>
            <a className="atag" href="/find">ID/PW 찾기</a><br />
            <a className="atag" href="/signup">회원가입</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;