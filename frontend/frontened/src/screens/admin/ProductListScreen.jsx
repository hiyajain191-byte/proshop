import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';

import Message from '../../components/Message';
import Loader from '../../components/loader';
import Paginate from '../../components/Paginate';

import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productapiSlice';

import { toast } from 'react-toastify';

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const page = Number(pageNumber || 1);

  const { data, isLoading, error, refetch } =
    useGetProductsQuery({ pageNumber: page });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  // 🗑 DELETE
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err?.error);
      }
    }
  };

  // ➕ CREATE
  const createProductHandler = async () => {
    if (window.confirm('Create new product?')) {
      try {
        await createProduct().unwrap();
        toast.success('Product created');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err?.error);
      }
    }
  };

  // ✅ FIXED RESPONSE STRUCTURE
  const products = data?.products || [];
  const pages = data?.pages;
  const currentPage = data?.page;

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>

        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error}
        </Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>

                  <td>
                    <Button
                      as={Link}
                      to={`/admin/product/${product._id}/edit`}
                      variant="light"
                      className="btn-sm mx-2"
                    >
                      <FaEdit />
                    </Button>

                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* PAGINATION */}
          <Paginate
            pages={pages}
            page={currentPage}
            isAdmin={true}
          />
        </>
      )}
    </>
  );
};

export default ProductListScreen;