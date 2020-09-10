import React, {Component} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import api from '../api.js'
import auth from '../auth.js';

const Wrapper = styled.div`
    min-height: 100vh;
    width: 100%;
    background: #616161;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
`;

const Sidebar = styled.div`
    flex: 1;
    color: white;
    width: 50px;
    height: 30px;
    float: left;
    align-items: stretch;
`;
const Header = styled.div`
background-color: grey;
flex:1;
display: flex;
flex-direction: column;
`;
const First = styled.div`
background-color: #FFF;
flex:1;
`;

const Second = styled.div`
flex: 1;
display: flex;
flex-direction: column;
`;

const Box1 = styled.div`
background-color: blue;
flex:1;
`;
const Box2 = styled.div`
background-color: black;
flex:1
`;


export default class StyledTesting extends Component {
  constructor() {
    super();
    this.state = {
      userObj: {},
      entries: [],
      geoTaggedEntries:[]
    }
  }

  componentDidMount() {
    //requestEntries uzima dva argumenta - token i broj koliko dana unazad zelimo da pretrazujemo unose
    //"7" znaci da zadnjih 7 dana posmatramo
    api.requestEntries(auth.getToken(),7)
      .then(reply => 
        this.setState({ entries: reply.body })
    );
    //isto i sa requestGeotaggedEntries
    api.requestGeotaggedEntries(auth.getToken(),7)
    .then(reply => 
      this.setState({ geoTaggedEntries: reply.body })
  );
    const userObj = auth.getUser();
    console.log('userobj', userObj)
    this.setState({ userObj })

  }
  render() {
    return (

  
      <Wrapper>

      <Sidebar>
      <div className="sidebar">
          <div><Link to="/dashboard">Dashboard</Link></div>
          <div><Link to="/dashboard">Map</Link></div>
          <div><Link to="/dashboard">Graphs</Link></div>
      </div>
      </Sidebar>

<Header>
<First> 

<p>Hello</p>

</First>
<Second>
<Box1>
testsadf
asdf
</Box1>

<Box2>
test2
</Box2>
</Second>

</Header>

      </Wrapper>
    )
  }
}
