import React, { Component } from 'react';

import userAvatarImage from './assets/images/user.jpg';
import movieBackground from './assets/images/movie-bg.jpg';

import './App.css';

const handleRent = async (item) => {
  console.log(item);
  const response = await fetch('/rent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      catalog_id: item.id,
      price: item.price
    })
  });
  return response.json();
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      catalog: {
        data: [],
        loaded: false
      },
      rental: {
        data: [],
        loaded: false
      },
      session: {
        name: 'Cindy',
        lastName: 'Lopez',
        username: 'cindy',
        avatar: userAvatarImage
      },
      fixHeader: false
    };

    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    fetch('/catalog')
      .then(res => res.json())
      .then(result => {
        this.setState({
          catalog: {
            data: result,
            loaded: true
          }
        });
      });

    fetch('/rentals')
      .then(res => res.json())
      .then(result => {
        this.setState({
          rental: {
            data: result,
            loaded: true
          }
        });
      });

    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll() {
    this.setState({
      fixHeader: window.scrollY > 100
    });
  }

  render() {
    const { catalog, rental, session } = this.state;
    return (
      <div className="App">
        <header className={`Header ${this.state.fixHeader ? 'fixed' : ''}`}>
          <div className="content">
            <div className="logo">Movies</div>
            <ul className="menu">
              <li className="selected">Home</li>
              <li>Movies</li>
              <li>Store</li>
            </ul>
            <UserProfile user={session} />
          </div>
        </header>
        <Hero />
        <TitleList
          title="Movies to Rent"
          titles={catalog.data}
          loaded={catalog.loaded}
          rent
        />
        <TitleList
          title={`${session.name}'s movies`}
          titles={rental.data}
          loaded={rental.loaded}
        />
      </div>
    );
  }
}


class Loader extends Component {
  render() {
    return (
      <div className="Loader">
        <svg version="1.1" id="loader" x="0px" y="0px"
          width="40px"
          height="40px"
          viewBox="0 0 50 50"
          style={{
            enableBackground: 'new 0 0 50 50'
          }}>
          <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
            <animateTransform attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.6s"
              repeatCount="indefinite"/>
          </path>
        </svg>
      </div>
    );
  }
}


class UserProfile extends Component {
  render() {
    const { user } = this.props;
    return (
      <div className="UserProfile">
        <div className="User">
          <div className="name">{`${user.name} ${user.lastName}`}</div>
          <div className="image"><img src={user.avatar} alt="profile" /></div>
        </div>
      </div>
    );
  }
}


class Hero extends Component {
  render() {
    return (
      <div id="hero" className="Hero" style={{ backgroundImage: `url(${movieBackground})` }}>
        <div className="spring" />
        <div className="content">
          <h1>Bohemian Rhapsody</h1>
          <p>
            Queen take the music world by storm when they form the rock &apos;n&apos; roll
            band in 1970.
          </p>
          <div className="button-container">
            <HeroButton class="play-button">
              <svg className="icon play-icon" width="20" height="20" viewBox="0 0 512 512">
                <path d="M405.2 232.9L126.8 67.2c-3.4-2-6.9-3.2-10.9-3.2-10.9 0-19.8 9-19.8 20H96v344h.1c0 11 8.9 20 19.8 20 4.1 0 7.5-1.4 11.2-3.4l278.1-165.5c6.6-5.5 10.8-13.8 10.8-23.1s-4.2-17.5-10.8-23.1z"/>
              </svg>
              Play
            </HeroButton>
          </div>
        </div>
        <div className="overlay"></div>
      </div>
    );
  }
}


class HeroButton extends Component {
  render() {
    return (
      <a href="#" className="Button">{this.props.children}</a>
    );
  }
}


class TitleList extends Component {
  renderList() {
    const { titles, loaded, rent } = this.props;

    if (titles && loaded) {
      return titles.map((item, i) => {
        if (i < 4) {
          let name = '';
          const backDrop = `https://image.tmdb.org/t/p/original${item.backdrop_path}`;
          if (!item.name) {
            name = item.original_title;
          } else {
            name = item.name;
          }
          return (
            <Item
              key={item.id}
              item={item}
              backdrop={backDrop}
              rent={rent}
            />
          );
        }
        return (
          <div key={item.id}></div>
        );
      });
    }
  }

  render() {
    const { title } = this.props;

    return (
      <div className="TitleList">
        <div className="Title">
          <h1>{title}</h1>
          <div className="titles-slider">
            {this.renderList() || <Loader />}
          </div>
        </div>
      </div>
    );
  }
}


class Item extends Component {
  render() {
    const { item, rent, backdrop } = this.props;

    return (
      <div className="Item">
        <div className="ItemContainer" style={{ backgroundImage: `url(${backdrop})` }}>
          <div className="overlay">
            <div className="title">{item?.original_title ?? 'Unknown Title'}</div>
            <div className="rating">{item?.vote_average ?? 0} / 10</div>
          </div>
          { rent &&
            <div className="ItemToolbar">
              <div className="button" onClick={() => handleRent(item)}>
                Rent{item?.price ? ` for \$${item.price}` : ''}
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
