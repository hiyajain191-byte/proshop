import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import logo from '../assests/logo.png';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  // 🔥 CART STATE
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>

          {/* BRAND */}
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex align-items-center">
              <img
                src={logo}
                alt="ProShop"
                style={{ height: '32px', marginRight: '10px' }}
              />
              ProShop
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">

            <Nav className="me-auto"></Nav>

            <Nav className="ms-auto align-items-center">

              {/* SEARCH BOX */}
              <div className="me-3">
                <SearchBox />
              </div>

              {/* CART WITH COUNT */}
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> Cart{' '}
                  {cartCount > 0 && (
                    <span
                      style={{
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        padding: '2px 6px',
                        fontSize: '12px',
                        marginLeft: '5px',
                        color: 'white',
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>

              {/* ADMIN */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

              {/* USER */}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item onClick={handleProfile}>
                    Profile
                  </NavDropdown.Item>

                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;