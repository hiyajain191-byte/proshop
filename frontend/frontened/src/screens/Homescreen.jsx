import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import Product from '../components/Product';
import Loader from '../components/loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

import { useGetProductsQuery } from '../slices/productapiSlice';

const Homescreen = () => {
  const { pageNumber, keyword } = useParams();

  const page = Number(pageNumber) || 1;
  const searchKeyword = keyword ? keyword : '';

  const { data, isLoading, error } = useGetProductsQuery({
    pageNumber: page,
    keyword: searchKeyword,
  });

  const products = data?.products || [];
  const pages = data?.pages || 1;

  return (
    <>
      {/* ⭐ SEO META */}
      <Meta />

      {/* ⭐ CAROUSEL ONLY ON HOME */}
      {!searchKeyword && <ProductCarousel />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>
            {searchKeyword
              ? `Search Results: ${searchKeyword}`
              : 'Latest Products'}
          </h1>

          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>

          <Paginate
            pages={pages}
            page={page}
            keyword={searchKeyword}
          />
        </>
      )}
    </>
  );
};

export default Homescreen;