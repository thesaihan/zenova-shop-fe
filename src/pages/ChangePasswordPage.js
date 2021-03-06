import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { getHeaderConfig } from "../utils/functions";
import {
  logoutAction,
  clearCreatedOrder,
  clearExistingOrder,
  clearShippingInfoAction,
  clearRegisteredUser,
  removeCartItems,
  clearMyOrders,
} from "../actions";

export const ChangePasswordPage = ({ history }) => {
  const dispatch = useDispatch();
  const { data: currentUser } = useSelector((state) => state.currentUserState);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordReentered, setPasswordReentered] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const redirect = () => setTimeout(() => history.push("/login"), 800);

  const goLogoutAndRelogin = () => {
    dispatch(logoutAction());
    dispatch(clearCreatedOrder());
    dispatch(clearExistingOrder());
    dispatch(clearShippingInfoAction());
    dispatch(clearRegisteredUser());
    dispatch(removeCartItems());
    dispatch(clearMyOrders());
  };

  const goChangePassword = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    axios
      .post(
        "/users/change-password",
        { currentPassword, password, passwordReentered },
        getHeaderConfig(currentUser)
      )
      .then((res) => {
        res.data.success && setSuccess(res.data.message);
        goLogoutAndRelogin();
        setTimeout(() => {
          toggle();
          setLoading(false);
        }, 1600);
      })
      .catch((error) => {
        setLoading(false);
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
      });
  };

  const goBack = (e) => {
    e.preventDefault();
    history.goBack();
  };

  return (
    <div className="ChangePasswordPage">
      <Row className="justify-content-sm-center">
        <Col xs={12} sm={10} md={6}>
          <div className="d-flex align-items-center mb-4">
            <a href="/" className="btn btn-light" onClick={goBack}>
              <i className="fas fa-chevron-left mr-2"></i>
              Back
            </a>
            <h3 className="text-center ml-4 my-0">Change Password</h3>
          </div>
          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">{success}</Alert>}
          <Form onSubmit={goChangePassword}>
            <FormGroup>
              <Label htmlFor="currentPassword">Current Password *</Label>
              <Input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">New Password *</Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="6 - 30 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="passwordReentered">Re-enter New Password *</Label>
              <Input
                type="password"
                id="passwordReentered"
                name="passwordReentered"
                placeholder="6 - 30 characters"
                value={passwordReentered}
                onChange={(e) => setPasswordReentered(e.target.value)}
                required
              />
            </FormGroup>
            <Button
              type="submit"
              color="dark"
              className="my-2"
              disabled={loading}
            >
              Change Password
            </Button>
          </Form>
        </Col>
      </Row>
      <Modal isOpen={isOpen} toggle={toggle} onClosed={redirect}>
        <ModalHeader>Redirect</ModalHeader>
        <ModalBody>Please logout and login again.</ModalBody>
        <ModalFooter>
          <Button color="dark" onClick={toggle}>
            Logout
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
