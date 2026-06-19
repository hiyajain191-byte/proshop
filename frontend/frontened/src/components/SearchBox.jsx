import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    const trimmed = keyword.trim();

    if (trimmed) {
      navigate(`/search/${trimmed}/page/1`);
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Products..."
      />

      <Button type="submit" variant="outline-success" className="mx-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;