import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination className="justify-content-center mt-4">
        {[...Array(pages).keys()].map((x) => (
          <Pagination.Item
            key={x + 1}
            as={Link}
            to={
              isAdmin
                ? `/admin/productlist/${x + 1}`
                : keyword
                ? `/search/${keyword}/page/${x + 1}`
                : `/page/${x + 1}`
            }
            active={x + 1 === page}
          >
            {x + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;