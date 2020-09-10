import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components'
import logo from '../images/journal-logo.png'


const Wrapper = styled.div`
    min-height: 100vh;
    width: 100%;
    background-image: url("https://pics.freeartbackgrounds.com/midle/Blue_Orange_Sky_Background-351.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`;

const Title = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  font-family: 'Barlow Semi Condensed';
  color: rgb(55, 85, 109);
  padding-top: 20px;
`;

const LandingButton = styled.button`
        margin: 9px .25em 1em 0em;
        padding: 0.5em 1.15em;
        font-weight: 400;
        line-height: 1em;
        border-radius: 0.885714rem;
        font-size: 1.58571429rem;
        background-color: rgb(47,67,88);
        color: #fdfbf9;
        font-family: 'Barlow Semi Condensed', sans-serif;

`;


const Div = styled.div`
  position: absolute;
  bottom: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  background-color: rgb(242, 242, 242);
  border: solid rgb(55, 85, 109) 2px;
   border-radius: 25px;
`;


class LandingPage extends Component {
  render() {
    return (
      <Wrapper>
      <Div>
      	<Title>Welcome to your personal</Title>
        <div>
          <img src={logo} style={{height: "150px"}} />
          <br/>
        <Link to="/createaccount"><LandingButton>Create Account</LandingButton></Link>
          <Link to="/login"><LandingButton>Log In</LandingButton></Link>
        </div>
        </Div>
      </Wrapper>
    )
  }
}

export default LandingPage;
