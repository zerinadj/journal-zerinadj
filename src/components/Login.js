import React, {Component} from 'react';
import auth from '../auth.js';
import {Form, Grid} from 'semantic-ui-react'
import {Link} from 'react-router-dom';
import styled from 'styled-components'


const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  verticalAlign: center;
  background-color: rgb(242, 242, 242);
`;
const SEFHeader = styled.h1`
  font-family: 'Barlow Semi Condensed';
  font-size: 3em;
  color: rgb(47,67,88);
  padding-bottom: 0.35em;
`;

const AuthButton = styled.button`
  margin: 9px .25em 1em 0em;
  padding: 0.69em 1.15em;
  font-weight: 700;
  line-height: 1em;
  border-radius: 0.28rem;
  font-size: 1.14rem;
  background-color: rgb(47,67,88);
  color: #fdfbf9;
  font-family: Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
  width: 100%;

`;
const GenText = styled.p`
  font-family: 'Century Gothic', sans-serif;
    margin: 0.1em;
`;


class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: null
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    auth.login(this.state.email, this.state.password)
      .then(response => console.log('login reply: ', response))
      .then(() => this.props.history.push("/dashboard"))
      .catch(err => {
        console.log('error ', err);
        this.setState( { error: 'Oops, something went wrong.' })
      })
  };

  render() {
    return (
      <Wrapper>
        <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}</style>

        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <SEFHeader>Log In</SEFHeader>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input icon='user' iconPosition='left' type='text' placeholder="Email" value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} 
                />
              <Form.Input icon='lock' iconPosition='left' type='password' placeholder="Password" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} 
                />
                <p>No account? <Link to="/createaccount">Create an account</Link></p>
                {this.state.error && (<p style={{'font-family': 'Roboto'}} >{this.state.error}</p>) }
              <AuthButton>Log In</AuthButton>
            </Form>
          </Grid.Column>
        </Grid>

      </Wrapper>

    )
  }
}

export default Login;
