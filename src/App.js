import './App.scss';
import 'bootstrap/dist/js/bootstrap.bundle';
import Routes from './pages/Routes';
import { Space, Spin } from 'antd';
import { useAuthContext } from 'contexts/AuthContext';
function App() {
  const {isAppLoading} = useAuthContext()
  if (isAppLoading)
    return (
     <Space size='middle' style={{ minHeight: "100vh", display: 'flex', flexDirection: 'column', justifyContent: 'center',alignContent: 'center'}}>
      <Spin size='large'/>
     </Space>
    )

  return (
    <>
      <Routes />
    </>
  );
}

export default App;
