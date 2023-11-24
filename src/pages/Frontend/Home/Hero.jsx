import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from 'antd';
import { firestore } from 'config/firebase';
import { useAuthContext } from 'contexts/AuthContext';
import { useLists } from 'contexts/ListsContext';
import { useStickyNotes } from 'contexts/StickyNotesContext';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
const initialState = { title: '', description: '', status: '', date: '' };
const { Title } = Typography;

export default function Hero() {
  const { user } = useAuthContext();
  const { stickyNotes, setStickyNotes, isLoading } = useStickyNotes();
  const { lists } = useLists();
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#F8F9FA');
  const [editingSticky, setEditingSticky] = useState(null);
  // On Change Functionality
  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleColorChange = (color) => {
    setSelectedColor(
      `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, 0.5)`
    );
  };
  const handleDate = (_, date) => {
    setState((s) => ({ ...s, date }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let { title, description, date, status } = state;

    if (!title) {
      return message.error('Please enter title');
    }
    const stick = {
      title,
      description,
      date,
      status,
      dateCreated: serverTimestamp(),
      id: Math.random().toString(36).slice(2),
      color: selectedColor,
      createdBy: {
        fullName: user.fullName,
        email: user.email,
        uid: user.uid,
      },
    };

    setIsProcessing(true);
    try {
      await setDoc(doc(firestore, 'sticky', stick.id), stick);
      message.success('A new todo added successfully');
      setStickyNotes((prevStickyNotes) => [...prevStickyNotes, stick]);
      setState(initialState);
      setSelectedColor('ffffff');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    setState(initialState);
    setIsProcessing(false);
    document.getElementById('exampleModal').classList.remove('show');
    document.body.classList.remove('modal-open');
    document.querySelector('.modal-backdrop').remove();
  };

  // Delete Functionality
  const handleDelete = async (stickyId) => {
    try {
      await deleteDoc(doc(firestore, 'sticky', stickyId));
      message.success('Sticky note deleted successfully');
      setStickyNotes((prevStickyNotes) =>
        prevStickyNotes.filter((sticky) => sticky.id !== stickyId)
      );
    } catch (error) {
      console.error('Error deleting sticky note: ', error);
    }
  };
  // Edit
  const handleEdit = (stickyId) => {
    const stickyToEdit = stickyNotes.find((sticky) => sticky.id === stickyId);
    if (stickyToEdit) {
      setState({
        title: stickyToEdit.title,
        description: stickyToEdit.description,
        date: stickyToEdit.date,
        status: stickyToEdit.status,
      });
      setSelectedColor(stickyToEdit.color);
      setEditingSticky(stickyToEdit.id);
    }
  };

  const handleUpdate = async () => {
    if (!state.title) {
      return message.error('Please enter title');
    }
    const updatedSticky = {
      title: state.title,
      description: state.description,
      color: selectedColor,
      id: editingSticky,
      date: state.date,
      status: state.status,
      dateCreated: serverTimestamp(),
      createdBy: {
        fullName: user.fullName,
        email: user.email,
        uid: user.uid,
      },
    };

    setIsProcessing(true);
    try {
      await setDoc(doc(firestore, 'sticky', editingSticky), updatedSticky);
      message.success('Sticky note updated successfully');
      setStickyNotes((prevStickyNotes) =>
        prevStickyNotes.map((sticky) =>
          sticky.id === editingSticky ? updatedSticky : sticky
        )
      );
      setEditingSticky(null);
      setSelectedColor('#F8F9FA');
      setState(initialState);
    } catch (error) {
      console.error('Error updating sticky note: ', error);
    }
    setIsProcessing(false);
    setEditingSticky(null);
    setState(initialState);
    document.getElementById('exampleModal').classList.remove('show');
    document.body.classList.remove('modal-open');
    document.querySelector('.modal-backdrop').remove();
  };
  if (isLoading)
    return (
      <Space
        size="middle"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Spin size="large" />
      </Space>
    );
  return (
    <>
      <div className="container">
        <ul className="row px-0">
          {stickyNotes?.map((stickyNote) => (
            <li
              className="col-12 col-md-6 col-lg-4"
              style={{ listStyleType: 'none' }}
              key={stickyNote.id}
            >
              <div
                className="stick"
                style={{
                  backgroundColor: stickyNote.color || '#F8F9FA',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '10px',
                  height: '300px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h4>{stickyNote.title}</h4>
                  <div className="dropdown">
                    <div className="dropdown-toggle">⋮</div>
                    <div className="dropdown-content text-center">
                      <button
                        className="edit border border-0 btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => handleEdit(stickyNote.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete border border-0 btn btn-danger"
                        onClick={() => handleDelete(stickyNote.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="stickyDescription">
                  <p>{stickyNote.status}</p>
                  <p>{stickyNote.description}</p>
                </div>
                <p>
                  {stickyNote.dateCreated?.seconds &&
                    new Date(
                      stickyNote.dateCreated.seconds * 1000
                    ).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
          <li
            className="col-12 col-md-6 col-lg-4"
            style={{ listStyleType: 'none' }}
          >
            <button
              style={{
                marginBottom: '10px',
                borderRadius: '10px',
                height: '300px',
              }}
              type="button"
              className="modalOpenBtn border border-1 col-12"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <PlusOutlined style={{ fontSize: '50px' }} />
            </button>
          </li>
        </ul>
      </div>
      <div>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  {editingSticky ? 'Edit Sticky' : 'Add Sticky'}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <Title level={2} className="m-0 text-center">
                    {editingSticky ? 'Edit Sticky' : 'Add Sticky'}
                  </Title>
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col xs={24}>
                        <Form.Item label="Title">
                          <Input
                            placeholder="Input your title"
                            name="title"
                            value={state.title}
                            onChange={handleChange}
                            autoComplete="off"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label="Description">
                          <Input.TextArea
                            placeholder="Input your description"
                            name="description"
                            value={state.description}
                            onChange={handleChange}
                            autoComplete="off"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24} lg={12}>
                        <Form.Item label="Color Selector">
                          <SketchPicker
                            color={selectedColor}
                            onChange={handleColorChange}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} lg={12}>
                        <Form.Item label="Date">
                          <DatePicker
                            className="w-100"
                            style={{ display: 'block' }}
                            getPopupContainer={(trigger) =>
                              trigger.parentElement
                            }
                            onChange={handleDate}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} lg={12}>
                        <Form.Item label="Status">
                          <Select
                            getPopupContainer={(trigger) =>
                              trigger.parentElement
                            }
                            value={state.status}
                            onChange={(status) =>
                              setState((s) => ({ ...s, status }))
                            }
                          >
                            {lists.map((list) => {
                              return (
                                <Select.Option
                                  key={list.listId}
                                  value={list.name}
                                >
                                  {list.name}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                {editingSticky ? (
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="w-50"
                    loading={isProcessing}
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="btn btn-primary"
                    loading={isProcessing}
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
