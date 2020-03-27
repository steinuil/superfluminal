import React from 'react';
import { FC, useMemo } from 'react';
import { Navbar, Nav, NavItem, Input, Form, Button } from 'reactstrap';
import { Link, NavLink as NavLinkRouter } from 'react-router-dom';
import { search_qs } from '../searchOld';
import { mapChangeEv, preventDefault } from '../EventHelpers';
import { criteria } from '../SearchParser';

interface SearchLinkProps {
  to?: string;
  query: string;
  setQuery: (newQuery: string) => void;
}

const SearchLink: FC<SearchLinkProps> = ({
  to = '',
  query,
  setQuery,
  children,
}) => (
  <a
    className={`nav-link ${query === to ? 'active' : ''}`}
    href={search_qs(to)}
    onClick={preventDefault(() => setQuery(to))}
  >
    {children}
  </a>
);

interface Props {
  query: string;
  setQuery: (newQuery: string) => void;
}

export const NavigationBar: FC<Props> = ({ query, setQuery }) => {
  const isValid = useMemo(() => criteria.parse(query).isOk, [query]);

  return (
    <Navbar color="light" expand>
      <Link to="/" className="navbar-brand mr-4" onClick={() => setQuery('')}>
        receptacle
      </Link>
      <Nav navbar className="mr-auto">
        <NavItem>
          <NavLinkRouter
            className="nav-link btn btn-primary btn-sm mr-2"
            to="/add-torrent"
          >
            add torrent
          </NavLinkRouter>
        </NavItem>
        <NavItem>
          <SearchLink query={query} setQuery={setQuery}>
            all
          </SearchLink>
        </NavItem>
        <NavItem>
          <SearchLink to="status:leeching" query={query} setQuery={setQuery}>
            leeching
          </SearchLink>
        </NavItem>
        <NavItem>
          <SearchLink to="status:seeding" query={query} setQuery={setQuery}>
            seeding
          </SearchLink>
        </NavItem>
      </Nav>
      <Form className="form-inline" onSubmit={(ev) => ev.preventDefault()}>
        <Input
          type="search"
          bsSize="sm"
          className="mr-1"
          value={query}
          onChange={mapChangeEv(setQuery)}
          invalid={!isValid}
        />
        <Button size="sm" type="submit">
          Search
        </Button>
      </Form>
    </Navbar>
  );
};
