import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import DisplayEntries from './DisplayEntries';
import NavBar from './NavBar';
import SimpleMap from './SimpleMap';
import api from '../api.js';
import auth from '../auth.js';
import SimpleChart from './SimpleChart';
import WriteEntryNew from './WriteEntryNew';
import styled, {css} from 'styled-components';
import {Button, Header} from 'semantic-ui-react';
import ReadEntry from './ReadEntry';
import EditEntry from './EditEntry';


const MainWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 15% 67%;
  font-family: Barlow Semi Condensed;
  font-size: 1.02em;
`;


const SideBarChoices = styled.div`
  display: grid;
  position: relative;
  width: 100%;
  padding-top: 0.59em;
  align-items: center;
`;

const Options = styled.span`
  padding: 0.7rem;
  color: rgb(47,67,88);
  display: inline-block;
  &:hover {
    display: inline-block;
  }
`;

const sidebarActiveStyles = css`
  background: rgba(143,159,178,.7);
  transform: scale(1.2);
  & > span{
    color: #fdfbf9;
  }
`;
const SidebarLink = styled.div`
  border-radius: 0.35rem;
  &:hover {
    ${sidebarActiveStyles};
  }
  ${props => props.isActive && css`
      ${sidebarActiveStyles};
  `};
`;

const ContentWrapper = styled.div`
  left: 18%;
  position: absolute;
  width: 77%;
  height: 100%;
  display: grid;
  margin-top: 3.5%;
  padding: 0 0 3rem 0;
`;


const NavHeader = styled(Header)`
  &&& {
    margin: 0;
    font-family: Barlow Semi Condensed;
    font-size: 1.85714em;
    font-weight: 400;
  
  }
`;
const NavButton = styled(Button)`
  && {
  padding: 10px;
  margin-left: 8px;
  background-color: #7e7c88;
  color: rgb(246, 244, 244);
  }
`;

const ResultsHeader = props => {
  let currentPeriod =
    props.currentPeriod === 1
      ? 'day'
      : props.currentPeriod === 7
        ? 'week'
        : props.currentPeriod === 10
          ? '10 days'
          : props.currentPeriod === 30
            ? 'month'
            : props.currentPeriod === 90
              ? '3 months'
              : props.currentPeriod === 180
                ? '6 months'
                : props.currentPeriod === 365 ? 'year' : null;

  let currentSearch = props.currentSearchTerm ? props.currentSearchTerm : null;

  let periodText = currentPeriod
    ? `Showing entries from the past ${currentPeriod}`
    : null;
  let searchText = currentSearch
    ? `Showing entries matching "${currentSearch}"`
    : null;
  let periodAndSearchText =
    currentPeriod && currentSearch
      ? `Showing entries matching "${currentSearch}" in the past ${
          currentPeriod
        }`
      : null;
  let genericText = `All entries`;

  return (
    <NavHeader>
      {periodAndSearchText
        ? periodAndSearchText
        : periodText ? periodText : searchText ? searchText : genericText}
      {periodAndSearchText||periodText||searchText?<NavButton onClick={props.searchReset}>reset</NavButton>:null}
    </NavHeader>
  );
};


class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      userObj: {},
      entries: [],
      geotaggedEntries: [],
      //searchPeriod je period koji pretrazujemo, kada kliknemo search dugme.
      //"currentPeriod" je period trenutno prikazan ("currently showing results from the past X days")
      searchPeriod: '',
      currentPeriod: 7,
      searchTerm: '',
      currentSearchTerm: '',
      moodLimit: ''
    };
  }

  componentDidMount() {
    //populise this.state.geotaggedEntries filtrirajuci unose.
    this.loadEntries();
    const userObj = auth.getUser();
    console.log('userobj', userObj);
    this.setState({ userObj });
  }

  loadEntries = () => {
    api
      .requestEntries(
        auth.getToken(),
        this.state.searchPeriod,
        this.state.searchTerm,
        this.state.moodLimit
      )
      .then(reply =>
        this.setState({
          //populise state i update-a trenutno prikazani period i searchTerm,
          //kako bi header znao sta da prikaze
          entries: reply.body,
          geotaggedEntries: reply.body.filter(entry => !!entry.lat),
          currentPeriod: this.state.searchPeriod,
          currentSearchTerm:this.state.searchTerm
        })
      );
  };

  handleClick = () => {
    this.loadEntries();
  };
  searchReset = () => {
    this.setState(
      {
        searchPeriod: '',
        searchTerm: ''
      },
      this.loadEntries
    );
  };

  render() {
    return (
      <div className="dashboard">
        <NavBar
          hist={this.props.history}
          updateSearchTerm={searchTerm => this.setState({ searchTerm })}
          updatePeriod={searchPeriod => this.setState({ searchPeriod })}
          searchTermValue={this.state.searchTerm}
          periodValue={this.state.searchPeriod}
          handleClick={this.handleClick}
          resultsHeader={
            <ResultsHeader
              currentSearchTerm={this.state.currentSearchTerm}
              currentPeriod={this.state.currentPeriod}
              searchReset={this.searchReset}
            />
          }
        />

        <MainWrapper>
          <div
            className="side-bar-wrapper"
            style={{ position: 'fixed', width: 12 + '%', left: '3%', display:'flex', height: '400px' }}
          >
            <SideBarChoices>
              <Link to="/dashboard/entries" style={{ textDecoration: 'none' }}>
                <SidebarLink isActive={this.props.page === 'entries'}>
                  <Options>Entries</Options>
                </SidebarLink>
              </Link>
              <Link to="/dashboard/stats" style={{ textDecoration: 'none' }}>
                <SidebarLink isActive={this.props.page === 'stats'}>
                  <Options>Stats</Options>
                </SidebarLink>
              </Link>
              <Link to="/dashboard/map" style={{ textDecoration: 'none' }}>
                <SidebarLink isActive={this.props.page === 'map'}>
                  <Options>Map</Options>
                </SidebarLink>
              </Link>
            </SideBarChoices>
          </div>

          <ContentWrapper>
            <Route
              exact
              path={`/dashboard`}
              render={() => {
                return <DisplayEntries entries={this.state.entries} />;
              }}
            />
            <Route
              path={`/dashboard/entries`}
              render={() => {
                return <DisplayEntries entries={this.state.entries} />;
              }}
            />
            
            <Route
              path={`/dashboard/stats`}
              render={() => {
                return (
                  <SimpleChart
                    hist={this.props.history}
                    entries={this.state.entries.slice().reverse()}
                  />
                );
              }}
            />
            <Route
              path={`/dashboard/map`}
              render={() => {
                let reversedGeotaggedEntries = [...this.state.geotaggedEntries].reverse()
                return (
                  <SimpleMap geotaggedEntries={reversedGeotaggedEntries} />
                );
              }}
            />
            <Route
              path={`/dashboard/writeentry`}
              render={() => {
                return (
                  <WriteEntryNew
                    history={this.props.history}
                    reloadEntries={this.loadEntries}
                  />
                );
              }}
            />

            <Route
              path={`/dashboard/editentry/:id`}
              render={props => {
                return <EditEntry {...props} reloadEntries={this.loadEntries} history={this.props.history} />;
              }}
            />
            <Route
              path={`/dashboard/readentry/:id`}
              render={props => {
                return <ReadEntry {...props} history={this.props.history} />;
              }}
            />
          </ContentWrapper>
        </MainWrapper>

      </div>
    );
  }
}

export default Dashboard;
