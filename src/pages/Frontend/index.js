import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import {
  AiOutlineCalendar,
  AiOutlineDelete,
  AiOutlinePlus,
} from 'react-icons/ai';
import { MdOutlineToday } from 'react-icons/md';
import { BsChevronDoubleRight, BsSticky } from 'react-icons/bs';
import { GoSignOut } from 'react-icons/go';
import {
  Layout,
  Menu,
  Button,
  theme,
  message,
  Modal,
  FloatButton,
  Divider,
  Form,
  Row,
  Col,
  Input,
  Space,
  Spin,
} from 'antd';
import { useAuthContext } from 'contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, firestore } from 'config/firebase';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Calendar from './Calendar';
import Upcoming from './Upcoming';
import Today from './Today';
import List from './List';
import {
  deleteDoc,
  doc,
  setDoc,
} from 'firebase/firestore';
import Title from 'antd/es/skeleton/Title';
import { useLists } from 'contexts/ListsContext';
import { useEffect } from 'react';
const { Header, Sider, Content } = Layout;
export default function Hero() {
  const { lists, setLists, isLoading } = useLists();
  const { isAuth, dispatch, user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [addList, setAddList] = useState('');
  const [deletingListId, setDeletingListId] = useState(null);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        message.success('Signout successful');
        dispatch({ type: 'SET_LOGGED_OUT' });
      })
      .catch((err) => {
        message.error('Signout not successful: ' + err);
      });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const listData = {
    listId: Math.random().toString(36).slice(2),
    name: addList,
    // userId: user.uid,
    createdBy: {
      fullName: user.fullName,
      email: user.email,
      uid: user.uid,
    },
  };
  const handleAddList = async () => {
    try {
      await setDoc(doc(firestore, 'lists', listData.listId), listData);
      setLists([...lists, listData]);
      setAddList('');
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
      return;
    }
  };
  const handleChange = (e) => {
    setAddList(e.target.value);
  };
  const handleDeleteList = async (listId) => {
    try {
      setDeletingListId(listId);

      // Remove the list from Firestore
      await deleteDoc(doc(firestore, 'lists', listId));

      // Update the local state to remove the deleted list
      const updatedLists = lists.filter((list) => list.listId !== listId);
      setLists(updatedLists);

      message.success('List deleted successfully');
    } catch (error) {
      console.error('Error deleting list:', error);
      message.error('Error deleting list');
    } finally {
      setDeletingListId(null);
    }
  };

  const handleScreenWidthChange = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleScreenWidthChange);
    return () => {
      window.removeEventListener('resize', handleScreenWidthChange);
    };
  }, []);

  useEffect(() => {
    if (screenWidth < 768) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [screenWidth]);
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
      <Layout>
        <Sider
          className="ps-2 bg-light"
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ position: 'fixed', left: 0, height: '100vh' }}
        >
          <div className="demo-logo-vertical pt-3 ps-3 mt-3" />
          <div className="toggleDiv">
            <h3 className="tsk">Tasks</h3>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                display: 'flex',
                fontSize: '16px',
              }}
            />
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={['5']}
            items={[
              {
                key: '/upcoming',
                icon: <BsChevronDoubleRight />,
                label: (
                  <Link to="/upcoming" className="text-decoration-none">
                    Upcoming
                  </Link>
                ),
              },
              {
                key: '/today',
                icon: <MdOutlineToday />,
                label: (
                  <Link to="/today" className="text-decoration-none">
                    Today
                  </Link>
                ),
              },
              {
                key: '4',
                icon: <AiOutlineCalendar />,

                label: (
                  <Link to="/calendar" className="text-decoration-none">
                    Calendar
                  </Link>
                ),
              },
              {
                key: '/',
                icon: <BsSticky />,
                label: (
                  <Link to="/" className="text-decoration-none">
                    Sticky Wall
                  </Link>
                ),
                to: 'stickywall',
              },
            ]}
          />
          <Button type="dashed" className="mt-2 w-100" onClick={showModal}>
            <AiOutlinePlus /> &nbsp; Add New list
          </Button>

          <ul>
            {lists?.map((list) => {
              const isDeleting = deletingListId === list.listId;
              return (
                <li
                  key={list.listId}
                  className="mt-3"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Link
                    className="text-decoration-none"
                    to={`/list/${list.listId}`}
                  >
                    {list.name}
                  </Link>
                  <button
                    className="border-0 btn btn-danger px-1 py-0"
                    onClick={() => handleDeleteList(list.listId)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : <AiOutlineDelete />}
                  </button>
                </li>
              );
            })}
          </ul>

          <Modal
            title="Basic Modal"
            open={isModalOpen}
            onOk={handleAddList}
            onCancel={handleCancel}
            okText="Submit"
          >
            <Title level={2} className="m-0 text-center">
              Add Todo
            </Title>

            <Divider />

            <Form layout="vertical">
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Form.Item label="Add List Name">
                    <Input
                      placeholder="Input your List Name"
                      name="list"
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
          {isAuth && (
            <>
              <Link className="logoutBtn ms-2" onClick={handleLogout}>
                <GoSignOut size={20} /> Sign Out
              </Link>
            </>
          )}
        </Sider>
        <Layout
          className="site-layout"
          style={{ marginLeft: collapsed ? 80 : 200 }}
        >
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          ></Header>
          {/* <h1 className="ps-2">Sticky Wall</h1> */}
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <FloatButton />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="upcoming" element={<Upcoming />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="today" element={<Today />} />
              <Route path="list/:listId" element={<List />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
